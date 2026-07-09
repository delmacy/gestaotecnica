import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { logEventInputSchema, getTimelineForInstanceInputSchema } from "../../src/features/workflow/runtime/events/events.validation";

describe("logEventInputSchema validation", () => {
  it("should validate a valid minimal input and default omitted payload to {}", () => {
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

  it("should validate input with valid optional UUID fields", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "process.started",
      entityType: "process",
      instanceId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      entityId: "123e4567-e89b-12d3-a456-426614174000",
      actorId: "550e8400-e29b-41d4-a716-446655440000"
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, true);
  });

  it("should invalidate input with invalid instance id", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "process.started",
      entityType: "process",
      instanceId: "not-a-uuid",
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("instanceId"));
      assert.ok(issue);
    }
  });

  it("should invalidate input with invalid entity id", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "process.started",
      entityType: "process",
      entityId: "not-a-uuid",
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("entityId"));
      assert.ok(issue);
    }
  });

  it("should invalidate input with invalid actor id", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "process.started",
      entityType: "process",
      actorId: "not-a-uuid",
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes("actorId"));
      assert.ok(issue);
    }
  });

  it("should accept nested unknown values inside object payload", () => {
    const input = {
      workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
      eventType: "process.started",
      entityType: "process",
      payload: {
        someKey: "someValue",
        nested: {
          number: 123,
          boolean: true
        }
      }
    };

    const result = logEventInputSchema.safeParse(input);

    assert.equal(result.success, true);
    if (result.success) {
      assert.deepEqual(result.data.payload, input.payload);
    }
  });

  it("should reject non-object top-level payload", () => {
    const inputs = [
      "string payload",
      123,
      true,
      null,
      []
    ];

    for (const payload of inputs) {
      const input = {
        workspaceId: "b8f59d57-3721-4f18-b2ba-1f6e2b95b871",
        eventType: "process.started",
        entityType: "process",
        payload
      };

      const result = logEventInputSchema.safeParse(input);

      assert.equal(result.success, false, `Expected validation to fail for payload: ${JSON.stringify(payload)}`);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.includes("payload"));
        assert.ok(issue, `Expected validation issue for payload type: ${typeof payload}`);
      }
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
