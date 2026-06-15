import { test, describe } from "node:test";
import assert from "node:assert";
import {
  createTraceReceipt,
  canonicalizeReceiptPayload,
  calculateReceiptHash,
  verifyReceiptHash,
  linkReceiptToPrevious,
  createSignableReceiptPayload,
  TraceReceipt,
} from "../../src/platform/documents/traceability";

describe("Document Trace Receipts Contracts & Logic", () => {
  const validReceiptInput: TraceReceipt = {
    id: "rec-123",
    workspaceId: "123e4567-e89b-12d3-a456-426614174000",
    subject: { type: "document", id: "doc-456" },
    actor: { type: "user", id: "user-789", name: "John Doe" },
    action: {
      type: "create",
      name: "Create Document",
      result: "success",
    },
    timestamp: "2023-10-27T10:00:00Z",
    source: { origin: "web-app", environment: "production" },
    artifacts: [
      {
        id: "art-001",
        name: "report.pdf",
        mediaType: "application/pdf",
        uri: "https://storage.example.com/art-001",
        size: 1024,
      },
    ],
    hashes: [
      {
        algorithm: "sha256",
        value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        scope: "artifact",
      },
    ],
    correlationId: "corr-111",
  };

  test("should create a valid receipt", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    assert.strictEqual(receipt.id, "rec-123");
    assert.strictEqual(receipt.workspaceId, "123e4567-e89b-12d3-a456-426614174000");
  });

  test("should fail if unknown fields are present in receipt", () => {
    const invalidInput = { ...validReceiptInput, unknownField: "bad" } as any;
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail if unknown fields are present in actor", () => {
    const invalidInput = { ...validReceiptInput, actor: { ...validReceiptInput.actor, extra: 1 } } as any;
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("SHA-256 length validation", () => {
    const invalidInput = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha256", value: "abc", scope: "artifact" }],
    };
    assert.throws(() => createTraceReceipt(invalidInput));

    const validHex64 = "a".repeat(64);
    const validInput = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha256", value: validHex64, scope: "artifact" }],
    };
    assert.doesNotThrow(() => createTraceReceipt(validInput));
  });

  test("SHA-512 length validation", () => {
    const invalidInput = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha512", value: "a".repeat(64), scope: "artifact" }],
    };
    assert.throws(() => createTraceReceipt(invalidInput));

    const validHex128 = "a".repeat(128);
    const validInput = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha512", value: validHex128, scope: "artifact" }],
    };
    assert.doesNotThrow(() => createTraceReceipt(validInput));
  });

  test("Artifact URI policy validation", () => {
    const invalidURIs = [
      "ftp://example.com",
      "just-a-string",
      "s3:/bucket/key", // missing double slash
    ];
    for (const uri of invalidURIs) {
      const invalidInput = {
        ...validReceiptInput,
        artifacts: [{ ...validReceiptInput.artifacts[0], uri }],
      };
      assert.throws(() => createTraceReceipt(invalidInput), `Should throw for URI: ${uri}`);
    }

    const validURIs = [
      "https://example.com",
      "s3://bucket/key",
      "minio://bucket/key",
      "urn:example:123",
      "file:///tmp/test",
    ];
    for (const uri of validURIs) {
      const validInput = {
        ...validReceiptInput,
        artifacts: [{ ...validReceiptInput.artifacts[0], uri }],
      };
      assert.doesNotThrow(() => createTraceReceipt(validInput), `Should not throw for URI: ${uri}`);
    }
  });

  test("signable payload should exclude receipt-scope hashes", () => {
    const receipt: TraceReceipt = {
      ...validReceiptInput,
      hashes: [
        { algorithm: "sha256", value: "a".repeat(64), scope: "artifact" },
        { algorithm: "sha256", value: "b".repeat(64), scope: "receipt" },
      ],
    };
    const signable = createSignableReceiptPayload(receipt);
    const parsedSignable = JSON.parse(signable);

    assert.strictEqual(parsedSignable.hashes.length, 1);
    assert.strictEqual(parsedSignable.hashes[0].scope, "artifact");
    assert.ok(!signable.includes("receipt"));
  });

  test("changing receipt-level stored hash does not alter signable payload", () => {
    const receipt1: TraceReceipt = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha256", value: "a".repeat(64), scope: "receipt" }],
    };
    const receipt2: TraceReceipt = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha256", value: "b".repeat(64), scope: "receipt" }],
    };

    const signable1 = createSignableReceiptPayload(receipt1);
    const signable2 = createSignableReceiptPayload(receipt2);

    assert.strictEqual(signable1, signable2);
  });

  test("changing business payload alters computed hash", () => {
    const receipt1 = { ...validReceiptInput, correlationId: "corr-1" };
    const receipt2 = { ...validReceiptInput, correlationId: "corr-2" };

    const s1 = createSignableReceiptPayload(receipt1);
    const s2 = createSignableReceiptPayload(receipt2);

    const h1 = calculateReceiptHash(s1, "sha256");
    const h2 = calculateReceiptHash(s2, "sha256");

    assert.notStrictEqual(h1, h2);
  });

  test("SHA-256 and SHA-512 calculation and verification", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const signable = createSignableReceiptPayload(receipt);

    const h256 = calculateReceiptHash(signable, "sha256");
    const h512 = calculateReceiptHash(signable, "sha512");

    assert.strictEqual(h256.length, 64);
    assert.strictEqual(h512.length, 128);

    const v256 = verifyReceiptHash(receipt, {
      algorithm: "sha256",
      expectedHash: h256,
      verifiedAt: "2023-10-27T11:00:00Z"
    });
    assert.strictEqual(v256.valid, true);
    assert.strictEqual(v256.timestamp, "2023-10-27T11:00:00Z");

    const v512 = verifyReceiptHash(receipt, {
      algorithm: "sha512",
      expectedHash: h512,
      verifiedAt: "2023-10-27T11:00:00Z"
    });
    assert.strictEqual(v512.valid, true);
  });

  test("deterministic verification", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const signable = createSignableReceiptPayload(receipt);
    const h256 = calculateReceiptHash(signable, "sha256");

    const v1 = verifyReceiptHash(receipt, { algorithm: "sha256", expectedHash: h256, verifiedAt: "T1" });
    const v2 = verifyReceiptHash(receipt, { algorithm: "sha256", expectedHash: h256, verifiedAt: "T1" });

    assert.deepStrictEqual(v1, v2);
  });

  test("linked receipt validation", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const linked = linkReceiptToPrevious(receipt, "prev-id");

    assert.strictEqual(linked.previousReceiptId, "prev-id");
    assert.notStrictEqual(receipt, linked); // should be new object
    assert.doesNotThrow(() => createTraceReceipt(linked)); // should be valid
  });

  test("canonicalization edge cases", () => {
    const cases = [
      { input: { b: 2, a: 1 }, expected: '{"a":1,"b":2}' },
      { input: { a: [3, 2, 1] }, expected: '{"a":[3,2,1]}' },
      { input: { a: null, b: true, c: 1.5, d: "Unicode \u2713" }, expected: '{"a":null,"b":true,"c":1.5,"d":"Unicode \u2713"}' },
      { input: { a: undefined, b: 1 }, expected: '{"b":1}' },
      { input: [undefined, 1], expected: '[null,1]' }, // JSON.stringify behavior for arrays
    ];

    for (const { input, expected } of cases) {
      assert.strictEqual(canonicalizeReceiptPayload(input), expected);
    }
  });

  test("should not mutate input object and support frozen input", () => {
    const input = JSON.parse(JSON.stringify(validReceiptInput));
    Object.freeze(input);
    assert.doesNotThrow(() => createSignableReceiptPayload(input));
    assert.doesNotThrow(() => createTraceReceipt(input));
  });
});
