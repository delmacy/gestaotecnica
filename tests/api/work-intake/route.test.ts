import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import Module from "node:module";

const originalRequire = Module.prototype.require;

describe("Work Intake API Routes", () => {
  let actionsMock: unknown;
  let workspaceMock: unknown;

  beforeEach(() => {
    actionsMock = {
      runAction: async (action: string, input: Record<string, unknown>) => {
        if (action === "work_intake.capture") {
          return { success: true, data: { id: "test-id" } };
        }
        if (action === "work_intake.transition") {
          return { success: true, data: { id: "test-id", status: input.status } };
        }
        return { success: false, error: { message: "Unknown action" } };
      }
    };

    workspaceMock = {
      resolveWorkspaceContext: async () => ({ workspaceId: "ws-1" })
    };

    Module.prototype.require = function (id: string) {
      if (id === "@/platform/actions") {
        return actionsMock;
      }
      if (id === "@/platform/workspace") {
        return workspaceMock;
      }
      if (id === "@/modules/work-intake/queries") {
        return {
          getIntakeRequests: async () => [],
          getIntakeRequestById: async () => ({ id: "test-id" }),
          getIntakeHistory: async () => []
        };
      }
      if (id === "next/server") {
        return {
          NextResponse: {
            json: (body: unknown, init?: { status?: number }) => ({
              status: init?.status || 200,
              json: async () => body
            })
          }
        };
      }
      // @ts-ignore
      return originalRequire.apply(this, arguments);
    };
  });

  afterEach(() => {
    Module.prototype.require = originalRequire;
  });

  it("POST /api/work-intake should capture valid request", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { POST } = require("../../../src/app/api/work-intake/route");

    const req = {
      text: async () => JSON.stringify({ title: "Test" }),
    };

    const res = await POST(req);
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.id, "test-id");
  });

  it("POST /api/work-intake should reject invalid JSON", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { POST } = require("../../../src/app/api/work-intake/route");

    const req = {
      text: async () => "{ invalid json ",
    };

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.message, "Invalid JSON body");
  });

  it("PATCH /api/work-intake/[id] should transition request", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PATCH } = require("../../../src/app/api/work-intake/[id]/route");

    const req = {
      text: async () => JSON.stringify({ status: "qualified" }),
    };

    const params = Promise.resolve({ id: "test-id" });

    const res = await PATCH(req, { params });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.status, "qualified");
  });

  it("PATCH /api/work-intake/[id] should reject invalid JSON", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PATCH } = require("../../../src/app/api/work-intake/[id]/route");

    const req = {
      text: async () => "{ invalid json ",
    };

    const params = Promise.resolve({ id: "test-id" });

    const res = await PATCH(req, { params });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.message, "Invalid JSON body");
  });
});
