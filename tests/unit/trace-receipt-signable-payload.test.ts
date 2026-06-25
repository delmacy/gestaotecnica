import { describe, it } from "node:test";
import assert from "node:assert";
import {
  TraceReceipt,
  TraceReceiptSchema,
  TraceReceiptHashSchema,
  createSignableTraceReceiptPayload,
  canonicalizeSignableTraceReceipt,
  createTraceReceiptSelfHash,
} from "../../src/platform/documents/traceability";

const VALID_WORKSPACE_ID = "123e4567-e89b-12d3-a456-426614174000";
const VALID_TIMESTAMP = "2023-10-27T10:00:00Z";

const MINIMAL_RECEIPT: TraceReceipt = {
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

const FULL_RECEIPT: TraceReceipt = {
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
    metadata: {
      extra: "info",
      hashes: [{ alg: "md5", val: "old" }] // Nested hashes should be preserved
    },
  },
  artifacts: [
    {
      id: "art-1",
      name: "document.pdf",
      mediaType: "application/pdf",
      uri: "https://storage.example.com/art-1",
      size: 1024,
      hashReference: "hash-1",
      metadata: {
        author: "Jules",
        hashes: ["should-stay"] // Nested hashes should be preserved
      },
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
  metadata: {
    custom: "data",
    hashes: { internal: true } // Nested hashes should be preserved
  },
};

/**
 * Deeply freezes an object
 */
function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as Record<string, unknown>)[prop];
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}

