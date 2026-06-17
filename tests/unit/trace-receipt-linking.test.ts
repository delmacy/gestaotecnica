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

test("robustness: invalid null item does not throw", () => {
  const chain = [null as unknown as TraceReceipt];
  const result = verifyTraceReceiptChain(chain);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
});

test("robustness: hostile accessor input does not execute getter", () => {
  let executed = false;
  const hostile = {
    get id() {
      executed = true;
      return "hostile";
    }
  } as unknown as TraceReceipt;

  const result = verifyTraceReceiptChain([hostile]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(executed, false);
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

test("robustness: nested getter in source.metadata is not executed", () => {
  let executed = false;
  const receipt = createMockReceipt();
  receipt.source.metadata = {};
  Object.defineProperty(receipt.source.metadata, "foo", {
    get() {
      executed = true;
      return "bar";
    },
    enumerable: true
  });

  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(executed, false);
});

test("robustness: getter in artifacts item is not executed", () => {
  let executed = false;
  const receipt = createMockReceipt();
  const item = { id: "art-1", name: "art", mediaType: "text/plain", uri: "file:///tmp", size: 10 };
  Object.defineProperty(item, "id", {
    get() {
      executed = true;
      return "hostile";
    },
    enumerable: true
  });
  // @ts-expect-error
  receipt.artifacts.push(item);

  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(executed, false);
});

test("robustness: getter in hashes item is not executed", () => {
  let executed = false;
  const receipt = createMockReceipt();
  const item = { algorithm: "sha256", scope: "receipt", value: "a".repeat(64) };
  Object.defineProperty(item, "value", {
    get() {
      executed = true;
      return "hostile";
    },
    enumerable: true
  });
  // @ts-expect-error
  receipt.hashes.push(item);

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

test("robustness: revoked proxy at root fails safely", () => {
  const { proxy, revoke } = Proxy.revocable({}, {});
  revoke();

  const result = verifyTraceReceiptChain([proxy as unknown as TraceReceipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
});

test("robustness: revoked proxy nested fails safely", () => {
  const { proxy, revoke } = Proxy.revocable({}, {});
  revoke();
  const receipt = createMockReceipt();
  receipt.metadata = { hostile: proxy };

  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
});

test("robustness: array holes are handled", () => {
  const receipt = createMockReceipt();
  // @ts-expect-error
  receipt.artifacts = [undefined, { id: "art-1", name: "art", mediaType: "text/plain", uri: "file:///tmp", size: 10 }];

  const result = verifyTraceReceiptChain([receipt]);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors[0].code, "INVALID_RECEIPT");
});

test("immutability: input and nested metadata remain unmodified", () => {
  const r1 = createMockReceipt({ id: "r1", metadata: { foo: "bar" } });
  Object.freeze(r1);
  Object.freeze(r1.metadata);

  assert.doesNotThrow(() => verifyTraceReceiptChain([r1]));
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
