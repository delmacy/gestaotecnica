import { test } from "node:test";
import assert from "node:assert";
import {
  TraceReceipt,
  createTraceReceiptSelfHash,
  findTraceReceiptSelfHash,
  verifyTraceReceiptSelfHash,
  verifyTraceReceiptLink,
  verifyTraceReceiptChain,
} from "../../src/platform/documents/traceability";

/**
 * Fixture factory for valid TraceReceipts
 */
function createMockReceipt(overrides: Partial<TraceReceipt> = {}): TraceReceipt {
  const receipt: TraceReceipt = {
    id: "receipt-1",
    workspaceId: "00000000-0000-0000-0000-000000000000",
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
    timestamp: "2023-01-01T00:00:00Z",
    source: {
      system: "test",
      version: "1.0.0",
    },
    artifacts: [],
    hashes: [],
    correlationId: "corr-1",
    ...overrides,
  };

  // If no hashes provided, add a valid self-hash
  if (receipt.hashes.length === 0) {
    const selfHash = createTraceReceiptSelfHash(receipt, "sha256");
    receipt.hashes.push(selfHash);
  }

  return receipt;
}

test("findTraceReceiptSelfHash: finds single receipt hash", () => {
  const receipt = createMockReceipt();
  const found = findTraceReceiptSelfHash(receipt);
  assert.ok(found);
  assert.strictEqual(found?.scope, "receipt");
});

test("findTraceReceiptSelfHash: returns undefined if no receipt hash", () => {
  const receipt = createMockReceipt();
  receipt.hashes = receipt.hashes.filter((h) => h.scope !== "receipt");
  const found = findTraceReceiptSelfHash(receipt);
  assert.strictEqual(found, undefined);
});

test("findTraceReceiptSelfHash: ignores hashes of other scopes", () => {
  const receipt = createMockReceipt();
  receipt.hashes.push({
    algorithm: "sha256",
    scope: "artifact",
    value: "a".repeat(64),
  });
  const found = findTraceReceiptSelfHash(receipt);
  assert.ok(found);
  assert.strictEqual(found?.scope, "receipt");
});

test("findTraceReceiptSelfHash: returns undefined if multiple receipt hashes", () => {
  const receipt = createMockReceipt();
  receipt.hashes.push({
    algorithm: "sha256",
    scope: "receipt",
    value: "b".repeat(64),
  });
  const found = findTraceReceiptSelfHash(receipt);
  assert.strictEqual(found, undefined);
});

test("verifyTraceReceiptSelfHash: validates sha256 self-hash", () => {
  const receipt = createMockReceipt();
  assert.strictEqual(verifyTraceReceiptSelfHash(receipt), true);
});

test("verifyTraceReceiptSelfHash: validates sha512 self-hash", () => {
  const receipt = createMockReceipt({ hashes: [] });
  const selfHash = createTraceReceiptSelfHash(receipt, "sha512");
  receipt.hashes = [selfHash]; // Use assignment instead of push to be sure
  assert.strictEqual(verifyTraceReceiptSelfHash(receipt), true);
});

test("verifyTraceReceiptSelfHash: returns false for altered receipt", () => {
  const receipt = createMockReceipt();
  const altered = { ...receipt, correlationId: "corr-2" };
  assert.strictEqual(verifyTraceReceiptSelfHash(altered), false);
});

test("verifyTraceReceiptSelfHash: returns false for altered hash value", () => {
  const receipt = createMockReceipt();
  const selfHash = receipt.hashes.find((h) => h.scope === "receipt")!;
  selfHash.value = "f".repeat(64);
  assert.strictEqual(verifyTraceReceiptSelfHash(receipt), false);
});

test("verifyTraceReceiptSelfHash: returns false if more than one self-hash exists", () => {
  const receipt = createMockReceipt();
  receipt.hashes.push({
    algorithm: "sha256",
    scope: "receipt",
    value: "b".repeat(64),
  });
  assert.strictEqual(verifyTraceReceiptSelfHash(receipt), false);
});

test("verifyTraceReceiptSelfHash: returns false for structurally invalid receipt", () => {
  const receipt = createMockReceipt();
  // @ts-expect-error
  delete receipt.actor;
  assert.strictEqual(verifyTraceReceiptSelfHash(receipt), false);
});

