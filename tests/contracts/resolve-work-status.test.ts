import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveWorkStatus } from "../../src/platform/builder/contracts/work-status/resolve-work-status";
import { WorkspaceContext } from "../../src/platform/workspace/workspace-context";
import { OriginContext } from "../../src/platform/builder/contracts/origin-context/origin-context-contract";

/*
 * Real-data journey validation: Form submit creates and returns work status
 *
 * Through-line documented:
 * - Route/screen affected: POST /api/builder/work-status -> resolves to
 *   destination path (e.g. /work-intake/<id>, /work-items/<id>)
 * - Persistence path: workId originates from DB insert (processCandidates or
 *   work_items), then resolveWorkStatus maps it to the detail route.
 * - States tested: real, demo, synthetic, blocked, empty — each produces
 *   a distinct destination, status, and user-facing message.
 * - User journey: fills form -> submit -> server action persists -> client
 *   calls POST /api/builder/work-status -> navigates to destination.
 * - Return: user can navigate back via returnPath (e.g. /builder/work-intake).
 */

function makeWorkspaceContext(overrides?: Partial<WorkspaceContext>): WorkspaceContext {
  return {
    workspaceId: "ws-real-001",
    workspaceKey: "ws-real-001",
    actor: { type: "user", id: "u-test" },
    source: "ui",
    correlationId: "c-test",
    enabledModules: ["work-intake", "work-items"],
    scopes: ["builder"],
    environmentMode: "real",
    ...overrides,
  };
}

function makeOriginContext(overrides?: Partial<OriginContext>): OriginContext {
  return {
    originPath: "/builder/work-intake",
    returnPath: "/builder/work-intake",
    returnLabel: "Return to Work Intake",
    isBlocked: false,
    isDemo: false,
    isSynthetic: false,
    isValidScope: true,
    ...overrides,
  };
}

describe("resolveWorkStatus — real-data journey validation", () => {
  it("real state: form submit with persisted workId returns detail destination", () => {
    const result = resolveWorkStatus({
      workId: "pc-xyz-789",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext(),
    });

    assert.equal(result.destination, "/work-intake/pc-xyz-789");
    assert.equal(result.status, "real");
    assert.equal(result.message, "Work created successfully.");
  });

  it("real state with work-items module routes to work-items detail", () => {
    const result = resolveWorkStatus({
      workId: "wi-abc-456",
      moduleKey: "work-items",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext(),
    });

    assert.equal(result.destination, "/work-items/wi-abc-456");
    assert.equal(result.status, "real");
  });

  it("demo state: environmentMode demo returns demo status with local-only message", () => {
    const result = resolveWorkStatus({
      workId: "pc-demo-001",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext({ environmentMode: "demo" }),
      originContext: makeOriginContext(),
    });

    assert.equal(result.destination, "/work-intake/pc-demo-001");
    assert.equal(result.status, "demo");
    assert.equal(result.message, "Demo mode: Work created locally.");
  });

  it("synthetic state: environmentMode synthetic returns synthetic status", () => {
    const result = resolveWorkStatus({
      workId: "pc-synth-002",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext({ environmentMode: "synthetic" }),
      originContext: makeOriginContext(),
    });

    assert.equal(result.destination, "/work-intake/pc-synth-002");
    assert.equal(result.status, "synthetic");
    assert.equal(result.message, "Work created successfully.");
  });

  it("blocked state: returns blocked status with fallback to returnPath", () => {
    const result = resolveWorkStatus({
      workId: "pc-blocked-003",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext({ isBlocked: true }),
    });

    assert.equal(result.destination, "/builder/work-intake");
    assert.equal(result.status, "blocked");
    assert.ok(result.message?.includes("Access Restricted"));
  });

  it("blocked state with custom returnPath routes to custom destination", () => {
    const result = resolveWorkStatus({
      workId: "pc-blocked-004",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext({
        isBlocked: true,
        returnPath: "/builder/dashboard",
      }),
    });

    assert.equal(result.destination, "/builder/dashboard");
    assert.equal(result.status, "blocked");
  });

  it("empty state: isWorkEmpty returns empty status with returnPath fallback", () => {
    const result = resolveWorkStatus({
      workId: "pc-empty-005",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext(),
      isWorkEmpty: true,
    });

    assert.equal(result.destination, "/builder/work-intake");
    assert.equal(result.status, "empty");
    assert.equal(result.message, "No data was created. Please try again.");
  });

  it("empty state: undefined workId returns empty status", () => {
    const result = resolveWorkStatus({
      workId: undefined,
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext(),
    });

    assert.equal(result.destination, "/builder/work-intake");
    assert.equal(result.status, "empty");
  });

  it("empty state with no returnPath uses /builder/<moduleKey> fallback", () => {
    const result = resolveWorkStatus({
      workId: undefined,
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext({ returnPath: null }),
    });

    assert.equal(result.destination, "/builder/work-intake");
    assert.equal(result.status, "empty");
  });

  it("blocked state takes precedence over demo mode", () => {
    const result = resolveWorkStatus({
      workId: "pc-blocked-demo-006",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext({ environmentMode: "demo" }),
      originContext: makeOriginContext({ isBlocked: true }),
    });

    assert.equal(result.status, "blocked");
    assert.ok(result.message?.includes("Access Restricted"));
  });

  it("blocked state takes precedence over empty state", () => {
    const result = resolveWorkStatus({
      workId: "pc-blocked-empty-007",
      moduleKey: "work-intake",
      workspaceContext: makeWorkspaceContext(),
      originContext: makeOriginContext({ isBlocked: true }),
      isWorkEmpty: true,
    });

    assert.equal(result.status, "blocked");
  });
});
