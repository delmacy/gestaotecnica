import assert from "node:assert";
import { describe, it } from "node:test";
import { TraceReceiptService } from "../../src/features/platform/gateway/trace-receipt/trace-receipt.service";
import type { TraceReceiptRepositoryPort } from "../../src/features/platform/gateway/trace-receipt/trace-receipt.repository";
import type { DbClient } from "../../src/db";
import { v4 as uuidv4 } from "uuid";

describe("TraceReceiptService", () => {
  it("should create and append a valid receipt", async () => {
    let appendedReceipt: any = null;
    const mockRepo: TraceReceiptRepositoryPort = {
      append: async (db, receipt) => { appendedReceipt = receipt; },
      findById: async () => null,
      findByCorrelationId: async () => [],
    };
    const service = new TraceReceiptService(mockRepo);

    const input = {
      workspaceId: uuidv4(),
      subject: { type: "process" as const, id: uuidv4() },
      actor: { type: "user" as const, id: uuidv4() },
      action: { type: "publish", name: "Publish", result: "success" as const },
      source: { system: "test", version: "1" },
    };

    const receipt = await service.createAndAppendReceipt({} as DbClient, input);

    assert.ok(receipt.id);
    assert.strictEqual(receipt.workspaceId, input.workspaceId);
    assert.strictEqual(receipt.subject.id, input.subject.id);
    assert.strictEqual(receipt.hashes.length, 1);
    assert.strictEqual(receipt.hashes[0].scope, "payload");

    assert.deepStrictEqual(appendedReceipt, receipt);
  });
});
