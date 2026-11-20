import asyncio
from urllib.parse import urlencode

import pytest
from fastapi import HTTPException, Request
from fastapi.testclient import TestClient

from api import index


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> TestClient:
    monkeypatch.setattr(index, "reserve_contact_request", lambda _ip: True)
    return TestClient(index.app, client=("203.0.113.10", 50000))


@pytest.fixture
def valid_payload() -> dict[str, object]:
    return {
        "name": "Taylor Example",
        "email": "taylor@example.com",
        "company": "Example Inc",
        "role": "Founder / Co-founder",
        "services": ["Agentic AI"],
        "stage": ["Proof of Concept"],
        "techStack": "Python",
        "budget": "$5,000–$15,000",
        "timeline": "1–3 months",
        "discoverySource": "GitHub",
        "preferredContactMethod": "Email",
        "message": "Build a useful assistant.",
        "honeypot": "",
    }


def allow_queue(monkeypatch: pytest.MonkeyPatch):
    sent: list[tuple[str, str, str]] = []
    payloads: list[dict[str, object]] = []
    processed: list[str] = []
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: True)

    def enqueue(payload, _submission_id=None):
        payloads.append(payload)
        return "inquiry-1"

    def process(inquiry_id, sender):
        processed.append(inquiry_id)
        sender("owner@example.com", "owner subject", payloads[0]["formattedText"])
        sender(payloads[0]["email"], "ack subject", payloads[0]["userBody"])
        return True

    monkeypatch.setattr(index, "enqueue_submission", enqueue)
    monkeypatch.setattr(index, "process_inquiry", process)
    monkeypatch.setattr(index, "send_mail", lambda to, subject, body: sent.append((to, subject, body)))
    return sent, payloads, processed


def test_json_submission_sends_owner_and_acknowledgement(client, valid_payload, monkeypatch):
    sent, payloads, processed = allow_queue(monkeypatch)

    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 200
    assert response.json() == {"status": "success"}
    assert [message[0] for message in sent] == ["owner@example.com", "taylor@example.com"]
    assert "Agentic AI" in payloads[0]["formattedText"]
    assert "Proof of Concept" in payloads[0]["formattedText"]
    assert processed == ["inquiry-1"]


def test_submission_id_reaches_the_durable_queue(client, valid_payload, monkeypatch):
    submission_ids = []
    monkeypatch.setattr(index, "find_existing_submission", lambda *_args: None)
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: True)

    def enqueue(_payload, submission_id):
        submission_ids.append(submission_id)
        return submission_id

    monkeypatch.setattr(index, "enqueue_submission", enqueue)
    monkeypatch.setattr(index, "process_inquiry", lambda *_args: True)

    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "submissionId": "b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 200
    assert submission_ids == ["b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"]


def test_submission_id_conflict_does_not_claim_the_form_was_accepted(client, valid_payload, monkeypatch):
    monkeypatch.setattr(index, "find_existing_submission", lambda *_args: None)
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: True)

    def reject_duplicate_payload(_payload, _submission_id):
        raise index.IdempotencyConflict("conflict")

    monkeypatch.setattr(index, "enqueue_submission", reject_duplicate_payload)
    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "submissionId": "b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Submission id was already used for another inquiry."


def test_duplicate_submission_is_resolved_before_rate_limiting(client, valid_payload, monkeypatch):
    monkeypatch.setattr(index, "find_existing_submission", lambda *_args: ("existing-inquiry", "pending_owner"))
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: False)
    monkeypatch.setattr(index, "process_inquiry", lambda *_args: False)
    monkeypatch.setattr(index, "get_submission_status", lambda _submission_id: "pending_owner")

    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "submissionId": "b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 200


def test_global_request_limit_blocks_uuid_lookups(client, valid_payload, monkeypatch):
    monkeypatch.setattr(index, "reserve_contact_request", lambda _ip: False)

    def forbidden_lookup(*_args):
        raise AssertionError("rate-limited requests must not query idempotency records")

    monkeypatch.setattr(index, "find_existing_submission", forbidden_lookup)
    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "submissionId": "b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 429


def test_quota_race_rechecks_idempotency_before_returning_429(client, valid_payload, monkeypatch):
    lookups = []

    def find_submission(*_args):
        lookups.append(True)
        return None if len(lookups) == 1 else ("existing-inquiry", "pending_owner")

    monkeypatch.setattr(index, "find_existing_submission", find_submission)
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: False)
    monkeypatch.setattr(index, "process_inquiry", lambda *_args: False)
    monkeypatch.setattr(index, "get_submission_status", lambda _submission_id: "pending_owner")
    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "submissionId": "b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 200
    assert len(lookups) == 2


