from copy import deepcopy
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace

import pytest
from pymongo.errors import DuplicateKeyError

import mongo_store


class MemoryCursor:
    def __init__(self, values):
        self.values = values

    def sort(self, field, _direction):
        self.values.sort(key=lambda value: value[field])
        return self

    def limit(self, amount):
        self.values = self.values[:amount]
        return self

    def __iter__(self):
        return iter(self.values)


class MemoryCollection:
    def __init__(self):
        self.documents = {}

    def create_index(self, *_args, **_kwargs):
        return "memory-index"

    def insert_one(self, document):
        if document["_id"] in self.documents:
            raise DuplicateKeyError("duplicate _id")
        self.documents[document["_id"]] = deepcopy(document)

    def find_one(self, query, _projection=None):
        document = self.documents.get(query.get("_id"))
        return deepcopy(document) if document is not None else None

    def find_one_and_update(self, query, update, upsert=False, return_document=None):
        document = self.documents.get(query.get("_id"))
        if document is not None and self._matches(document, query):
            self._apply(document, update)
            return deepcopy(document)
        if not upsert:
            return None
        if document is not None:
            raise DuplicateKeyError("duplicate _id")
        document = {"_id": query["_id"]}
        self._apply(document, update, inserting=True)
        self.documents[document["_id"]] = document
        return deepcopy(document)

    def update_one(self, query, update, upsert=False):
        document = self.documents.get(query.get("_id"))
        if document is None and upsert:
            document = {"_id": query["_id"]}
            self._apply(document, update, inserting=True)
            self.documents[document["_id"]] = document
            return SimpleNamespace(modified_count=1)
        if document is None or not self._matches(document, query):
            return SimpleNamespace(modified_count=0)
        if isinstance(update, list):
            spec = update[0]["$set"]
            filter_expr = spec["requests"]["$concatArrays"][0]["$filter"]
            cutoff = filter_expr["cond"]["$gte"][1]
            recent = [value for value in document["requests"] if value >= cutoff]
            document["requests"] = recent + spec["requests"]["$concatArrays"][1]
            document["expiresAt"] = spec["expiresAt"]
        else:
            self._apply(document, update)
        return SimpleNamespace(modified_count=1)

    def delete_one(self, query):
        self.documents.pop(query.get("_id"), None)

    def find(self, query, _projection):
        values = [deepcopy(item) for item in self.documents.values() if self._matches(item, query)]
        return MemoryCursor(values)

    @classmethod
    def _matches(cls, document, query):
        for key, expected in query.items():
            if key == "$or":
                if not any(cls._matches(document, option) for option in expected):
                    return False
                continue
            if key == "$expr":
                size_expr, limit = expected["$lt"]
                filter_expr = size_expr["$size"]["$filter"]
                cutoff = filter_expr["cond"]["$gte"][1]
                recent = [value for value in document.get("requests", []) if value >= cutoff]
                if not len(recent) < limit:
                    return False
                continue
            actual = document.get(key)
            if isinstance(expected, dict):
                if "$lt" in expected and not (actual is not None and actual < expected["$lt"]):
                    return False
                if "$lte" in expected and not (actual is not None and actual <= expected["$lte"]):
                    return False
                if "$in" in expected and actual not in expected["$in"]:
                    return False
            elif actual != expected:
                return False
        return True

    @staticmethod
    def _apply(document, update, inserting=False):
        for key, value in update.get("$setOnInsert", {}).items():
            if inserting:
                document[key] = value
        for key, value in update.get("$set", {}).items():
            document[key] = value
        for key, value in update.get("$inc", {}).items():
            document[key] = document.get(key, 0) + value
        for key in update.get("$unset", {}):
            document.pop(key, None)


class MemoryDatabase:
    def __init__(self):
        self.collections = {"rate_limits": MemoryCollection(), "contact_inquiries": MemoryCollection()}

    def __getitem__(self, name):
        return self.collections[name]


@pytest.fixture
def database(monkeypatch):
    value = MemoryDatabase()
    monkeypatch.setenv("MONGODB_URI", "mongodb-uri-test-only")
    monkeypatch.setenv("IDEMPOTENCY_HASH_SECRET", "test-only-idempotency-secret")
    monkeypatch.setattr(mongo_store, "get_database", lambda: value)
    return value


def test_rate_limit_caps_five_requests_per_hour_and_stores_only_hmac(database):
    now = datetime(2026, 11, 15, 12, 0, tzinfo=UTC)

    outcomes = [mongo_store.reserve_submission("203.0.113.7", now) for _ in range(6)]

    assert outcomes == [True, True, True, True, True, False]
    stored_id = next(iter(database["rate_limits"].documents))
    assert "203.0.113.7" not in stored_id
    assert len(database["rate_limits"].documents[stored_id]["requests"]) == 5


def test_rate_limit_does_not_reset_at_hour_boundary(database):
    before_boundary = datetime(2026, 11, 15, 12, 59, 59, tzinfo=UTC)
    after_boundary = before_boundary + timedelta(seconds=1)
    first_window = [mongo_store.reserve_submission("203.0.113.8", before_boundary) for _ in range(5)]
    second_window = [mongo_store.reserve_submission("203.0.113.8", after_boundary) for _ in range(5)]

    assert first_window == [True] * 5
    assert second_window == [False] * 5