test("verifyTraceReceiptLink: valid direct link", () => {
  const previous = createMockReceipt({ id: "prev-1" });
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "prev-1",
  });
  assert.strictEqual(verifyTraceReceiptLink(previous, current), true);
});

test("verifyTraceReceiptLink: invalid if previousReceiptId doesn't match", () => {
  const previous = createMockReceipt({ id: "prev-1" });
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "wrong-id",
  });
  assert.strictEqual(verifyTraceReceiptLink(previous, current), false);
});

test("verifyTraceReceiptChain: empty chain is valid", () => {
  const result = verifyTraceReceiptChain([]);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
});

test("verifyTraceReceiptChain: single root receipt is valid", () => {
  const root = createMockReceipt({ id: "root", previousReceiptId: undefined });
  const result = verifyTraceReceiptChain([root]);
  assert.strictEqual(result.valid, true);
});

test("verifyTraceReceiptChain: valid chain of three", () => {
  const r1 = createMockReceipt({ id: "r1", previousReceiptId: undefined });
  const r2 = createMockReceipt({ id: "r2", previousReceiptId: "r1" });
  const r3 = createMockReceipt({ id: "r3", previousReceiptId: "r2" });
  const result = verifyTraceReceiptChain([r1, r2, r3]);
  assert.strictEqual(result.valid, true);
});

test("robustness: invalid null item does not throw", () => {
  const chain = [null as unknown as TraceReceipt];
  const result = verifyTraceReceiptChain(chain);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
  assert.strictEqual(result.errors[0].id, "unknown-0");
});

test("robustness: invalid undefined item does not throw", () => {
  const chain = [undefined as unknown as TraceReceipt];
  const result = verifyTraceReceiptChain(chain);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
  assert.strictEqual(result.errors[0].id, "unknown-0");
});

test("robustness: invalid plain object does not throw", () => {
  const chain = [{ id: "not-a-receipt" } as unknown as TraceReceipt];
  const result = verifyTraceReceiptChain(chain);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
});

test("robustness: missing hashes does not throw", () => {
  const receipt = createMockReceipt();
  // @ts-expect-error
  delete receipt.hashes;
  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
});

test("robustness: hostile accessor input does not execute getter during validation failure", () => {
  let executed = false;
  const hostile = {
    get id() {
      executed = true;
      return "hostile";
    },
    // Missing other required fields to trigger validation failure
  } as unknown as TraceReceipt;

  const result = verifyTraceReceiptChain([hostile]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].id, "unknown-0");
  assert.strictEqual(executed, false);
});

test("robustness: invalid first item followed by valid second item", () => {
  const r1 = { id: "invalid" } as unknown as TraceReceipt;
  const r2 = createMockReceipt({ id: "r2", previousReceiptId: "invalid" });

  const result = verifyTraceReceiptChain([r1, r2]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors.length, 2);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
  assert.strictEqual(result.errors[1].code, "INVALID_PREVIOUS_RECEIPT_ID");
  assert.strictEqual(result.errors[1].message, "A valid immediate predecessor is unavailable");
});

test("robustness: valid first item followed by invalid second item", () => {
  const r1 = createMockReceipt({ id: "r1" });
  const r2 = { id: "invalid" } as unknown as TraceReceipt;
  const r3 = createMockReceipt({ id: "r3", previousReceiptId: "r1" });

  const result = verifyTraceReceiptChain([r1, r2, r3]);
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.index === 1 && e.code === "INVALID_RECEIPT"));
  assert.ok(result.errors.some(e => e.index === 2 && e.code === "INVALID_PREVIOUS_RECEIPT_ID"));
});

test("robustness: later valid receipts are still inspected", () => {
  const r1 = { id: "invalid" } as unknown as TraceReceipt;
  const r2 = createMockReceipt({ id: "r2", previousReceiptId: "any" });
  r2.hashes = []; // Trigger another error

  const result = verifyTraceReceiptChain([r1, r2]);
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.index === 0 && e.code === "INVALID_RECEIPT"));
  assert.ok(result.errors.some(e => e.index === 1 && e.code === "MISSING_SELF_HASH"));
});

test("immutability: input and nested metadata remain unmodified", () => {
  const r1 = createMockReceipt({ id: "r1", metadata: { foo: "bar" } });
  Object.freeze(r1);
  Object.freeze(r1.metadata);

  assert.doesNotThrow(() => verifyTraceReceiptChain([r1]));
});
