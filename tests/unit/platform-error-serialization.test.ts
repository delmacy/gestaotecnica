import { test } from "node:test";
import assert from "node:assert/strict";
import {
  serializePlatformError,
  deserializePlatformError,
  tryDeserializePlatformError,
} from "../../src/platform/errors/serialization";
import { PlatformErrorEnvelope } from "../../src/platform/errors/schema";
import { sanitizeUnknownError } from "../../src/platform/errors/sanitizer";

const minimalEnvelope: PlatformErrorEnvelope = {
  id: "err-123",
  code: "VALIDATION.USER.INVALID_NAME",
  category: "validation",
  severity: "error",
  message: "Invalid name provided",
  timestamp: "2023-10-27T10:00:00.000Z",
};

const validUuid = "00000000-0000-0000-0000-000000000000";

const fullEnvelope: PlatformErrorEnvelope = {
  id: "err-456",
  code: "INFRASTRUCTURE.DB.CONNECTION_FAILED",
  category: "infrastructure",
  severity: "critical",
  message: "Could not connect to database",
  timestamp: "2023-10-27T10:05:00.000Z",
  userMessage: "We are experiencing technical difficulties.",
  workspaceId: validUuid,
  correlationId: "corr-111",
  causationId: "caus-222",
  source: {
    pointer: "/data/attributes/name",
  },
  details: {
    attempt: 3,
    reason: "timeout",
  },
  validationIssues: [
    {
      code: "REQUIRED",
      message: "Name is required",
      path: ["name"],
    },
  ],
  retry: {
    retryable: true,
    afterSeconds: 30,
  },
  metadata: {
    region: "us-east-1",
  },
};

test("serializePlatformError - minimal envelope", () => {
  const serialized = serializePlatformError(minimalEnvelope);
  const parsed = JSON.parse(serialized);
  assert.deepEqual(parsed, minimalEnvelope);
});

test("serializePlatformError - deterministic sorting", () => {
  const envelopeWithUnsortedKeys = {
    message: "Invalid name provided",
    severity: "error" as const,
    category: "validation" as const,
    code: "VALIDATION.USER.INVALID_NAME" as const,
    id: "err-123",
    timestamp: "2023-10-27T10:00:00.000Z",
  };

  const serialized1 = serializePlatformError(minimalEnvelope);
  const serialized2 = serializePlatformError(envelopeWithUnsortedKeys);

  assert.equal(serialized1, serialized2);

  // Check alphabet order in serialized string
  const keys = Object.keys(JSON.parse(serialized1));
  const sortedKeys = [...keys].sort();
  assert.deepEqual(keys, sortedKeys);
});

test("serializePlatformError - arrays preserve order", () => {
  const env1: PlatformErrorEnvelope = {
    ...minimalEnvelope,
    validationIssues: [
      { code: "A", message: "A", path: ["a"] },
      { code: "B", message: "B", path: ["b"] },
    ],
  };
  const env2: PlatformErrorEnvelope = {
    ...minimalEnvelope,
    validationIssues: [
      { code: "B", message: "B", path: ["b"] },
      { code: "A", message: "A", path: ["a"] },
    ],
  };

  const s1 = serializePlatformError(env1);
  const s2 = serializePlatformError(env2);

  assert.notEqual(s1, s2);
});

test("serializePlatformError - input not mutated", () => {
  const input = { ...minimalEnvelope };
  Object.freeze(input);
  assert.doesNotThrow(() => serializePlatformError(input));
});

test("serializePlatformError - rejects symbols and functions", () => {
  const envWithExtras = {
    ...minimalEnvelope,
    details: {
      foo: "bar",
      mySym: Symbol("test"),
      myFunc: () => {},
    },
  };
  const serialized = serializePlatformError(envWithExtras);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.details.mySym, undefined);
  assert.equal(parsed.details.myFunc, undefined);
  assert.equal(parsed.details.foo, "bar");
});

test("deserializePlatformError - valid round trip", () => {
  const serialized = serializePlatformError(fullEnvelope);
  const deserialized = deserializePlatformError(serialized);
  assert.deepEqual(deserialized, fullEnvelope);
  assert.ok(Object.isFrozen(deserialized));
});

test("deserializePlatformError - reject invalid JSON", () => {
  assert.throws(() => deserializePlatformError("not json"), /INVALID_JSON/);
});

test("deserializePlatformError - reject non-object root", () => {
  assert.throws(() => deserializePlatformError("null"), /INVALID_ENVELOPE/);
  assert.throws(() => deserializePlatformError("[]"), /INVALID_ENVELOPE/);
  assert.throws(() => deserializePlatformError('"string"'), /INVALID_ENVELOPE/);
});

test("deserializePlatformError - reject missing required fields", () => {
  const incomplete = JSON.stringify({ id: "1" });
  assert.throws(() => deserializePlatformError(incomplete), /INVALID_ENVELOPE/);
});

test("deserializePlatformError - reject unknown fields (strict)", () => {
  const withUnknown = JSON.stringify({ ...minimalEnvelope, extra: "field" });
  assert.throws(() => deserializePlatformError(withUnknown), /INVALID_ENVELOPE/);
});

