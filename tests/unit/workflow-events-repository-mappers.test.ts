import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { mapEventRow } from "../../src/features/workflow/runtime/events/events.repository";

describe("Event Repository Mappers", () => {
  describe("mapEventRow", () => {
    it("should map row to EventRecord with camelCase keys", () => {
      const now = new Date();
      const row = {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: { test: true },
        createdAt: now,
        extraColumn: "should_be_ignored"
      };

      const result = mapEventRow(row);
      assert.deepStrictEqual(result, {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: { test: true },
        createdAt: now
      });
    });

    it("should map row to EventRecord with snake_case keys fallback safely", () => {
      const now = new Date();
      const row = {
        id: "evt_123",
        workspace_id: "ws_123",
        instance_id: "pi_123",
        event_type: "step.completed",
        entity_type: "step",
        entity_id: "step_1",
        actor_type: "user",
        actor_id: "user_123",
        source: "system",
        correlation_id: "corr_123",
        causation_id: "caus_123",
        payload: { test: true },
        created_at: now,
        extraColumn: "should_be_ignored"
      };

      const result = mapEventRow(row);
      assert.deepStrictEqual(result, {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: { test: true },
        createdAt: now
      });
    });

    it("should handle null row", () => {
      assert.strictEqual(mapEventRow(null), null);
    });

    it("should handle undefined row", () => {
      assert.strictEqual(mapEventRow(undefined), null);
    });

    it("should map null payload to empty object", () => {
      const now = new Date();
      const row = {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: null,
        createdAt: now
      };

      const result = mapEventRow(row);
      assert.deepStrictEqual(result, {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: {},
        createdAt: now
      });
    });

    it("should map undefined payload to empty object", () => {
      const now = new Date();
      const row = {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: undefined,
        createdAt: now
      };

      const result = mapEventRow(row);
      assert.deepStrictEqual(result, {
        id: "evt_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        eventType: "step.completed",
        entityType: "step",
        entityId: "step_1",
        actorType: "user",
        actorId: "user_123",
        source: "system",
        correlationId: "corr_123",
        causationId: "caus_123",
        payload: {},
        createdAt: now
      });
    });
  });
});
