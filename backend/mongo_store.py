import hashlib
import hmac
import json
import logging
import os
from datetime import UTC, datetime, timedelta
from functools import lru_cache
from typing import Callable
from uuid import uuid4

from pymongo import ASCENDING, MongoClient, ReturnDocument
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError

logger = logging.getLogger(__name__)
RATE_LIMIT_WINDOW = timedelta(hours=1)
RATE_LIMIT_MAX_REQUESTS = 5
CONTACT_REQUEST_MAX_REQUESTS = 60
QUEUE_RETENTION = timedelta(days=30)
MAX_RETRY_BATCH = 2
MAX_DELIVERY_ATTEMPTS = 7
ADMIN_EMAIL = "240233111029@gtu.edu.in"


class MongoNotConfigured(RuntimeError):
    pass


class IdempotencyConflict(ValueError):
    pass


def _submission_payload_hash(payload: dict[str, object]) -> str:
    secret = os.environ.get("IDEMPOTENCY_HASH_SECRET")
    if not secret:
        raise MongoNotConfigured("IDEMPOTENCY_HASH_SECRET is not configured")
    return hmac.new(
        secret.encode(),
        json.dumps(payload, sort_keys=True, separators=(",", ":")).encode(),
        hashlib.sha256,
    ).hexdigest()


@lru_cache(maxsize=1)
def get_database():
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise MongoNotConfigured("MONGODB_URI is not configured")

    client = MongoClient(
        uri,
        connectTimeoutMS=3000,
        serverSelectionTimeoutMS=3000,
        socketTimeoutMS=5000,
        waitQueueTimeoutMS=3000,
        maxPoolSize=5,
        minPoolSize=0,
        tls=True,
    )
    database = client["portfolio"]
    database["rate_limits"].create_index("expiresAt", expireAfterSeconds=0, name="rate_limit_expiry")
    database["contact_inquiries"].create_index("expiresAt", expireAfterSeconds=0, name="inquiry_expiry")
    database["contact_inquiries"].create_index(
        [("status", ASCENDING), ("nextAttemptAt", ASCENDING)], name="inquiry_retry_schedule"
    )
    return database


def _reserve_rate_limit(
    client_ip: str,
    max_requests: int,
    now: datetime | None = None,
    bucket: str = "",
) -> bool:
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        raise MongoNotConfigured("MONGODB_URI is not configured")

    current_time = now or datetime.now(UTC)
    subject = f"{bucket}:{client_ip}" if bucket else client_ip
    address_hash = hmac.new(uri.encode(), subject.encode(), hashlib.sha256).hexdigest()
    collection: Collection = get_database()["rate_limits"]
    expiry = current_time + RATE_LIMIT_WINDOW + timedelta(minutes=5)
    try:
        collection.update_one(
            {"_id": address_hash},
            {"$setOnInsert": {"requests": [], "expiresAt": expiry}},
            upsert=True,
        )
    except DuplicateKeyError:
        pass

    window_start = current_time - RATE_LIMIT_WINDOW
    recent_requests = {
        "$filter": {
            "input": "$requests",
            "as": "request_time",
            "cond": {"$gte": ["$$request_time", window_start]},
        }
    }
    result = collection.update_one(
        {
            "_id": address_hash,
            "$expr": {"$lt": [{"$size": recent_requests}, max_requests]},
        },
        [
            {
                "$set": {
                    "requests": {"$concatArrays": [recent_requests, [current_time]]},
                    "expiresAt": expiry,
                }
            }
        ],
    )
    return result.modified_count == 1


def reserve_submission(client_ip: str, now: datetime | None = None) -> bool:
    return _reserve_rate_limit(client_ip, RATE_LIMIT_MAX_REQUESTS, now)


def reserve_contact_request(client_ip: str, now: datetime | None = None) -> bool:
    return _reserve_rate_limit(
        client_ip,
        CONTACT_REQUEST_MAX_REQUESTS,
        now,
        "contact-request",
    )


def enqueue_submission(payload: dict[str, object], submission_id: str | None = None) -> str:
    current_time = datetime.now(UTC)
    inquiry_id = submission_id or uuid4().hex
    database = get_database()
    payload_hash = _submission_payload_hash(payload)
    collection: Collection = database["contact_inquiries"]
    try:
        collection.insert_one(
            {
                "_id": inquiry_id,
                "payload": payload,
                "payloadHash": payload_hash,
                "status": "pending_owner",
                "ownerSent": False,
                "acknowledgementSent": False,
                "ownerAttempts": 0,
                "acknowledgementAttempts": 0,
                "nextAttemptAt": current_time,
                "createdAt": current_time,
                "expiresAt": current_time + QUEUE_RETENTION,
            }
        )
    except DuplicateKeyError:
        existing = collection.find_one({"_id": inquiry_id})
        existing_hash = existing.get("payloadHash", "") if existing else ""
        if existing_hash and hmac.compare_digest(existing_hash, payload_hash):
            return inquiry_id
        raise IdempotencyConflict("Submission id was already used for another payload.") from None
    return inquiry_id


