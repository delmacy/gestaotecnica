import { test, describe } from "node:test";
import assert from "node:assert";
import {
  UUIDSchema,
  WorkspaceIdSchema,
  WorkspaceContextSchema,
  EntityIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
  ActorReferenceSchema,
  CorrelationContextSchema,
} from "../../src/platform/contracts";

describe("Shared Contracts - Shared Canonical Primitives", () => {
  describe("UUID and Workspace", () => {
    test("should accept a valid UUID", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";
      assert.doesNotThrow(() => UUIDSchema.parse(validUuid));
    });

    test("should reject an invalid UUID", () => {
      const invalidUuid = "not-a-uuid";
      assert.throws(() => UUIDSchema.parse(invalidUuid));
    });

    test("should accept a valid WorkspaceId", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";
      assert.doesNotThrow(() => WorkspaceIdSchema.parse(validUuid));
    });

    test("should reject an invalid WorkspaceId", () => {
      const invalidUuid = "not-a-uuid";
      assert.throws(() => WorkspaceIdSchema.parse(invalidUuid));
    });

    test("should reject WorkspaceContext without workspaceId", () => {
      assert.throws(() => WorkspaceContextSchema.parse({}));
    });

    test("should accept WorkspaceContext with valid workspaceId", () => {
      const validContext = { workspaceId: "550e8400-e29b-41d4-a716-446655440000" };
      assert.doesNotThrow(() => WorkspaceContextSchema.parse(validContext));
    });
  });

  describe("EntityId", () => {
    test("should accept a non-empty string as EntityId", () => {
      assert.doesNotThrow(() => EntityIdSchema.parse("entity-123"));
      assert.doesNotThrow(() => EntityIdSchema.parse("550e8400-e29b-41d4-a716-446655440000"));
    });

    test("should reject an empty string as EntityId", () => {
      assert.throws(() => EntityIdSchema.parse(""));
    });
  });

  describe("ISODateTime", () => {
    test("should accept a valid ISO datetime string", () => {
      assert.doesNotThrow(() => ISODateTimeSchema.parse("2023-10-27T10:00:00Z"));
      assert.doesNotThrow(() => ISODateTimeSchema.parse("2023-10-27T10:00:00.000Z"));
    });

    test("should accept valid date boundaries like leap years", () => {
      assert.doesNotThrow(() => ISODateTimeSchema.parse("2024-02-29T00:00:00Z")); // 2024 is a leap year
      assert.doesNotThrow(() => ISODateTimeSchema.parse("2000-02-29T00:00:00Z")); // 2000 is a leap year
    });

    test("should reject invalid date boundaries", () => {
      assert.throws(() => ISODateTimeSchema.parse("2023-02-29T00:00:00Z")); // 2023 is not a leap year
      assert.throws(() => ISODateTimeSchema.parse("2023-11-31T00:00:00Z")); // November has 30 days
      assert.throws(() => ISODateTimeSchema.parse("2023-04-31T00:00:00Z")); // April has 30 days
      assert.throws(() => ISODateTimeSchema.parse("2100-02-29T00:00:00Z")); // 2100 is not a leap year
    });

    test("should reject an invalid ISO datetime string", () => {
      assert.throws(() => ISODateTimeSchema.parse("2023-10-27"));
      assert.throws(() => ISODateTimeSchema.parse("not-a-date"));
    });

    test("should reject ISO datetime strings missing timezone or poorly formatted", () => {
      assert.throws(() => ISODateTimeSchema.parse("2023-10-27T10:00:00")); // missing Z
      assert.throws(() => ISODateTimeSchema.parse("2023-10-27 10:00:00Z")); // space instead of T
      assert.throws(() => ISODateTimeSchema.parse("2023-10-27T10:00:00.Z")); // malformed ms
    });
  });

  describe("UnknownRecord", () => {
    test("should accept a valid record", () => {
      const payload = {
        foo: "bar",
        count: 1,
        nested: { a: true },
      };
      assert.doesNotThrow(() => UnknownRecordSchema.parse(payload));
    });

    test("should reject non-record values", () => {
      assert.throws(() => UnknownRecordSchema.parse("string"));
      assert.throws(() => UnknownRecordSchema.parse(123));
    });
  });

  describe("ActorReference", () => {
    const actorTypes = ["human", "system", "worker", "integration"] as const;

    actorTypes.forEach((type) => {
      test(`should accept a valid actor reference for type: ${type}`, () => {
        assert.doesNotThrow(() => ActorReferenceSchema.parse({ type, id: "actor-123" }));
      });
    });

    test("should reject an invalid actor type", () => {
      assert.throws(() => ActorReferenceSchema.parse({ type: "alien", id: "actor-123" }));
    });

    test("should reject an actor reference with empty id", () => {
      assert.throws(() => ActorReferenceSchema.parse({ type: "human", id: "" }));
    });
  });

  describe("CorrelationContext", () => {
    test("should accept a minimal correlation context", () => {
      const minimal = { correlationId: "corr-123" };
      assert.doesNotThrow(() => CorrelationContextSchema.parse(minimal));
    });

    test("should accept a complete correlation context", () => {
      const complete = {
        correlationId: "corr-123",
        causationId: "caus-123",
        idempotencyKey: "idem-123",
      };
      const parsed = CorrelationContextSchema.parse(complete);
      assert.strictEqual(parsed.correlationId, "corr-123");
      assert.strictEqual(parsed.causationId, "caus-123");
      assert.strictEqual(parsed.idempotencyKey, "idem-123");
    });

    test("should preserve values and not substitute them", () => {
      const input = {
        correlationId: "preserve-corr",
        causationId: "preserve-caus",
        idempotencyKey: "preserve-idem",
      };
      const parsed = CorrelationContextSchema.parse(input);
      assert.deepStrictEqual(parsed, input);
    });

    test("should reject CorrelationContext without correlationId", () => {
      assert.throws(() => CorrelationContextSchema.parse({ causationId: "caus-123" }));
    });

    test("should allow optional causationId and idempotencyKey", () => {
       const minimal = CorrelationContextSchema.parse({ correlationId: "corr-1" });
       assert.strictEqual(minimal.causationId, undefined);
       assert.strictEqual(minimal.idempotencyKey, undefined);
    });
  });
});
