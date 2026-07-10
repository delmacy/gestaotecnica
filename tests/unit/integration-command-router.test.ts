import { describe, it, mock } from "node:test";
import * as assert from "node:assert/strict";
import proxyquire from "proxyquire";
import { IntegrationCommandResponse } from "../../src/platform/integrations/integration-command-types";

describe("IntegrationCommandResponse Type Validation", () => {
  it("should allow a valid success response", () => {
    const response: IntegrationCommandResponse = {
      success: true,
      data: { result: "ok" },
      correlationId: "abc-123",
    };
    assert.equal(response.success, true);
    assert.equal(response.correlationId, "abc-123");
  });

  it("should allow a valid error response", () => {
    const response: IntegrationCommandResponse = {
      success: false,
      error: { code: "ERR_1", message: "Error occurred" },
      correlationId: "def-456",
    };
    assert.equal(response.success, false);
    if (!response.success) {
      assert.equal(response.error.code, "ERR_1");
    }
  });

  it("should flag success response with error as invalid type", () => {
    // @ts-expect-error - A successful response should not have an error
    const response: IntegrationCommandResponse = {
      success: true,
      error: { code: "ERR_2", message: "Should not exist" },
      correlationId: "ghi-789",
    };
    assert.ok(response);
  });

  it("should flag error response without error object as invalid type", () => {
    // @ts-expect-error - An error response must include the error object
    const response: IntegrationCommandResponse = {
      success: false,
      correlationId: "jkl-012",
    };
    assert.ok(response);
  });
});

describe("routeIntegrationCommand()", () => {
  it("should handle unknown/invalid command gracefully", async () => {
    const dbMock = {
      insert: mock.fn(() => ({
        values: mock.fn(() => ({
          returning: mock.fn(async () => [{ id: "mock-id" }])
        }))
      })),
      update: mock.fn(() => ({
        set: mock.fn(() => ({
          where: mock.fn(async () => [])
        }))
      })),
      select: mock.fn(() => ({
        from: mock.fn(() => ({
          where: mock.fn(() => ({
            limit: mock.fn(async () => [])
          }))
        }))
      }))
    };

    const router = proxyquire("../../src/platform/integrations/integration-command-router", {
      "@/db": { getDb: () => dbMock },
      "@/platform/workspace": {
        resolveWorkspaceContext: async () => ({
          workspaceId: "00000000-0000-0000-0000-000000000000",
          workspaceKey: "ws-key",
          source: "integration",
          actor: { type: "api_key", id: "gateway-api-key", name: "Integration Gateway" },
          scopes: ["*"],
          correlationId: "mock-correlation-id",
        })
      },
      "@/platform/actions": {
        runAction: async () => ({
          success: false,
          error: { code: "ACTION_NOT_FOUND", message: "Action nao encontrada: unknown.command" }
        })
      },
      "@/db/schema": {
        integrationCommands: {
          id: "id",
          status: "status",
          responsePayload: "responsePayload",
          errorPayload: "errorPayload",
          correlationId: "correlationId",
          workspaceKey: "workspaceKey",
          idempotencyKey: "idempotencyKey",
        }
      },
      "drizzle-orm": {
        and: () => {},
        eq: () => {}
      }
    });

    const response = await router.routeIntegrationCommand({
      command: "unknown.command"
    });

    assert.equal(response.success, false);
    if (!response.success) {
      assert.equal(response.error.code, "ACTION_NOT_FOUND");
      assert.equal(response.error.message, "Action nao encontrada: unknown.command");
    }
    assert.equal(response.correlationId, "mock-correlation-id");
  });
});
