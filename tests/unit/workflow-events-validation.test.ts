import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { logEventInputSchema, getTimelineForInstanceInputSchema } from "../../src/features/workflow/runtime/events/events.validation";

describe("logEventInputSchema validation", () => {
  it("should validate a valid minimal input and default payload to {}", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "process.started",
      entityType: "process",
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, true);
    if (result.success) {
      assert.deepEqual(result.data.payload, {});
    }
  });

  it("should invalidate input with invalid workspace id", () => {
    const input = {
      workspaceId: "not-a-uuid",
      eventType: "process.started",
      entityType: "process",
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("workspaceId"));
      assert.ok(issue);
    }
  });

  it("should invalidate input with invalid event type", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "invalid.event",
      entityType: "process",
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("eventType"));
      assert.ok(issue);
    }
  });
});

describe("getTimelineForInstanceInputSchema validation", () => {
  it("should validate valid UUIDs", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      instanceId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    };

    const result = getTimelineForInstanceInputSchema.safeParse(input);

    assert.equal(result.success, true);
  });

  it("should invalidate input with invalid workspace id", () => {
    const input = {
      workspaceId: "not-a-uuid",
      instanceId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    };

    const result = getTimelineForInstanceInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("workspaceId"));
      assert.ok(issue);
    }
  });

  it("should invalidate input with invalid instance id", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      instanceId: "not-a-uuid",
    };

    const result = getTimelineForInstanceInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("instanceId"));
      assert.ok(issue);
    }
  });
});
