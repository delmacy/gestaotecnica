import { test, describe } from "node:test";
import assert from "node:assert";
import { resolveJourneyLogic } from "@/platform/builder/contracts/journey-logic/resolve-journey-logic";
import { WorkspaceContext } from "@/platform/workspace/workspace-context";

describe("Journey Logic Regression Gate", () => {
  const getContext = (mode: "real" | "demo" | "synthetic"): WorkspaceContext => ({
    workspaceId: "w-demo",
    workspaceKey: "demo",
    actor: { type: "user" },
    source: "ui",
    enabledModules: [],
    scopes: [],
    correlationId: "journey-logic",
    environmentMode: mode
  });

  test("START action initializes journey and returns correct step 1 destination", () => {
    const result = resolveJourneyLogic({
      action: "START",
      journeyId: "j-123",
      moduleKey: "setup",
      workspaceContext: getContext("real"),
      originContext: { isBlocked: false, returnPath: null, returnLabel: null }
    });

    assert.strictEqual(result.destination, "/builder/setup/journey/j-123/step/1");
    assert.strictEqual(result.label, "Starting setup");
    assert.strictEqual(result.status, "real");
    assert.strictEqual(result.commitState, false);
  });

  test("NEXT_STEP increments current step if nextStepId is omitted", () => {
    const result = resolveJourneyLogic({
      action: "NEXT_STEP",
      journeyId: "j-123",
      currentStepId: "1",
      moduleKey: "setup",
      workspaceContext: getContext("real"),
      originContext: { isBlocked: false, returnPath: null, returnLabel: null }
    });

    assert.strictEqual(result.destination, "/builder/setup/journey/j-123/step/2");
    assert.strictEqual(result.label, "Continuing your setup");
    assert.strictEqual(result.commitState, true);
  });

  test("SAVE_DRAFT commits state and returns to safe origin", () => {
    const result = resolveJourneyLogic({
      action: "SAVE_DRAFT",
      journeyId: "j-123",
      moduleKey: "setup",
      workspaceContext: getContext("real"),
      originContext: { isBlocked: false, returnPath: "/builder/dashboard", returnLabel: "Dashboard" }
    });

    assert.strictEqual(result.destination, "/builder/dashboard");
    assert.strictEqual(result.label, "Saving progress");
    assert.strictEqual(result.commitState, true);
    assert.strictEqual(result.message, "Draft saved successfully. You can return to finish later.");
  });

  test("COMPLETE commits and clears state, routes to detail view", () => {
    const result = resolveJourneyLogic({
      action: "COMPLETE",
      journeyId: "j-123",
      moduleKey: "setup",
      workspaceContext: getContext("real"),
      originContext: { isBlocked: false, returnPath: null, returnLabel: null }
    });

    assert.strictEqual(result.destination, "/builder/setup/detail/j-123");
    assert.strictEqual(result.label, "Setup completed");
    assert.strictEqual(result.commitState, true);
    assert.strictEqual(result.clearState, true);
  });

  test("Blocked origin overrides action", () => {
    const result = resolveJourneyLogic({
      action: "START",
      journeyId: "j-123",
      moduleKey: "setup",
      workspaceContext: getContext("real"),
      originContext: { isBlocked: true, returnPath: "/builder/settings", returnLabel: null }
    });

    assert.strictEqual(result.destination, "/builder/settings");
    assert.strictEqual(result.status, "blocked");
    assert.strictEqual(result.commitState, false);
    assert.strictEqual(result.clearState, true);
  });

  test("Demo state uses correct status and messages", () => {
    const result = resolveJourneyLogic({
      action: "COMPLETE",
      journeyId: "j-123",
      moduleKey: "setup",
      workspaceContext: getContext("demo"),
      originContext: { isBlocked: false, returnPath: null, returnLabel: null }
    });

    assert.strictEqual(result.status, "demo");
    assert.strictEqual(result.message, "Demo mode: Setup complete simulation.");
  });
});
