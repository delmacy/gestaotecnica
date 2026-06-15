import { test, describe } from "node:test";
import assert from "node:assert";
import {
  createTraceReceipt,
  canonicalizeReceiptPayload,
  calculateReceiptHash,
  verifyReceiptHash,
  linkReceiptToPrevious,
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

  test("should fail if workspaceId is missing", () => {
    const { workspaceId, ...invalidInput } = validReceiptInput as any;
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail if correlationId is missing", () => {
    const { correlationId, ...invalidInput } = validReceiptInput as any;
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail with invalid actor type", () => {
    const invalidInput = { ...validReceiptInput, actor: { type: "invalid", id: "1" } };
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail with invalid subject type", () => {
    const invalidInput = { ...validReceiptInput, subject: { type: "invalid", id: "1" } };
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail with invalid action result", () => {
    const invalidInput = {
      ...validReceiptInput,
      action: { ...validReceiptInput.action, result: "invalid" },
    };
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail with invalid hash format", () => {
    const invalidInput = {
      ...validReceiptInput,
      hashes: [{ algorithm: "sha256", value: "not-hex", scope: "receipt" }],
    };
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail with invalid algorithm", () => {
    const invalidInput = {
      ...validReceiptInput,
      hashes: [{ algorithm: "md5", value: "abc", scope: "receipt" }],
    } as any;
    assert.throws(() => createTraceReceipt(invalidInput));
  });

  test("should fail if linking to itself", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    assert.throws(() => linkReceiptToPrevious(receipt, receipt.id));
  });

  test("should link to previous receipt correctly", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const linked = linkReceiptToPrevious(receipt, "prev-999");
    assert.strictEqual(linked.previousReceiptId, "prev-999");
  });

  test("canonicalization should be deterministic regardless of property order", () => {
    const obj1 = { a: 1, b: 2, c: { d: 3, e: 4 }, f: [{ h: 1, g: 2 }] };
    const obj2 = { b: 2, a: 1, c: { e: 4, d: 3 }, f: [{ g: 2, h: 1 }] };

    const canon1 = canonicalizeReceiptPayload(obj1);
    const canon2 = canonicalizeReceiptPayload(obj2);

    assert.strictEqual(canon1, canon2);
    assert.strictEqual(canon1, '{"a":1,"b":2,"c":{"d":3,"e":4},"f":[{"g":2,"h":1}]}');
  });

  test("hash should change if payload changes", () => {
    const h1 = calculateReceiptHash("payload1");
    const h2 = calculateReceiptHash("payload2");
    assert.notStrictEqual(h1, h2);
  });

  test("verifyReceiptHash success", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const canon = canonicalizeReceiptPayload(receipt);
    const hash = calculateReceiptHash(canon, "sha256");
    const result = verifyReceiptHash(receipt, hash);
    assert.strictEqual(result.valid, true);
  });

  test("verifyReceiptHash failure", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const result = verifyReceiptHash(receipt, "wrong-hash");
    assert.strictEqual(result.valid, false);
    assert.ok(result.details?.includes("Hash mismatch"));
  });

  test("should not mutate input object", () => {
    const input = JSON.parse(JSON.stringify(validReceiptInput));
    Object.freeze(input);
    assert.doesNotThrow(() => canonicalizeReceiptPayload(input));
    assert.doesNotThrow(() => createTraceReceipt(input));
  });

  test("should be JSON serializable", () => {
    const receipt = createTraceReceipt(validReceiptInput);
    const serialized = JSON.stringify(receipt);
    const parsed = JSON.parse(serialized);
    assert.deepStrictEqual(parsed, receipt);
  });
});
