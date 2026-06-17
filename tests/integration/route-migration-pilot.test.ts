import test from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";
import { NextResponse } from "next/server";

// Mocking dependencies for the routes
const mockGatewayModules = [{ key: "test-module", methods: ["GET"] }];
const mockValidateGatewayRequestSuccess = (req: Request) => null;
const mockValidateGatewayRequestFail = (req: Request) => NextResponse.json({ ok: false }, { status: 401 });

const mockProcessAgentSubmissionSuccess = async (payload: any, options: any) => ({
  ok: true,
  data: { id: "cand-123" },
  receipt: { correlationId: options.correlationId || "corr-123", idempotencyKey: options.idempotencyKey || "idem-123", status: "success" }
});

const mockProcessAgentSubmissionFail = async (payload: any, options: any) => ({
  ok: false,
  error: { code: "INVALID_PAYLOAD", message: "Validation failed", details: { field: "name" } },
  receipt: { correlationId: options.correlationId || "corr-123", idempotencyKey: options.idempotencyKey || "idem-123", status: "failed" }
});

const mockDb = {
  insert: () => ({
    values: () => ({
      returning: () => [{ id: "event-123", eventType: "test", targetModule: "test" }],
    }),
  }),
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => [],
      }),
    }),
  }),
};

// Route 1: GET /api/gateway/modules
const { GET: getModules } = proxyquire("@/app/api/gateway/modules/route", {
  "@/platform/integrations/auth": { validateGatewayRequest: mockValidateGatewayRequestSuccess },
  "@/platform/integrations/module-registry": { gatewayModules: mockGatewayModules },
});

const { GET: getModulesUnauthorized } = proxyquire("@/app/api/gateway/modules/route", {
  "@/platform/integrations/auth": { validateGatewayRequest: mockValidateGatewayRequestFail },
  "@/platform/integrations/module-registry": { gatewayModules: mockGatewayModules },
});

// Route 2: POST /api/agent
const { POST: postAgentSuccess } = proxyquire("@/app/api/agent/route", {
  "@/features/platform/gateway/agent-gateway-metadata.service": { processAgentSubmissionWithMetadata: mockProcessAgentSubmissionSuccess },
});

const { POST: postAgentFail } = proxyquire("@/app/api/agent/route", {
  "@/features/platform/gateway/agent-gateway-metadata.service": { processAgentSubmissionWithMetadata: mockProcessAgentSubmissionFail },
});

// Route 3: POST /api/gateway/webhooks
const { POST: postWebhookSuccess } = proxyquire("@/app/api/gateway/webhooks/route", {
  "@/platform/integrations/auth": { validateGatewayRequest: mockValidateGatewayRequestSuccess },
  "@/db": { getRuntimeDb: () => mockDb },
});

test("Route Migration Pilot Integration Tests", async (t) => {
  process.env.AGENT_GATEWAY_KEY = "valid-agent-key";

  await t.test("GET /api/gateway/modules - Success", async () => {
    const req = new Request("http://localhost/api/gateway/modules");
    const res = await getModules(req);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.ok, true);
    assert.deepStrictEqual(body.modules, mockGatewayModules);
  });

  await t.test("GET /api/gateway/modules - Unauthorized (Canonical Pipeline)", async () => {
    const correlationId = "corr-test-auth";
    const req = new Request("http://localhost/api/gateway/modules", {
      headers: { "x-correlation-id": correlationId }
    });
    const res = await getModulesUnauthorized(req);
    const body = await res.json();

    assert.strictEqual(res.status, 401);
    assert.strictEqual(body.error.code, "GATEWAY.AUTH.UNAUTHORIZED");
    assert.strictEqual(body.error.category, "authentication");
    assert.strictEqual(body.error.message, "Authentication failed.");
    assert.strictEqual(body.error.correlationId, correlationId);
    assert.strictEqual(res.headers.get("x-correlation-id"), correlationId);
  });

  await t.test("POST /api/agent - Success", async () => {
    const req = new Request("http://localhost/api/agent", {
      method: "POST",
      headers: { "x-agent-key": "valid-agent-key", "content-type": "application/json" },
      body: JSON.stringify({ name: "Test" })
    });
    const res = await postAgentSuccess(req);
    const body = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.ok, true);
    assert.strictEqual(body.data.id, "cand-123");
  });

  await t.test("POST /api/agent - Validation Failure (Canonical Pipeline)", async () => {
    const correlationId = "corr-test-val";
    const req = new Request("http://localhost/api/agent", {
      method: "POST",
      headers: {
        "x-agent-key": "valid-agent-key",
        "content-type": "application/json",
        "x-correlation-id": correlationId
      },
      body: JSON.stringify({ invalid: true })
    });
    const res = await postAgentFail(req);
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.error.code, "VALIDATION.PAYLOAD.INVALID");
    assert.strictEqual(body.error.category, "validation");
    assert.strictEqual(body.error.correlationId, correlationId);
  });

  await t.test("POST /api/gateway/webhooks - Missing eventType (Canonical Pipeline)", async () => {
    const req = new Request("http://localhost/api/gateway/webhooks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ payload: {} })
    });
    const res = await postWebhookSuccess(req);
    const body = await res.json();

    assert.strictEqual(res.status, 400);
    assert.strictEqual(body.error.code, "VALIDATION.EVENT.MISSING_TYPE");
    assert.strictEqual(body.error.category, "validation");
  });

  await t.test("Unexpected Error Handling - Redaction", async () => {
    const { GET: getModulesError } = proxyquire("@/app/api/gateway/modules/route", {
      "@/platform/integrations/auth": { validateGatewayRequest: () => { throw new Error("Database exploded"); } },
    });

    const req = new Request("http://localhost/api/gateway/modules");
    const res = await getModulesError(req);
    const body = await res.json();

    assert.strictEqual(res.status, 500);
    assert.strictEqual(body.error.code, "UNEXPECTED.SERVER.ERROR");
    assert.strictEqual(body.error.message, "An unexpected error occurred.");
    assert.strictEqual(body.error.details, undefined, "Internal details should be redacted");
  });
});
