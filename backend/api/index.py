import hmac
import ipaddress
import json
import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Annotated, Literal
from urllib.parse import parse_qs, urlsplit
from uuid import UUID

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, StringConstraints, ValidationError
from starlette.concurrency import run_in_threadpool

from mongo_store import (
    enqueue_submission,
    find_existing_submission,
    get_database,
    get_submission_status,
    IdempotencyConflict,
    process_inquiry,
    reserve_contact_request,
    reserve_submission,
    retry_due_inquiries,
)

logger = logging.getLogger(__name__)
ALLOWED_ORIGIN = "https://krishujeniya.github.io"
CLOUDFLARE_ORIGIN = "https://krishujeniya.pages.dev"
ALLOWED_ORIGINS = [
    ALLOWED_ORIGIN,
    CLOUDFLARE_ORIGIN,
]
ALLOWED_HOSTNAMES = {
    "krishujeniya.github.io",
    "krishujeniya.pages.dev",
}
MAX_REQUEST_BYTES = 64_000
SMTP_TIMEOUT_SECONDS = 3

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

ShortText = Annotated[str, StringConstraints(strip_whitespace=True, max_length=500)]
NameText = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
ProjectMessage = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=5000)]


class ContactForm(BaseModel):
    submissionId: UUID | None = None
    name: NameText
    email: EmailStr
    company: ShortText = "Not provided"
    role: Literal[
        "Founder / Co-founder",
        "CTO / VP Engineering",
        "Engineering Lead / Manager",
        "Product Manager",
        "Data / ML Team Lead",
        "Individual / Freelancer",
        "Other",
        "Not provided",
    ] = "Not provided"
    services: list[Literal[
        "Enterprise RAG", "Agentic AI", "MLOps Architecture", "ML Consulting", "Not Sure Yet"
    ]] = Field(default_factory=list, max_length=1)
    stage: list[Literal[
        "Greenfield Build", "Improve Existing System", "Proof of Concept", "Just Exploring"
    ]] = Field(default_factory=list, max_length=1)
    techStack: ShortText = "Not provided"
    budget: Literal[
        "Under $5,000", "$5,000–$15,000", "$15,000–$30,000", "$30,000+", "Let's Discuss", "Not selected"
    ] = "Not selected"
    timeline: Literal[
        "ASAP (within 2 weeks)", "1–3 months", "3–6 months", "Flexible", "No hard deadline", "Not selected"
    ] = "Not selected"
    discoverySource: Literal[
        "LinkedIn", "GitHub", "Google Search", "Hugging Face", "Personal Referral", "Medium", "Other", "Not provided"
    ] = "Not provided"
    preferredContactMethod: Literal[
        "Email", "Schedule a Call", "WhatsApp", "No Preference", "Not provided"
    ] = "Not provided"
    message: ProjectMessage
    honeypot: ShortText | None = None


def send_mail(to_email: str, subject: str, body: str) -> None:
    sender = os.environ.get("EMAIL_USER")
    password = os.environ.get("EMAIL_PASS")
    if not sender or not password:
        raise RuntimeError("Email credentials are not configured")

    message = MIMEMultipart()
    message["From"] = f"Krish Ujeniya <{sender}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=SMTP_TIMEOUT_SECONDS) as server:
        server.starttls()
        server.login(sender, password)
        server.send_message(message)


def is_allowed_source(request: Request) -> bool:
    origin = request.headers.get("origin")
    source = origin if origin is not None else request.headers.get("referer")
    if not source:
        return False

    try:
        parsed = urlsplit(source)
        port = parsed.port
    except ValueError:
        return False

    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_HOSTNAMES:
        return False
    if parsed.username or parsed.password or port not in (None, 443):
        return False
    if origin:
        return parsed.path in ("", "/") and not parsed.query and not parsed.fragment
    return parsed.path in ("", "/", "/krishujeniya", "/krishujeniya/") and not parsed.query and not parsed.fragment


async def parse_contact_form(request: Request) -> ContactForm:
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_REQUEST_BYTES:
                raise HTTPException(status_code=413, detail="Request is too large.")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid content length.") from None

    body = bytearray()
    async for chunk in request.stream():
        if len(body) + len(chunk) > MAX_REQUEST_BYTES:
            raise HTTPException(status_code=413, detail="Request is too large.")
        body.extend(chunk)
    raw_body = bytes(body)

    if len(raw_body) > MAX_REQUEST_BYTES:
        raise HTTPException(status_code=413, detail="Request is too large.")

    content_type = request.headers.get("content-type", "").split(";", 1)[0].strip().lower()
    try:
        if content_type == "application/json":
            payload = json.loads(raw_body)
            if not isinstance(payload, dict):
                raise ValueError("JSON body must be an object")
        elif content_type == "application/x-www-form-urlencoded":
            values = parse_qs(raw_body.decode("utf-8"), keep_blank_values=True)
            payload = {key: items if key in {"services", "stage"} else items[-1] for key, items in values.items()}
            if "preferredContactMethod" not in payload and "contactMethod" in payload:
                payload["preferredContactMethod"] = payload["contactMethod"]
        else:
            raise HTTPException(status_code=415, detail="Unsupported content type.")
        return ContactForm.model_validate(payload)
    except HTTPException:
        raise
    except (UnicodeDecodeError, ValueError, ValidationError) as error:
        logger.info("Rejected invalid contact request: %s", type(error).__name__)
        raise HTTPException(status_code=422, detail="Invalid contact form.") from None


