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
    receipt.hashes = [selfHash];
  }

  return receipt;
}

test("findTraceReceiptSelfHash: finds single receipt hash", () => {
  const receipt = createMockReceipt();
  const found = findTraceReceiptSelfHash(receipt);
  assert.ok(found);
  assert.strictEqual(found?.scope, "receipt");
});

test("verifyTraceReceiptSelfHash: validates sha256 self-hash", () => {
  const receipt = createMockReceipt();
  assert.strictEqual(verifyTraceReceiptSelfHash(receipt), true);
});

test("verifyTraceReceiptLink: valid direct link", () => {
  const previous = createMockReceipt({ id: "prev-1" });
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "prev-1",
  });
  assert.strictEqual(verifyTraceReceiptLink(previous, current), true);
});

test("verifyTraceReceiptLink robustness: getter on previous.id is not executed", () => {
  let executed = false;
  const previous = createMockReceipt({ id: "prev-1" });
  Object.defineProperty(previous, "id", {
    get() {
      executed = true;
      return "hostile";
    },
    enumerable: true
  });
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "prev-1",
  });

  const result = verifyTraceReceiptLink(previous, current);
  assert.strictEqual(result, false);
  assert.strictEqual(executed, false);
});

test("verifyTraceReceiptLink robustness: getter on current.previousReceiptId is not executed", () => {
  let executed = false;
  const previous = createMockReceipt({ id: "prev-1" });
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "prev-1",
  });
  Object.defineProperty(current, "previousReceiptId", {
    get() {
      executed = true;
      return "hostile";
    },
    enumerable: true
  });

  const result = verifyTraceReceiptLink(previous, current);
  assert.strictEqual(result, false);
  assert.strictEqual(executed, false);
});

test("verifyTraceReceiptLink robustness: revoked proxy as previous fails safely", () => {
  const { proxy, revoke } = Proxy.revocable(createMockReceipt({ id: "prev-1" }), {});
  revoke();
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "prev-1",
  });

  const result = verifyTraceReceiptLink(proxy as unknown as TraceReceipt, current);
  assert.strictEqual(result, false);
});

test("verifyTraceReceiptLink robustness: schema-invalid current returns false", () => {
  const previous = createMockReceipt({ id: "prev-1" });
  const current = createMockReceipt({
    id: "curr-2",
    previousReceiptId: "prev-1",
  });
  // @ts-expect-error
  delete current.actor;

  const result = verifyTraceReceiptLink(previous, current);
  assert.strictEqual(result, false);
});

test("robustness: nested getter in actor is not executed", () => {
  let executed = false;
  const receipt = createMockReceipt();
  Object.defineProperty(receipt.actor, "id", {
    get() {
      executed = true;
      return "hostile";
    },
    enumerable: true
  });

  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(executed, false);
});

test("robustness: cyclic metadata fails safely", () => {
  const receipt = createMockReceipt();
  const meta: Record<string, unknown> = { foo: "bar" };
  meta.self = meta;
  receipt.metadata = meta;

  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].message, "Receipt contains hostile or cyclic structure");
});

test("verifyTraceReceiptChain: valid chain of three", () => {
  const r1 = createMockReceipt({ id: "r1", previousReceiptId: undefined });
  const r2 = createMockReceipt({ id: "r2", previousReceiptId: "r1" });
  const r3 = createMockReceipt({ id: "r3", previousReceiptId: "r2" });
  const result = verifyTraceReceiptChain([r1, r2, r3]);
  assert.strictEqual(result.valid, true);
});

test("robustness: invalid first item followed by valid second item", () => {
  const r1 = { id: "invalid" } as unknown as TraceReceipt;
  const r2 = createMockReceipt({ id: "r2", previousReceiptId: "invalid" });

  const result = verifyTraceReceiptChain([r1, r2]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors.length, 2);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
  assert.strictEqual(result.errors[1].code, "INVALID_PREVIOUS_RECEIPT_ID");
});

test("immutability: input and nested metadata remain unmodified", () => {
  const r1 = createMockReceipt({ id: "r1", metadata: { foo: "bar" } });
  Object.freeze(r1);
  Object.freeze(r1.metadata);

  assert.doesNotThrow(() => verifyTraceReceiptChain([r1]));
});
