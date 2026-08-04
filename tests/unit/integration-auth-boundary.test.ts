import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";

class MockNextResponse {
  body: unknown;
  status: number;

  constructor(body: unknown, init?: { status?: number }) {
    this.body = body;
    this.status = init?.status || 200;
  }

  static json(body: unknown, init?: { status?: number }) {
    return new MockNextResponse(body, init);
  }

  async json() {
    return this.body;
  }
}

const { validateGatewayRequest } = proxyquire("../../src/platform/integrations/auth", {
  "next/server": {
    NextResponse: MockNextResponse
  }
});

describe("Integration Auth Boundary - validateGatewayRequest (JWT only)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("succeeds (returns null) when JWT Bearer token is valid", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const { issueGatewayToken } = await import("@/platform/integrations/jwt");
    const token = await issueGatewayToken("workspace-123", { secret: "jwt-test-secret" });

    const request = new Request("http://localhost", {
      headers: { authorization: `Bearer ${token}` },
    });
    const result = await validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("fails (returns 401) when no auth header is present", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const request = new Request("http://localhost");
    const result = await validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);

    const body = await result.json();
    assert.deepStrictEqual(body, { ok: false, error: "unauthorized_gateway_request" });
  });

  it("fails (returns 401) when JWT Bearer token is invalid", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const request = new Request("http://localhost", {
      headers: { authorization: "Bearer invalid-token" },
    });
    const result = await validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);
  });

  it("fails (returns 401) when x-gestaotecnica-api-key header is present (API key no longer accepted)", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const request = new Request("http://localhost", {
      headers: { "x-gestaotecnica-api-key": "some-key" },
    });
    const result = await validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);
  });

  it("returns workspaceId via authenticateGatewayRequest from JWT", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const { authenticateGatewayRequest } = await import("@/platform/integrations/auth");
    const { issueGatewayToken } = await import("@/platform/integrations/jwt");
    const token = await issueGatewayToken("workspace-456", { secret: "jwt-test-secret" });

    const request = new Request("http://localhost", {
      headers: { authorization: `Bearer ${token}` },
    });
    const result = await authenticateGatewayRequest(request);

    assert.ok(result.authenticated);
    if (result.authenticated) {
      assert.strictEqual(result.workspaceId, "workspace-456");
    }
  });
});