def get_client_ip(request: Request) -> str:
    raw_ip = (
        request.headers.get("cf-connecting-ip")
        or request.headers.get("x-forwarded-for")
        or (request.client.host if request.client else "")
    )
    client_ip = raw_ip.split(",")[0].strip()
    try:
        return str(ipaddress.ip_address(client_ip))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid client address.") from None


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Krishu Jeniya API is active and private."}


@app.get("/api/health/ready")
async def readiness() -> dict[str, str]:
    try:
        await run_in_threadpool(lambda: get_database().command("ping"))
    except Exception:
        logger.exception("MongoDB readiness check failed")
        raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None
    return {"status": "ready"}


@app.post("/api/webDATA")
async def handle_webhook(request: Request) -> dict[str, str]:
    if not is_allowed_source(request):
        raise HTTPException(status_code=403, detail="Unauthorized request source.")

    data = await parse_contact_form(request)
    if data.honeypot:
        return {"status": "success", "info": "bot_detected"}

    client_ip = get_client_ip(request)
    try:
        request_allowed = await run_in_threadpool(reserve_contact_request, client_ip)
    except Exception:
        logger.exception("Portfolio contact request limit failed")
        raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None
    if not request_allowed:
        raise HTTPException(status_code=429, detail="Too many inquiries. Please try again later.")

    services = ", ".join(data.services) if data.services else "Not selected"
    stages = ", ".join(data.stage) if data.stage else "Not selected"
    formatted_text = (
        f"Name : {data.name}\nEmail : {data.email}\nCompany : {data.company}\nRole : {data.role}\n"
        f"Services : {services}\nProject Stage : {stages}\nTech Stack : {data.techStack}\n"
        f"Budget : {data.budget}\nTimeline : {data.timeline}\nDiscovery Source : {data.discoverySource}\n"
        f"Preferred Contact : {data.preferredContactMethod}\nProject Details :\n{data.message}\n"
    )

    user_body = (
        f"Hey {data.name},\n\nThank you for reaching out — your hiring request has been received.\n\n"
        f"Details below:\n{formatted_text}\nI'll get back to you within 24 hours.\n\nBest,\nKrish Ujeniya"
    )
    payload = {"email": str(data.email), "formattedText": formatted_text, "userBody": user_body}
    submission_id = str(data.submissionId) if data.submissionId else None
    inquiry_id = None
    existing_submission = None
    if submission_id:
        try:
            existing_submission = await run_in_threadpool(find_existing_submission, submission_id, payload)
        except IdempotencyConflict:
            raise HTTPException(
                status_code=409,
                detail="Submission id was already used for another inquiry.",
            ) from None
        except Exception:
            logger.exception("Portfolio inquiry lookup failed")
            raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None
    if existing_submission:
        inquiry_id, status = existing_submission
        if status == "failed":
            raise HTTPException(status_code=503, detail="Inquiry delivery could not be completed.")

    if inquiry_id is None:
        try:
            allowed = await run_in_threadpool(reserve_submission, client_ip)
        except Exception:
            logger.exception("Portfolio inquiry rate-limit check failed")
            raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None
        if not allowed:
            if submission_id:
                try:
                    existing_submission = await run_in_threadpool(
                        find_existing_submission,
                        submission_id,
                        payload,
                    )
                except IdempotencyConflict:
                    raise HTTPException(
                        status_code=409,
                        detail="Submission id was already used for another inquiry.",
                    ) from None
                except Exception:
                    logger.exception("Portfolio inquiry retry lookup failed")
                    raise HTTPException(
                        status_code=503,
                        detail="Inquiry service is temporarily unavailable.",
                    ) from None
                if existing_submission:
                    inquiry_id, status = existing_submission
                    if status == "failed":
                        raise HTTPException(status_code=503, detail="Inquiry delivery could not be completed.")
            if inquiry_id is None:
                raise HTTPException(status_code=429, detail="Too many inquiries. Please try again later.")

    if inquiry_id is None:
        try:
            inquiry_id = await run_in_threadpool(enqueue_submission, payload, submission_id)
        except IdempotencyConflict:
            raise HTTPException(
                status_code=409,
                detail="Submission id was already used for another inquiry.",
            ) from None
        except Exception:
            logger.exception("Portfolio inquiry could not be stored")
            raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None

    try:
        delivered = await run_in_threadpool(process_inquiry, inquiry_id, send_mail)
        if not delivered:
            status = await run_in_threadpool(get_submission_status, inquiry_id)
            if status == "failed":
                raise HTTPException(status_code=503, detail="Inquiry delivery could not be completed.")
    except HTTPException:
        raise
    except Exception:
        logger.exception("Queued portfolio inquiry could not be processed: id=%s", inquiry_id)
        raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None

    return {"status": "success"}


@app.get("/api/cron/retry-contact-delivery")
async def retry_contact_delivery(request: Request) -> dict[str, int]:
    cron_secret = os.environ.get("CRON_SECRET")
    authorization = request.headers.get("authorization", "")
    expected = f"Bearer {cron_secret}" if cron_secret else ""
    if not expected or not hmac.compare_digest(authorization, expected):
        raise HTTPException(status_code=401, detail="Unauthorized.")

    try:
        processed = await run_in_threadpool(retry_due_inquiries, send_mail)
    except Exception:
        logger.exception("Portfolio inquiry retry run failed")
        raise HTTPException(status_code=503, detail="Inquiry service is temporarily unavailable.") from None
    return {"processed": processed}