describe("Trace Receipt Signable Payload", () => {
  it("should create payload for minimal valid receipt", () => {
    const payload = createSignableTraceReceiptPayload(MINIMAL_RECEIPT);
    assert.ok(payload);
    assert.strictEqual(payload.id, MINIMAL_RECEIPT.id);
    assert.strictEqual("hashes" in payload, false);
  });

  it("should create payload for full valid receipt", () => {
    const payload = createSignableTraceReceiptPayload(FULL_RECEIPT);
    assert.ok(payload);
    assert.strictEqual(payload.id, FULL_RECEIPT.id);
    assert.strictEqual("hashes" in payload, false);
  });

  it("should remove top-level hashes but preserve nested ones", () => {
    const payload = createSignableTraceReceiptPayload(FULL_RECEIPT);

    assert.strictEqual("hashes" in payload, false);

    // Check nested in metadata
    const metadata = payload.metadata as Record<string, unknown>;
    assert.ok(metadata.hashes);

    // Check nested in source.metadata
    const source = payload.source as Record<string, unknown>;
    const sourceMetadata = source.metadata as Record<string, unknown>;
    assert.ok(sourceMetadata.hashes);

    // Check nested in artifacts
    const artifacts = payload.artifacts as Array<Record<string, unknown>>;
    const artifactMetadata = artifacts[0].metadata as Record<string, unknown>;
    assert.ok(artifactMetadata.hashes);
  });

  it("should preserve specific fields", () => {
    const payload = createSignableTraceReceiptPayload(FULL_RECEIPT);
    assert.strictEqual(payload.previousReceiptId, FULL_RECEIPT.previousReceiptId);
    assert.strictEqual(payload.correlationId, FULL_RECEIPT.correlationId);
    assert.strictEqual(payload.causationId, FULL_RECEIPT.causationId);
    assert.deepStrictEqual(payload.artifacts, FULL_RECEIPT.artifacts);
  });

  it("should keep optional fields absent if they were absent", () => {
    const payload = createSignableTraceReceiptPayload(MINIMAL_RECEIPT);
    assert.strictEqual("previousReceiptId" in payload, false);
    assert.strictEqual("causationId" in payload, false);
    assert.strictEqual("metadata" in payload, false);
  });

  it("should reject invalid receipt", () => {
    const invalidReceipt = { ...MINIMAL_RECEIPT, id: "" };
    assert.throws(() => createSignableTraceReceiptPayload(invalidReceipt as unknown as TraceReceipt));
  });

  it("should reject unknown fields in input", () => {
    const invalidReceipt = { ...MINIMAL_RECEIPT, unknownField: "bad" };
    assert.throws(() => createSignableTraceReceiptPayload(invalidReceipt as unknown as TraceReceipt));
  });

  it("should return a new top-level object", () => {
    const payload = createSignableTraceReceiptPayload(FULL_RECEIPT);
    assert.notStrictEqual(payload, FULL_RECEIPT);
  });

  it("should work with deep-frozen input", () => {
    const frozenReceipt = deepFreeze(structuredClone(FULL_RECEIPT));
    const payload = createSignableTraceReceiptPayload(frozenReceipt);
    assert.strictEqual(payload.id, frozenReceipt.id);
  });

  it("should not mutate original input (deep check)", () => {
    const receipt = structuredClone(FULL_RECEIPT);

    // Capture references
    const originalArtifacts = receipt.artifacts;
    const originalMetadata = receipt.metadata;
    const originalHashes = receipt.hashes;
    const originalSourceMetadata = receipt.source.metadata;

    createSignableTraceReceiptPayload(receipt);

    // Verify values unchanged
    assert.deepStrictEqual(receipt, FULL_RECEIPT);

    // Verify references unchanged (proves no mutation like sort or splice)
    assert.strictEqual(receipt.artifacts, originalArtifacts);
    assert.strictEqual(receipt.metadata, originalMetadata);
    assert.strictEqual(receipt.hashes, originalHashes);
    assert.strictEqual(receipt.source.metadata, originalSourceMetadata);
  });

  it("should produce deterministic canonicalization", () => {
    const c1 = canonicalizeSignableTraceReceipt(FULL_RECEIPT);
    const c2 = canonicalizeSignableTraceReceipt(FULL_RECEIPT);
    assert.strictEqual(c1, c2);
  });

  it("should produce same canonicalization regardless of key order in input", () => {
    const receipt1 = { ...MINIMAL_RECEIPT };
    const receipt2: TraceReceipt = {
      correlationId: MINIMAL_RECEIPT.correlationId,
      hashes: MINIMAL_RECEIPT.hashes,
      artifacts: MINIMAL_RECEIPT.artifacts,
      source: MINIMAL_RECEIPT.source,
      timestamp: MINIMAL_RECEIPT.timestamp,
      action: MINIMAL_RECEIPT.action,
      actor: MINIMAL_RECEIPT.actor,
      subject: MINIMAL_RECEIPT.subject,
      workspaceId: MINIMAL_RECEIPT.workspaceId,
      id: MINIMAL_RECEIPT.id,
    };

    const c1 = canonicalizeSignableTraceReceipt(receipt1);
    const c2 = canonicalizeSignableTraceReceipt(receipt2);
    assert.strictEqual(c1, c2);
  });

  it("should not change canonicalization if only top-level hashes change", () => {
    const receipt1 = { ...FULL_RECEIPT };
    const receipt2 = {
      ...FULL_RECEIPT,
      hashes: [
        { algorithm: "sha512" as const, scope: "receipt" as const, value: "b".repeat(128) }
      ]
    };

    const c1 = canonicalizeSignableTraceReceipt(receipt1);
    const c2 = canonicalizeSignableTraceReceipt(receipt2);
    assert.strictEqual(c1, c2);
  });

  it("should change canonicalization if action changes", () => {
    const receipt1 = { ...FULL_RECEIPT };
    const receipt2 = {
      ...FULL_RECEIPT,
      action: { ...FULL_RECEIPT.action, name: "Changed Action" }
    };

    const c1 = canonicalizeSignableTraceReceipt(receipt1);
    const c2 = canonicalizeSignableTraceReceipt(receipt2);
    assert.notStrictEqual(c1, c2);
  });

  it("should create valid SHA-256 self hash", () => {
    const hash = createTraceReceiptSelfHash(FULL_RECEIPT, "sha256");
    assert.strictEqual(hash.algorithm, "sha256");
    assert.strictEqual(hash.scope, "receipt");
    assert.strictEqual(hash.value.length, 64);
    TraceReceiptHashSchema.parse(hash);
  });

  it("should create valid SHA-512 self hash", () => {
    const hash = createTraceReceiptSelfHash(FULL_RECEIPT, "sha512");
    assert.strictEqual(hash.algorithm, "sha512");
    assert.strictEqual(hash.scope, "receipt");
    assert.strictEqual(hash.value.length, 128);
    TraceReceiptHashSchema.parse(hash);
  });

  it("should not change self hash if only top-level hashes change", () => {
    const h1 = createTraceReceiptSelfHash(FULL_RECEIPT, "sha256");
    const receipt2 = {
      ...FULL_RECEIPT,
      hashes: []
    };
    const h2 = createTraceReceiptSelfHash(receipt2, "sha256");
    assert.strictEqual(h1.value, h2.value);
  });

  it("should change self hash if artifact changes", () => {
    const h1 = createTraceReceiptSelfHash(FULL_RECEIPT, "sha256");
    const receipt2 = {
      ...FULL_RECEIPT,
      artifacts: [{ ...FULL_RECEIPT.artifacts[0], name: "changed.pdf" }]
    };
    const h2 = createTraceReceiptSelfHash(receipt2, "sha256");
    assert.notStrictEqual(h1.value, h2.value);
  });

  it("should change self hash if previousReceiptId changes", () => {
    const h1 = createTraceReceiptSelfHash(FULL_RECEIPT, "sha256");
    const receipt2 = {
      ...FULL_RECEIPT,
      previousReceiptId: "new-prev-id"
    };
    const h2 = createTraceReceiptSelfHash(receipt2, "sha256");
    assert.notStrictEqual(h1.value, h2.value);
  });
});
