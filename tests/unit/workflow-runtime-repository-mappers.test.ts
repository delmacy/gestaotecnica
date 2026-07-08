import { describe, it } from "node:test";
import * as assert from "node:assert";
import {
  mapProcessInstanceRow,
  mapProcessPayloadRow,
  mapActionExecutionRow
} from "@/features/workflow/runtime/runtime.repository";

describe("Runtime Repository Row Mappers", () => {
  describe("mapProcessInstanceRow", () => {
    it("should map row to ProcessInstanceRecord", () => {
      const now = new Date();
      const row = {
        id: "pi_123",
        workspaceId: "ws_123",
        processVersionId: "pv_123",
        currentStateId: "cs_123",
        status: "active",
        createdById: "user_123",
        createdAt: now,
        updatedAt: now,
        extraColumn: "should_be_ignored"
      };

      const result = mapProcessInstanceRow(row);
      assert.deepStrictEqual(result, {
        id: "pi_123",
        workspaceId: "ws_123",
        processVersionId: "pv_123",
        currentStateId: "cs_123",
        status: "active",
        createdById: "user_123",
        createdAt: now,
        updatedAt: now
      });
    });

    it("should handle null row", () => {
      assert.strictEqual(mapProcessInstanceRow(null), null);
    });
  });

  describe("mapProcessPayloadRow", () => {
    it("should map row with schema_version to schemaVersion", () => {
      const now = new Date();
      const row = {
        id: "pp_123",
        instanceId: "pi_123",
        workspaceId: "ws_123",
        schema_version: "1.0",
        data: { test: true },
        createdAt: now,
        updatedAt: now,
        extraColumn: "should_be_ignored"
      };

      const result = mapProcessPayloadRow(row);
      assert.deepStrictEqual(result, {
        id: "pp_123",
        instanceId: "pi_123",
        workspaceId: "ws_123",
        schemaVersion: "1.0",
        data: { test: true },
        createdAt: now,
        updatedAt: now
      });
    });

    it("should map row with schemaVersion to schemaVersion", () => {
      const now = new Date();
      const row = {
        id: "pp_123",
        instanceId: "pi_123",
        workspaceId: "ws_123",
        schemaVersion: "1.0",
        data: { test: true },
        createdAt: now,
        updatedAt: now
      };

      const result = mapProcessPayloadRow(row);
      assert.deepStrictEqual(result, {
        id: "pp_123",
        instanceId: "pi_123",
        workspaceId: "ws_123",
        schemaVersion: "1.0",
        data: { test: true },
        createdAt: now,
        updatedAt: now
      });
    });

    it("should handle null row", () => {
      assert.strictEqual(mapProcessPayloadRow(null), null);
    });
  });

  describe("mapActionExecutionRow", () => {
    it("should map row to ActionExecutionRecord", () => {
      const start = new Date();
      const finish = new Date();
      const row = {
        id: "ae_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        actionKey: "step_1",
        actorId: "user_123",
        inputPayload: { a: 1 },
        outputPayload: { b: 2 },
        status: "completed",
        error: null,
        startedAt: start,
        finishedAt: finish,
        extraColumn: "should_be_ignored"
      };

      const result = mapActionExecutionRow(row);
      assert.deepStrictEqual(result, {
        id: "ae_123",
        workspaceId: "ws_123",
        instanceId: "pi_123",
        actionKey: "step_1",
        actorId: "user_123",
        inputPayload: { a: 1 },
        outputPayload: { b: 2 },
        status: "completed",
        error: null,
        startedAt: start,
        finishedAt: finish
      });
    });

    it("should handle null row", () => {
      assert.strictEqual(mapActionExecutionRow(null), null);
    });
  });
});