def test_contact_request_limit_bounds_idempotency_lookups(database):
    now = datetime(2026, 11, 15, 12, 0, tzinfo=UTC)

    outcomes = [mongo_store.reserve_contact_request("203.0.113.9", now) for _ in range(61)]

    assert outcomes == [True] * mongo_store.CONTACT_REQUEST_MAX_REQUESTS + [False]
    assert mongo_store.reserve_submission("203.0.113.9", now) is True
    assert len(database["rate_limits"].documents) == 2


def test_repeated_submission_id_reuses_the_existing_queue_record(database):
    payload = {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"}

    first_id = mongo_store.enqueue_submission(payload, "client-submission-1")
    retry_id = mongo_store.enqueue_submission(payload, "client-submission-1")

    assert retry_id == first_id
    assert len(database["contact_inquiries"].documents) == 1


def test_idempotency_digest_survives_mongodb_uri_rotation(database, monkeypatch):
    payload = {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"}
    first_id = mongo_store.enqueue_submission(payload, "client-submission-rotation")
    monkeypatch.setenv("MONGODB_URI", "rotated-mongodb-uri-test-only")

    retry_id = mongo_store.enqueue_submission(payload, "client-submission-rotation")

    assert retry_id == first_id
    assert len(database["contact_inquiries"].documents) == 1


def test_repeated_submission_id_rejects_different_payload(database):
    mongo_store.enqueue_submission(
        {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"},
        "client-submission-2",
    )

    with pytest.raises(mongo_store.IdempotencyConflict):
        mongo_store.enqueue_submission(
            {"email": "other@example.com", "formattedText": "different", "userBody": "ack"},
            "client-submission-2",
        )


def test_queued_submission_drops_contact_payload_after_success_and_keeps_dedupe_key(database):
    sent = []
    inquiry_id = mongo_store.enqueue_submission(
        {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"},
        "client-submission-3",
    )

    delivered = mongo_store.process_inquiry(
        inquiry_id,
        lambda to, subject, body: sent.append((to, subject, body)),
    )

    assert delivered is True
    assert [entry[0] for entry in sent] == [mongo_store.ADMIN_EMAIL, "taylor@example.com"]
    retained = database["contact_inquiries"].documents[inquiry_id]
    assert retained["status"] == "delivered"
    assert "payload" not in retained
    assert retained["payloadHash"]

    assert mongo_store.enqueue_submission(
        {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"},
        "client-submission-3",
    ) == inquiry_id
    assert len(database["contact_inquiries"].documents) == 1


def test_owner_delivery_failure_stays_queued_for_retry(database):
    inquiry_id = mongo_store.enqueue_submission(
        {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"}
    )

    def fail_owner(*_args):
        raise OSError("smtp unavailable")

    delivered = mongo_store.process_inquiry(inquiry_id, fail_owner)
    retained = database["contact_inquiries"].documents[inquiry_id]

    assert delivered is False
    assert retained["status"] == "pending_owner"
    assert retained["ownerAttempts"] == 1
    assert retained["expiresAt"] > datetime.now(UTC)


def test_acknowledgement_retry_does_not_resend_owner_email(database):
    sent = []
    inquiry_id = mongo_store.enqueue_submission(
        {"email": "taylor@example.com", "formattedText": "details", "userBody": "ack"}
    )

    def fail_acknowledgement(to, subject, body):
        sent.append(to)
        if to == "taylor@example.com":
            raise OSError("mailbox unavailable")

    assert mongo_store.process_inquiry(inquiry_id, fail_acknowledgement) is False
    retained = database["contact_inquiries"].documents[inquiry_id]
    assert retained["status"] == "pending_acknowledgement"
    assert retained["ownerSent"] is True
    assert retained["acknowledgementAttempts"] == 1

    retained["nextAttemptAt"] = datetime.now(UTC) - timedelta(seconds=1)
    assert mongo_store.process_inquiry(
        inquiry_id,
        lambda to, subject, body: sent.append(to),
    ) is True

    assert sent.count(mongo_store.ADMIN_EMAIL) == 1
    assert sent.count("taylor@example.com") == 2
    retained = database["contact_inquiries"].documents[inquiry_id]
    assert retained["status"] == "delivered"
    assert "payload" not in retained


def test_retry_worker_caps_work_to_small_batch(database, monkeypatch):
    now = datetime.now(UTC)
    for inquiry_id in ("one", "two", "three"):
        database["contact_inquiries"].insert_one(
            {
                "_id": inquiry_id,
                "status": "pending_owner",
                "nextAttemptAt": now - timedelta(seconds=1),
            }
        )
    processed = []

    def process(inquiry_id, _send_mail):
        processed.append(inquiry_id)
        return True

    monkeypatch.setattr(mongo_store, "process_inquiry", process)

    count = mongo_store.retry_due_inquiries(lambda *_args: None)

    assert count == mongo_store.MAX_RETRY_BATCH
    assert len(processed) == mongo_store.MAX_RETRY_BATCH


def test_retry_worker_reclaims_expired_processing_lease(database, monkeypatch):
    now = datetime.now(UTC)
    database["contact_inquiries"].insert_one(
        {
            "_id": "expired-lease",
            "status": "processing",
            "nextAttemptAt": now - timedelta(minutes=2),
            "leaseUntil": now - timedelta(seconds=1),
        }
    )
    processed = []
    monkeypatch.setattr(
        mongo_store,
        "process_inquiry",
        lambda inquiry_id, _sender: processed.append(inquiry_id) or True,
    )

    count = mongo_store.retry_due_inquiries(lambda *_args: None)

    assert count == 1
    assert processed == ["expired-lease"]
