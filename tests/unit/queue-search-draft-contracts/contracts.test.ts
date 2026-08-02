import { describe, it } from "node:test";
import assert from "node:assert";
import { GlobalSearchDTOSchema } from "@/modules/global-search/contracts";
import { DraftRecoveryResponseSchema } from "@/modules/operator-loop/contracts";

describe("Queue, Search, Draft Contracts", () => {
  it("should validate a real search result", () => {
    const payload = {
      state: "real",
      data: {
        workItems: [{ id: "123e4567-e89b-12d3-a456-426614174000", title: "Test", type: "workItem", url: "/work-items/1" }],
        serviceOrders: [],
        assets: [],
        technicians: []
      }
    };
    const result = GlobalSearchDTOSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  it("should validate an empty search result", () => {
    const payload = { state: "empty", message: "No results" };
    const result = GlobalSearchDTOSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });

  it("should validate a real draft recovery", () => {
    const payload = {
      state: "real",
      drafts: [{ id: "123e4567-e89b-12d3-a456-426614174000", entityType: "workItem", title: "Draft", updatedAt: new Date(), recoveryUrl: "/draft/1" }]
    };
    const result = DraftRecoveryResponseSchema.safeParse(payload);
    assert.strictEqual(result.success, true);
  });
});
