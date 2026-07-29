import test from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";

let resolveWorkspaceContextCalled = false;
let resolveWorkStatusCalled = false;
let passedWorkspaceContext: unknown = null;
let passedOriginContext: unknown = null;

const routeModule = proxyquire("../../../../src/app/api/builder/work-status/route", {
  "next/server": {
    NextResponse: {
      json: (data: unknown, options?: { status: number }) => ({ data, options: options || { status: 200 } }),
    },
  },
  "@/platform/workspace": {
    resolveWorkspaceContext: async () => {
      resolveWorkspaceContextCalled = true;
      return {
        workspaceId: "w-test",
        workspaceKey: "test",
        actor: { type: "user", id: "u-test" },
        source: "integration",
        enabledModules: [],
        scopes: [],
        correlationId: "test-correlation",
        environmentMode: "real"
      };
    },
  },
  "@/platform/events/event-log-service": {
    emitEvent: async (input: unknown) => {
      return { ...(input as object), id: "mock-event-id", correlationId: "mock-correlation" };
    },
    createReceipt: () => {
      return { eventId: "mock-event-id", processedAt: "2023-10-10T00:00:00Z", status: "success" };
    }
  },
  "@/platform/builder/contracts/work-status/resolve-work-status": {
    resolveWorkStatus: (args: Record<string, unknown>) => {
      resolveWorkStatusCalled = true;
      passedWorkspaceContext = args.workspaceContext;
      passedOriginContext = args.originContext;
      return {
        destination: "/test-dest",
        status: args.workspaceContext && (args.workspaceContext as Record<string,unknown>).environmentMode === "demo" ? "demo" : "real",
        message: "Test message"
      };
    }
  }
});

const POST = routeModule.POST;

test("Work Status API Route - POST", async (t) => {
  t.beforeEach(() => {
    resolveWorkspaceContextCalled = false;
    resolveWorkStatusCalled = false;
    passedWorkspaceContext = null;
    passedOriginContext = null;
  });

  await t.test("Validates demo environment mode from headers", async () => {
    const req = new Request("http://localhost/api/builder/work-status", {
      method: "POST",
      headers: new Headers({
        "x-environment-mode": "demo",
        "x-is-blocked": "false"
      }),
      body: JSON.stringify({ moduleKey: "test-module" })
    });

    const response = await POST(req) as { data: { status: string }, options: { status: number } };

    assert.ok(resolveWorkspaceContextCalled);
    assert.ok(resolveWorkStatusCalled);

    const data = response.data as Record<string, unknown>;
    assert.equal(data.status, "demo");
    const receipt = data.receipt as Record<string, unknown>;
    assert.equal(receipt.eventId, "mock-event-id");
    assert.equal(receipt.status, "success");
    assert.equal((passedWorkspaceContext as Record<string,unknown>).environmentMode, "demo");
    assert.equal((passedOriginContext as Record<string,unknown>).isDemo, true);
    assert.equal((passedOriginContext as Record<string,unknown>).isSynthetic, false);
    assert.equal((passedOriginContext as Record<string,unknown>).isBlocked, false);
  });

  await t.test("Validates synthetic environment mode from headers", async () => {
    const req = new Request("http://localhost/api/builder/work-status", {
      method: "POST",
      headers: new Headers({
        "x-environment-mode": "synthetic",
        "x-is-blocked": "false"
      }),
      body: JSON.stringify({ moduleKey: "test-module" })
    });

    await POST(req);

    assert.equal((passedWorkspaceContext as Record<string,unknown>).environmentMode, "synthetic");
    assert.equal((passedOriginContext as Record<string,unknown>).isDemo, false);
    assert.equal((passedOriginContext as Record<string,unknown>).isSynthetic, true);
  });

  await t.test("Validates blocked state from headers", async () => {
    const req = new Request("http://localhost/api/builder/work-status", {
      method: "POST",
      headers: new Headers({
        "x-environment-mode": "real",
        "x-is-blocked": "true"
      }),
      body: JSON.stringify({ moduleKey: "test-module" })
    });

    await POST(req);

    assert.equal((passedOriginContext as Record<string,unknown>).isBlocked, true);
  });

  await t.test("Returns 400 for missing moduleKey", async () => {
    const req = new Request("http://localhost/api/builder/work-status", {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify({ workId: "test-work" })
    });

    const response = await POST(req) as { data: { error: string }, options: { status: number } };

    assert.equal(response.options.status, 400);
    assert.equal(response.data.error, "Missing required fields: moduleKey");
    assert.equal(resolveWorkStatusCalled, false);
  });

  await t.test("Returns 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/builder/work-status", {
      method: "POST",
      headers: new Headers(),
      body: "invalid json"
    });

    const response = await POST(req) as { data: { error: string }, options: { status: number } };

    assert.equal(response.options.status, 400);
    assert.equal(response.data.error, "Invalid JSON body");
    assert.equal(resolveWorkStatusCalled, false);
  });
});
