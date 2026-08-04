import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";

// Mock NextResponse
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

describe("Integration Auth Boundary - validateGatewayRequest", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("succeeds (returns null) when GESTAOTECNICA_API_KEY environment variable is not set", async () => {
    delete process.env.GESTAOTECNICA_API_KEY;

    const request = new Request("http://localhost");
    const result = await validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds (returns null) when x-gestaotecnica-api-key header matches the expected key", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "x-gestaotecnica-api-key": "test-secret-key",
      },
    });
    const result = await validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds (returns null) when authorization header matches the expected key without Bearer prefix", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "authorization": "test-secret-key",
      },
    });
    const result = await validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds (returns null) when authorization header matches the expected key with Bearer prefix", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "authorization": "Bearer test-secret-key",
      },
    });
    const result = await validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("fails (returns 401) when headers are missing and GESTAOTECNICA_API_KEY is set", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost");
    const result = await validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);

    const body = await result.json();
    assert.deepStrictEqual(body, {
      ok: false,
      error: "unauthorized_gateway_request",
    });
  });

  it("succeeds (returns null) when JWT Bearer token is valid", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const { issueGatewayToken } = await import("@/platform/integrations/jwt");
    const token = await issueGatewayToken("workspace-123", { secret: "jwt-test-secret" });

    const request = new Request("http://localhost", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const result = await validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds via authenticateGatewayRequest returning workspaceId from JWT", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const { authenticateGatewayRequest } = await import("@/platform/integrations/auth");
    const { issueGatewayToken } = await import("@/platform/integrations/jwt");
    const token = await issueGatewayToken("workspace-456", { secret: "jwt-test-secret" });

    const request = new Request("http://localhost", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const result = await authenticateGatewayRequest(request);

    assert.ok(result.authenticated);
    if (result.authenticated) {
      assert.strictEqual(result.workspaceId, "workspace-456");
    }
  });

  it("fails (returns 401) when JWT Bearer token is invalid", async () => {
    process.env.JWT_SECRET = "jwt-test-secret";

    const request = new Request("http://localhost", {
      headers: {
        authorization: "Bearer invalid-token",
      },
    });
    const result = await validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);
  });

  it("fails (returns 401) when headers are incorrect and GESTAOTECNICA_API_KEY is set", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "x-gestaotecnica-api-key": "wrong-key",
      },
    });
    const result = await validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);

    const body = await result.json();
    assert.deepStrictEqual(body, {
      ok: false,
      error: "unauthorized_gateway_request",
    });
  });
});
