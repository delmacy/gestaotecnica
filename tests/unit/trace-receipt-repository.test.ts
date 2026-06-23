import assert from "node:assert";
import { describe, it } from "node:test";
import { v4 as uuidv4 } from "uuid";
import { drizzleTraceReceiptRepository } from "../../src/features/platform/gateway/trace-receipt/trace-receipt.repository";

describe("TraceReceiptRepositoryPort", () => {
  it("should have correct method signatures for append, findById and findByCorrelationId", () => {
    assert.strictEqual(typeof drizzleTraceReceiptRepository.append, "function");
    assert.strictEqual(typeof drizzleTraceReceiptRepository.findById, "function");
    assert.strictEqual(typeof drizzleTraceReceiptRepository.findByCorrelationId, "function");
  });
});
