import { describe, it } from "node:test";
import assert from "node:assert";
import { resolveRuntimeEvidenceHandoff } from "@/platform/runtime/contracts/evidence-handoff/resolve-evidence-handoff";

describe("Runtime Evidence Handoff Resolver", () => {
  it("should return empty state when required information missing", async () => {
    const result = await resolveRuntimeEvidenceHandoff({
      processId: "",
      executionPayload: {},
      timestamp: ""
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, "empty");
  });

  it("should return blocked state when user role is blocked", async () => {
    const result = await resolveRuntimeEvidenceHandoff({
      processId: "test",
      executionPayload: { a: 1 },
      timestamp: "2023"
    }, "blocked");

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, "blocked");
  });

  it("should return blocked state when environment is restricted", async () => {
    const result = await resolveRuntimeEvidenceHandoff({
      processId: "test",
      executionPayload: { a: 1 },
      timestamp: "2023"
    }, "runtime_user", "prod-restricted");

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.status, "blocked");
  });

  it("should return demo state when environment is demo", async () => {
    const result = await resolveRuntimeEvidenceHandoff({
      processId: "test",
      executionPayload: { a: 1 },
      timestamp: "2023"
    }, "runtime_user", "demo");

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, "demo");
    assert.ok(result.receiptUrl?.includes("/demo_"));
  });

  it("should return synthetic state when environment is synthetic", async () => {
    const result = await resolveRuntimeEvidenceHandoff({
      processId: "test",
      executionPayload: { a: 1 },
      timestamp: "2023"
    }, "runtime_user", "synthetic");

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, "synthetic");
    assert.ok(result.receiptUrl?.includes("/synth_"));
  });

  it("should return success for valid live request", async () => {
    const result = await resolveRuntimeEvidenceHandoff({
      processId: "test",
      executionPayload: { a: 1 },
      timestamp: "2023"
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, "success");
    assert.ok(result.evidenceId?.startsWith("live_"));
  });
});