def find_existing_submission(submission_id: str, payload: dict[str, object]) -> tuple[str, str] | None:
    existing = get_database()["contact_inquiries"].find_one({"_id": submission_id})
    if existing is None:
        return None
    if hmac.compare_digest(existing.get("payloadHash", ""), _submission_payload_hash(payload)):
        return submission_id, str(existing.get("status", ""))
    raise IdempotencyConflict("Submission id was already used for another payload.")


def get_submission_status(submission_id: str) -> str | None:
    inquiry = get_database()["contact_inquiries"].find_one({"_id": submission_id}, {"status": 1})
    return str(inquiry["status"]) if inquiry and "status" in inquiry else None


def _schedule_retry(collection: Collection, inquiry: dict[str, object], phase: str) -> None:
    attempts_field = f"{phase}Attempts"
    attempt = int(inquiry.get(attempts_field, 0)) + 1
    current_time = datetime.now(UTC)
    if attempt >= MAX_DELIVERY_ATTEMPTS:
        next_status = "failed"
        next_attempt = current_time + QUEUE_RETENTION
    else:
        next_status = f"pending_{phase}"
        delay_seconds = min(3600 * (2 ** (attempt - 1)), 86400)
        next_attempt = current_time + timedelta(seconds=delay_seconds)

    collection.update_one(
        {"_id": inquiry["_id"]},
        {
            "$set": {"status": next_status, "nextAttemptAt": next_attempt},
            "$inc": {attempts_field: 1},
            "$unset": {"leaseUntil": ""},
        },
    )


def process_inquiry(inquiry_id: str, send_mail: Callable[[str, str, str], None]) -> bool:
    collection: Collection = get_database()["contact_inquiries"]
    current_time = datetime.now(UTC)
    inquiry = collection.find_one_and_update(
        {
            "_id": inquiry_id,
            "nextAttemptAt": {"$lte": current_time},
            "$or": [
                {"status": {"$in": ["pending_owner", "pending_acknowledgement"]}},
                {"status": "processing", "leaseUntil": {"$lte": current_time}},
            ],
        },
        {
            "$set": {"status": "processing", "leaseUntil": current_time + timedelta(seconds=120)},
        },
        return_document=ReturnDocument.AFTER,
    )
    if inquiry is None:
        return False

    payload = inquiry["payload"]
    try:
        if not inquiry.get("ownerSent"):
            send_mail(ADMIN_EMAIL, "Portfolio Form Submission", payload["formattedText"])
            collection.update_one({"_id": inquiry_id}, {"$set": {"ownerSent": True}})
            inquiry = {**inquiry, "ownerSent": True}
        if not inquiry.get("acknowledgementSent"):
            send_mail(payload["email"], "Thank you for hiring Krish Ujeniya!", payload["userBody"])
            collection.update_one(
                {"_id": inquiry_id}, {"$set": {"acknowledgementSent": True}}
            )
            inquiry = {**inquiry, "acknowledgementSent": True}
    except Exception:
        phase = "owner" if not inquiry.get("ownerSent") else "acknowledgement"
        logger.exception("Portfolio inquiry delivery failed: id=%s phase=%s", inquiry_id, phase)
        _schedule_retry(collection, inquiry, phase)
        return False

    collection.update_one(
        {"_id": inquiry_id},
        {
            "$set": {"status": "delivered", "expiresAt": current_time + QUEUE_RETENTION},
            "$unset": {"payload": ""},
        },
    )
    return True


def retry_due_inquiries(send_mail: Callable[[str, str, str], None]) -> int:
    collection: Collection = get_database()["contact_inquiries"]
    current_time = datetime.now(UTC)
    due = collection.find(
        {
            "$or": [
                {
                    "status": {"$in": ["pending_owner", "pending_acknowledgement"]},
                    "nextAttemptAt": {"$lte": current_time},
                },
                {"status": "processing", "leaseUntil": {"$lte": current_time}},
            ]
        },
        {"_id": 1},
    ).sort("nextAttemptAt", ASCENDING).limit(MAX_RETRY_BATCH)
    return sum(process_inquiry(item["_id"], send_mail) for item in due)
