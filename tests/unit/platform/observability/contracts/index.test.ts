import { describe, it } from "node:test";
import * as assert from "node:assert/strict";

describe("Timeline contracts boundary", () => {
  it("exports TimelineItemSchema", async () => {
    const contracts = await import("@/platform/index");
    assert.ok(contracts.TimelineItemSchema !== undefined);
  });
});