def test_terminal_failed_submission_is_not_reported_as_success(client, valid_payload, monkeypatch):
    monkeypatch.setattr(index, "find_existing_submission", lambda *_args: ("failed-inquiry", "failed"))
    monkeypatch.setattr(index, "process_inquiry", lambda *_args: pytest.fail("terminal inquiry must not be processed"))
    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "submissionId": "b2ab04a2-742e-4ef6-bf94-8d7cff2f7e35"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 503


def test_last_delivery_failure_is_not_reported_as_success(client, valid_payload, monkeypatch):
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: True)
    monkeypatch.setattr(index, "enqueue_submission", lambda _payload, _submission_id=None: "failed-inquiry")
    monkeypatch.setattr(index, "process_inquiry", lambda *_args: False)
    monkeypatch.setattr(index, "get_submission_status", lambda _submission_id: "failed")

    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Inquiry delivery could not be completed."


def test_urlencoded_fallback_accepts_native_form_field_names(client, monkeypatch):
    sent, payloads, _processed = allow_queue(monkeypatch)
    form = {
        "name": "Taylor Example",
        "email": "taylor@example.com",
        "role": "Founder / Co-founder",
        "budget": "$5,000–$15,000",
        "timeline": "1–3 months",
        "discoverySource": "GitHub",
        "contactMethod": "Schedule a Call",
        "message": "A native form submission.",
        "honeypot": "",
    }

    response = client.post(
        "/api/webDATA",
        content=urlencode(form),
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": f"{index.ALLOWED_ORIGIN}/krishujeniya/",
        },
    )

    assert response.status_code == 200
    assert len(sent) == 2
    assert "Preferred Contact : Schedule a Call" in payloads[0]["formattedText"]


def test_origin_must_match_exactly(client, valid_payload):
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": f"{index.ALLOWED_ORIGIN}.attacker.example"},
    )

    assert response.status_code == 403


def test_cloudflare_origin_is_accepted(client, valid_payload, monkeypatch):
    allow_queue(monkeypatch)
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": index.CLOUDFLARE_ORIGIN},
    )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}


def test_cloudflare_referer_is_accepted(client, valid_payload, monkeypatch):
    allow_queue(monkeypatch)
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Referer": f"{index.CLOUDFLARE_ORIGIN}/"},
    )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}


def test_cloudflare_attacker_origin_rejected(client, valid_payload):
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": f"{index.CLOUDFLARE_ORIGIN}.attacker.example"},
    )
    assert response.status_code == 403


def test_cloudflare_http_insecure_rejected(client, valid_payload):
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": "http://krishujeniya.pages.dev"},
    )
    assert response.status_code == 403


def test_cf_connecting_ip_is_used_for_rate_limiting(client, valid_payload, monkeypatch):
    captured_ip = []
    monkeypatch.setattr(index, "reserve_contact_request", lambda ip: captured_ip.append(ip) or True)
    monkeypatch.setattr(index, "reserve_submission", lambda ip: True)
    monkeypatch.setattr(index, "enqueue_submission", lambda *args: "inquiry-cf")
    monkeypatch.setattr(index, "process_inquiry", lambda *args: True)

    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={
            "Origin": index.CLOUDFLARE_ORIGIN,
            "CF-Connecting-IP": "198.51.100.25",
        },
    )
    assert response.status_code == 200
    assert "198.51.100.25" in captured_ip


@pytest.mark.parametrize(
    "changes",
    [
        {"email": "not-an-email"},
        {"name": ""},
        {"message": ""},
        {"role": "CEO"},
        {"services": ["Unlisted service"]},
    ],
)
def test_invalid_contact_values_are_rejected(client, valid_payload, changes):
    response = client.post(
        "/api/webDATA",
        json={**valid_payload, **changes},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "Invalid contact form."


def test_honeypot_submission_does_not_send_email(client, valid_payload, monkeypatch):
    sent, payloads, processed = allow_queue(monkeypatch)

    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "honeypot": "filled"},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 200
    assert response.json()["info"] == "bot_detected"
    assert sent == []
    assert payloads == []
    assert processed == []


def test_rate_limit_rejects_excess_inquiry_before_queue_write(client, valid_payload, monkeypatch):
    sent, payloads, processed = allow_queue(monkeypatch)
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: False)

    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 429
    assert sent == []
    assert payloads == []
    assert processed == []


def test_database_failure_does_not_claim_inquiry_was_accepted(client, valid_payload, monkeypatch):
    monkeypatch.setattr(index, "reserve_submission", lambda _ip: True)

    def fail_queue(_payload, _submission_id=None):
        raise RuntimeError("database unavailable")

    monkeypatch.setattr(index, "enqueue_submission", fail_queue)
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 503