test("Explicit Unsafe Key Rejection - Deserialization", () => {
  const cases = [
    { name: "__proto__ at root", json: `{"id":"1", "code":"A.B.C", "category":"validation", "severity":"error", "message":"m", "timestamp":"2023-10-27T10:00:00Z", "__proto__":{}}` },
    { name: "prototype at root", json: `{"id":"1", "code":"A.B.C", "category":"validation", "severity":"error", "message":"m", "timestamp":"2023-10-27T10:00:00Z", "prototype":{}}` },
    { name: "constructor at root", json: `{"id":"1", "code":"A.B.C", "category":"validation", "severity":"error", "message":"m", "timestamp":"2023-10-27T10:00:00Z", "constructor":{}}` },
    { name: "__proto__ nested in details", json: `{"id":"err-123","code":"VALIDATION.USER.INVALID_NAME","category":"validation","severity":"error","message":"Invalid name provided","timestamp":"2023-10-27T10:00:00.000Z","details":{"__proto__":{"polluted":true}}}` },
    { name: "constructor nested in metadata", json: `{"id":"err-123","code":"VALIDATION.USER.INVALID_NAME","category":"validation","severity":"error","message":"Invalid name provided","timestamp":"2023-10-27T10:00:00.000Z","metadata":{"constructor":{"prototype":{"polluted":true}}}}` },
    { name: "prototype inside array item", json: `{"id":"err-123","code":"VALIDATION.USER.INVALID_NAME","category":"validation","severity":"error","message":"Invalid name provided","timestamp":"2023-10-27T10:00:00.000Z","details":{"list":[{"prototype":"bad"}]}}` },
    { name: "unsafe key inside validationIssues", json: `{"id":"err-123","code":"VALIDATION.USER.INVALID_NAME","category":"validation","severity":"error","message":"Invalid name provided","timestamp":"2023-10-27T10:00:00.000Z","validationIssues":[{"code":"C","message":"M","path":["p"],"__proto__":{}}]}` }
  ];

  for (const c of cases) {
    assert.throws(() => deserializePlatformError(c.json), /UNSAFE_KEY/, `Should reject ${c.name}`);
    const result = tryDeserializePlatformError(c.json);
    assert.strictEqual(result.success, false, `tryDeserialize should fail for ${c.name}`);
    if (!result.success) {
      assert.strictEqual(result.error, "UNSAFE_KEY", `Error should be UNSAFE_KEY for ${c.name}`);
    }
  }
});

test("Explicit Unsafe Key Rejection - Serialization", () => {
  const hostile = {
    ...minimalEnvelope,
    details: {
      "other": "val"
    }
  };

  // Directly set an unsafe property that will be found by getOwnPropertyNames
  // Literal objects in some JS environments don't have __proto__ as an OWN property by default,
  // but JSON.parse creates it as an OWN property.
  // Here we simulate it.
  Object.defineProperty(hostile.details, "prototype", {
    value: { polluted: true },
    enumerable: true
  });

  assert.throws(() => serializePlatformError(hostile), /UNSAFE_KEY/);
});

test("tryDeserializePlatformError - success", () => {
  const serialized = serializePlatformError(minimalEnvelope);
  const result = tryDeserializePlatformError(serialized);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data, minimalEnvelope);
  }
});

test("tryDeserializePlatformError - fail", () => {
  const result = tryDeserializePlatformError("invalid");
  assert.strictEqual(result.success, false);
  if (!result.success) {
    assert.strictEqual(result.error, "INVALID_JSON");
  }

  const result2 = tryDeserializePlatformError(JSON.stringify({ id: "wrong" }));
  assert.strictEqual(result2.success, false);
  if (!result2.success) {
    assert.strictEqual(result2.error, "INVALID_ENVELOPE");
  }
});

test("deeply nested payload", () => {
  const nested = { a: { b: { c: { d: { e: "end" } } } } };
  const env: PlatformErrorEnvelope = {
    ...minimalEnvelope,
    details: nested
  };
  const serialized = serializePlatformError(env);
  const deserialized = deserializePlatformError(serialized);
  assert.deepEqual(deserialized.details, nested);
});

test("integration with sanitizeUnknownError", () => {
  const hostileValue = {
    message: "error",
    stack: "secret",
    password: "123",
    inner: {
      foo: "bar"
    }
  };
  const sanitized = sanitizeUnknownError(hostileValue);
  const env: PlatformErrorEnvelope = {
    ...minimalEnvelope,
    details: sanitized
  };

  const serialized = serializePlatformError(env);
  const deserialized = deserializePlatformError(serialized);

  assert.equal(deserialized.details?.message, "error");
  assert.equal(deserialized.details?.stack, undefined);
  assert.deepEqual(sanitized, { message: "error" });
});

test("no field is silently removed during round trip", () => {
  const serialized = serializePlatformError(fullEnvelope);
  const deserialized = deserializePlatformError(serialized);
  assert.deepEqual(deserialized, fullEnvelope);
});

test("Roundtrip preserves code/message/status", () => {
  const error: PlatformErrorEnvelope = {
    id: "err-123",
    code: "VALIDATION.USER.INVALID_NAME",
    category: "validation",
    severity: "error",
    message: "Invalid name provided",
    timestamp: "2023-10-27T10:00:00.000Z",
  };

  const serialized = serializePlatformError(error);
  const deserialized = deserializePlatformError(serialized);

  assert.strictEqual(deserialized.code, error.code);
  assert.strictEqual(deserialized.message, error.message);
  assert.strictEqual(deserialized.severity, error.severity);
  assert.strictEqual(deserialized.category, error.category);
  assert.strictEqual(deserialized.timestamp, error.timestamp);
});

test("Unknown details remain safe", () => {
  const error: PlatformErrorEnvelope = {
    id: "err-123",
    code: "VALIDATION.USER.INVALID_NAME",
    category: "validation",
    severity: "error",
    message: "Invalid name provided",
    timestamp: "2023-10-27T10:00:00.000Z",
    details: {
      foo: "bar",
      nested: {
         some: "value"
      }
    }
  };

  const serialized = serializePlatformError(error);
  const deserialized = deserializePlatformError(serialized);

  assert.deepEqual(deserialized.details, error.details);
});
