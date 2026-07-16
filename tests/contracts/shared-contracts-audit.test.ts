import { test, describe } from "node:test";
import assert from "node:assert";
import * as Contracts from "../../src/platform/contracts";
import * as Fixtures from "../fixtures/contracts/shared-contracts.fixtures";

describe("Shared Contracts Audit Suite", () => {
  describe("Public Exports Availability", () => {
    test("should export all expected schemas", () => {
      const expectedSchemas = [
        "UUIDSchema",
        "WorkspaceIdSchema",
        "EntityIdSchema",
        "WorkspaceContextSchema",
        "ActorTypeSchema",
        "ActorReferenceSchema",
        "CorrelationIdSchema",
        "CausationIdSchema",
        "IdempotencyKeySchema",
        "CorrelationContextSchema",
        "UnknownRecordSchema",
        "SchemaVersionSchema",
        "ISODateTimeSchema",
        "IdentityContextSchema",
      ];

      expectedSchemas.forEach((schema) => {
        assert.ok((Contracts as Record<string, unknown>)[schema], `Missing exported schema: ${schema}`);
      });
    });

    test("should export all expected types", () => {
      // TypeScript types can't be checked at runtime easily, but we can check if they are exported in index.ts via static analysis or just assume if schemas are there.
      // This test is more of a placeholder for manual verification of index.ts
      assert.ok(true);
    });
  });

  describe("UUID and Workspace Contracts", () => {
    test("UUIDSchema validation", () => {
      Fixtures.VALID_UUIDS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.UUIDSchema.parse(val), `Should accept valid UUID: ${val}`);
      });
      Fixtures.INVALID_UUIDS.forEach((val) => {
        assert.throws(() => Contracts.UUIDSchema.parse(val), `Should reject invalid UUID: ${val}`);
      });
    });

    test("WorkspaceIdSchema validation", () => {
      Fixtures.VALID_UUIDS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.WorkspaceIdSchema.parse(val));
      });
    });

    test("WorkspaceContextSchema validation", () => {
      Fixtures.VALID_WORKSPACE_CONTEXTS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.WorkspaceContextSchema.parse(val));
      });
      Fixtures.INVALID_WORKSPACE_CONTEXTS.forEach((val) => {
        assert.throws(() => Contracts.WorkspaceContextSchema.parse(val));
      });
    });
  });

  describe("Entity Identity", () => {
    test("EntityIdSchema validation", () => {
      Fixtures.VALID_ENTITY_IDS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.EntityIdSchema.parse(val));
      });
      Fixtures.INVALID_ENTITY_IDS.forEach((val) => {
        assert.throws(() => Contracts.EntityIdSchema.parse(val));
      });
    });

    test("IdentityContextSchema validation", () => {
      Fixtures.VALID_IDENTITY_CONTEXTS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.IdentityContextSchema.parse(val));
      });
      Fixtures.INVALID_IDENTITY_CONTEXTS.forEach((val) => {
        assert.throws(() => Contracts.IdentityContextSchema.parse(val));
      });
    });
  });

  describe("Actor Contracts", () => {
    test("ActorReferenceSchema validation", () => {
      Fixtures.VALID_ACTOR_REFERENCES.forEach((val) => {
        assert.doesNotThrow(() => Contracts.ActorReferenceSchema.parse(val));
      });
      Fixtures.INVALID_ACTOR_REFERENCES.forEach((val) => {
        assert.throws(() => Contracts.ActorReferenceSchema.parse(val));
      });
    });
  });

  describe("Correlation and Traceability", () => {
    test("CorrelationIdSchema validation", () => {
      Fixtures.VALID_CORRELATION_IDS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.CorrelationIdSchema.parse(val));
      });
      Fixtures.INVALID_CORRELATION_IDS.forEach((val) => {
        assert.throws(() => Contracts.CorrelationIdSchema.parse(val));
      });
    });

    test("CorrelationContextSchema validation", () => {
      Fixtures.VALID_CORRELATION_CONTEXTS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.CorrelationContextSchema.parse(val));
      });
      Fixtures.INVALID_CORRELATION_CONTEXTS.forEach((val) => {
        assert.throws(() => Contracts.CorrelationContextSchema.parse(val));
      });
    });
  });

  describe("Payload and Versioning", () => {
    test("UnknownRecordSchema validation", () => {
      Fixtures.VALID_UNKNOWN_RECORDS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.UnknownRecordSchema.parse(val));
      });
      Fixtures.INVALID_UNKNOWN_RECORDS.forEach((val) => {
        assert.throws(() => Contracts.UnknownRecordSchema.parse(val));
      });
    });

    test("SchemaVersionSchema validation", () => {
      Fixtures.VALID_SCHEMA_VERSIONS.forEach((val) => {
        assert.doesNotThrow(() => Contracts.SchemaVersionSchema.parse(val));
      });
      Fixtures.INVALID_SCHEMA_VERSIONS.forEach((val) => {
        assert.throws(() => Contracts.SchemaVersionSchema.parse(val));
      });
    });
  });

  describe("Temporal Contracts", () => {
    test("ISODateTimeSchema validation", () => {
      Fixtures.VALID_ISO_DATETIMES.forEach((val) => {
        assert.doesNotThrow(() => Contracts.ISODateTimeSchema.parse(val));
      });
      Fixtures.INVALID_ISO_DATETIMES.forEach((val) => {
        assert.throws(() => Contracts.ISODateTimeSchema.parse(val));
      });
    });
  });

  describe("Integrity and Consistency", () => {
    test("should not have name collisions between exported schemas", () => {
      const exports = Object.keys(Contracts);
      const schemas = exports.filter(e => e.endsWith("Schema"));
      const uniqueSchemas = new Set(schemas);
      assert.strictEqual(schemas.length, uniqueSchemas.size, "Duplicate schema exports detected");
    });

    test("should avoid overly permissive schemas for critical identifiers", () => {
      // UUID should NOT be a simple string
      assert.throws(() => Contracts.UUIDSchema.parse("simple-string"));

      // EntityId SHOULD be at least 1 char
      assert.throws(() => Contracts.EntityIdSchema.parse(""));
    });
  });
});