def test_smtp_calls_run_outside_the_async_event_loop(client, valid_payload, monkeypatch):
    event_loop_checks: list[bool] = []

    def record_delivery(*_args):
        try:
            asyncio.get_running_loop()
            event_loop_checks.append(True)
        except RuntimeError:
            event_loop_checks.append(False)

    monkeypatch.setattr(index, "reserve_submission", lambda _ip: True)
    monkeypatch.setattr(index, "enqueue_submission", lambda _payload, _submission_id=None: "inquiry-1")

    def process(_inquiry_id, sender):
        sender("owner@example.com", "owner subject", "body")
        sender("visitor@example.com", "ack subject", "body")
        return True

    monkeypatch.setattr(index, "process_inquiry", process)
    monkeypatch.setattr(index, "send_mail", record_delivery)
    response = client.post(
        "/api/webDATA",
        json=valid_payload,
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 200
    assert event_loop_checks == [False, False]


def test_cron_retry_route_requires_bearer_secret(client, monkeypatch):
    monkeypatch.setenv("CRON_SECRET", "cron-test-value")
    response = client.get("/api/cron/retry-contact-delivery")

    assert response.status_code == 401


def test_cron_retry_route_processes_due_items(client, monkeypatch):
    monkeypatch.setenv("CRON_SECRET", "cron-test-value")
    monkeypatch.setattr(index, "retry_due_inquiries", lambda _sender: 2)

    response = client.get(
        "/api/cron/retry-contact-delivery",
        headers={"Authorization": "Bearer cron-test-value"},
    )

    assert response.status_code == 200
    assert response.json() == {"processed": 2}


def test_readiness_route_confirms_mongodb_ping(client, monkeypatch):
    class FakeDatabase:
        def command(self, command):
            return {"ok": 1} if command == "ping" else {}

    monkeypatch.setattr(index, "get_database", lambda: FakeDatabase())

    response = client.get("/api/health/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_readiness_route_hides_database_connection_details(client, monkeypatch):
    def unavailable_database():
        raise RuntimeError("database unavailable")

    monkeypatch.setattr(index, "get_database", unavailable_database)

    response = client.get("/api/health/ready")

    assert response.status_code == 503
    assert response.json()["detail"] == "Inquiry service is temporarily unavailable."


def test_unsupported_body_format_is_rejected(client):
    response = client.post(
        "/api/webDATA",
        content="name=value",
        headers={
            "Origin": index.ALLOWED_ORIGIN,
            "Content-Type": "text/plain",
        },
    )

    assert response.status_code == 415


def test_oversized_body_is_rejected(client):
    response = client.post(
        "/api/webDATA",
        content=b"x" * (index.MAX_REQUEST_BYTES + 1),
        headers={
            "Origin": index.ALLOWED_ORIGIN,
            "Content-Type": "application/json",
        },
    )

    assert response.status_code == 413


def test_streamed_body_limit_applies_without_content_length():
    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": "POST",
        "scheme": "https",
        "path": "/api/webDATA",
        "raw_path": b"/api/webDATA",
        "query_string": b"",
        "headers": [(b"content-type", b"application/json")],
        "server": ("test", 443),
        "client": ("test", 12345),
        "root_path": "",
    }
    message = {"type": "http.request", "body": b"x" * (index.MAX_REQUEST_BYTES + 1), "more_body": False}

    async def receive():
        return message

    with pytest.raises(HTTPException) as error:
        asyncio.run(index.parse_contact_form(Request(scope, receive)))

    assert error.value.status_code == 413


def test_service_and_stage_lists_match_single_selection_form(client, valid_payload):
    response = client.post(
        "/api/webDATA",
        json={**valid_payload, "services": ["Agentic AI", "Enterprise RAG"]},
        headers={"Origin": index.ALLOWED_ORIGIN},
    )

    assert response.status_code == 422


def test_send_mail_uses_bounded_smtp_connection(monkeypatch):
    calls: list[tuple[str, object]] = []

    class FakeSMTP:
        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def starttls(self):
            calls.append(("starttls", None))

        def login(self, sender, password):
            calls.append(("login", (sender, password)))

        def send_message(self, message):
            calls.append(("send", message["To"]))

    def fake_smtp(host, port, timeout):
        calls.append(("connect", (host, port, timeout)))
        return FakeSMTP()

    monkeypatch.setenv("EMAIL_USER", "sender@example.com")
    monkeypatch.setenv("EMAIL_PASS", "test-password")
    monkeypatch.setattr(index.smtplib, "SMTP", fake_smtp)

    index.send_mail("receiver@example.com", "Subject", "Body")

    assert calls == [
        ("connect", ("smtp.gmail.com", 587, index.SMTP_TIMEOUT_SECONDS)),
        ("starttls", None),
        ("login", ("sender@example.com", "test-password")),
        ("send", "receiver@example.com"),
    ]


def test_send_mail_requires_both_credentials(monkeypatch):
    monkeypatch.delenv("EMAIL_USER", raising=False)
    monkeypatch.delenv("EMAIL_PASS", raising=False)

    with pytest.raises(RuntimeError, match="Email credentials are not configured"):
        index.send_mail("receiver@example.com", "Subject", "Body")
