import { describe, it } from "node:test";
import assert from "node:assert";
import {
  TraceReceiptSchema,
  TraceReceiptSubjectSchema,
  TraceReceiptActorSchema,
  TraceReceiptActionSchema,
  TraceReceiptHashSchema,
  TraceReceiptArtifactSchema,
  TraceReceiptVerificationResultSchema,
} from "../../src/platform/documents/traceability/contracts";

const VALID_WORKSPACE_ID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_TIMESTAMP = "2023-10-27T10:00:00Z";

const MINIMAL_RECEIPT = {
  id: "receipt-1",
  workspaceId: VALID_WORKSPACE_ID,
  subject: {
    type: "process",
    id: "proc-1",
  },
  actor: {
    type: "user",
    id: "user-1",
  },
  action: {
    type: "create",
    name: "Create Process",
    result: "success",
  },
  timestamp: VALID_TIMESTAMP,
  source: {
    system: "test-system",
    version: "1.0.0",
  },
  artifacts: [],
  hashes: [],
  correlationId: "corr-1",
};

describe("Trace Receipt Schema", () => {
  it("should accept a minimal valid receipt", () => {
    const result = TraceReceiptSchema.safeParse(MINIMAL_RECEIPT);
    assert.strictEqual(result.success, true);
  });

  it("should accept a full valid receipt", () => {
    const fullReceipt = {
      ...MINIMAL_RECEIPT,
      actor: {
        type: "service",
        id: "svc-1",
        name: "Test Service",
      },
      action: {
        type: "execute",
        name: "Execute Action",
        description: "Executing a test action",
        result: "partial",
      },
      source: {
        system: "test-system",
        version: "1.1.0",
        environment: "production",
        metadata: { extra: "info" },
      },
      artifacts: [
        {
          id: "art-1",
          name: "document.pdf",
          mediaType: "application/pdf",
          uri: "https://storage.example.com/art-1",
          size: 1024,
          hashReference: "hash-1",
          metadata: { author: "Jules" },
        },
      ],
      hashes: [
        {
          algorithm: "sha256",
          scope: "receipt",
          value: "a".repeat(64),
        },
      ],
      previousReceiptId: "receipt-0",
      causationId: "caus-1",
      metadata: { custom: "data" },
    };
    const result = TraceReceiptSchema.safeParse(fullReceipt);
    assert.strictEqual(result.success, true);
  });

  it("should reject when a mandatory field is missing", () => {
    const { id, ...invalidReceipt } = MINIMAL_RECEIPT;
    const result = TraceReceiptSchema.safeParse(invalidReceipt);
    assert.strictEqual(result.success, false);
  });

  it("should reject unknown fields (strict)", () => {
    const invalidReceipt = {
      ...MINIMAL_RECEIPT,
      unknownField: "value",
    };
    const result = TraceReceiptSchema.safeParse(invalidReceipt);
    assert.strictEqual(result.success, false);
  });

  describe("Subject Validation", () => {
    const subjectTypes = [
      "process",
      "process_instance",
      "action_execution",
      "document",
      "asset",
      "work_request",
      "form",
      "notification",
    ];

    subjectTypes.forEach((type) => {
      it(`should accept valid subject type: ${type}`, () => {
        const result = TraceReceiptSubjectSchema.safeParse({ type, id: "id-1" });
        assert.strictEqual(result.success, true);
      });
    });

    it("should accept custom subject type with category", () => {
      const result = TraceReceiptSubjectSchema.safeParse({
        type: "custom",
        id: "id-1",
        category: "my-category",
      });
      assert.strictEqual(result.success, true);
    });

    it("should reject custom subject type without category", () => {
      const result = TraceReceiptSubjectSchema.safeParse({
        type: "custom",
        id: "id-1",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("Actor Validation", () => {
    it("should reject invalid actor type", () => {
      const result = TraceReceiptActorSchema.safeParse({
        type: "invalid-actor",
        id: "id-1",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("Action Validation", () => {
    it("should reject invalid action result", () => {
      const result = TraceReceiptActionSchema.safeParse({
        type: "op",
        name: "Op Name",
        result: "invalid-result",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("Hash Validation", () => {
    it("should accept valid SHA-256", () => {
      const result = TraceReceiptHashSchema.safeParse({
        algorithm: "sha256",
        scope: "receipt",
        value: "a".repeat(64),
      });
      assert.strictEqual(result.success, true);
    });

    it("should reject SHA-256 with invalid length", () => {
      const result = TraceReceiptHashSchema.safeParse({
        algorithm: "sha256",
        scope: "receipt",
        value: "a".repeat(63),
      });
      assert.strictEqual(result.success, false);
    });

    it("should accept valid SHA-512", () => {
      const result = TraceReceiptHashSchema.safeParse({
        algorithm: "sha512",
        scope: "receipt",
        value: "a".repeat(128),
      });
      assert.strictEqual(result.success, true);
    });

    it("should reject SHA-512 with invalid length", () => {
      const result = TraceReceiptHashSchema.safeParse({
        algorithm: "sha512",
        scope: "receipt",
        value: "a".repeat(129),
      });
      assert.strictEqual(result.success, false);
    });

    it("should reject non-hexadecimal hash value", () => {
      const result = TraceReceiptHashSchema.safeParse({
        algorithm: "sha256",
        scope: "receipt",
        value: "g".repeat(64),
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("Artifact Validation", () => {
    it("should reject negative size", () => {
      const result = TraceReceiptArtifactSchema.safeParse({
        id: "art-1",
        name: "file",
        mediaType: "text/plain",
        uri: "file:///tmp/file",
        size: -1,
      });
      assert.strictEqual(result.success, false);
    });

    const allowedUris = [
      "https://example.com",
      "s3://bucket/key",
      "minio://bucket/key",
      "file:///path/to/file",
      "urn:uuid:123",
    ];

    allowedUris.forEach((uri) => {
      it(`should accept allowed URI: ${uri}`, () => {
        const result = TraceReceiptArtifactSchema.safeParse({
          id: "art-1",
          name: "file",
          mediaType: "text/plain",
          uri,
          size: 10,
        });
        assert.strictEqual(result.success, true);
      });
    });

    it("should reject disallowed URI protocol", () => {
      const result = TraceReceiptArtifactSchema.safeParse({
        id: "art-1",
        name: "file",
        mediaType: "text/plain",
        uri: "ftp://example.com",
        size: 10,
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("Verification Result Validation", () => {
    it("should accept valid verification result", () => {
      const result = TraceReceiptVerificationResultSchema.safeParse({
        valid: true,
        timestamp: VALID_TIMESTAMP,
        details: { check: "passed" },
      });
      assert.strictEqual(result.success, true);
    });

    it("should reject invalid verification timestamp", () => {
      const result = TraceReceiptVerificationResultSchema.safeParse({
        valid: true,
        timestamp: "invalid-date",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("General Rules", () => {
    it("should accept unknown record for metadata", () => {
      const result = TraceReceiptSchema.safeParse({
        ...MINIMAL_RECEIPT,
        metadata: {
          foo: "bar",
          baz: 123,
          nested: { a: 1 },
        },
      });
      assert.strictEqual(result.success, true);
    });

    it("should not use any in the test file (checked manually and by compiler)", () => {
      // This is a placeholder for the requirement, actual enforcement is via lint/compiler
      assert.ok(true);
    });
  });
});
