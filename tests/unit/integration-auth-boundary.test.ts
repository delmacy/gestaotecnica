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

  it("succeeds (returns null) when GESTAOTECNICA_API_KEY environment variable is not set", () => {
    delete process.env.GESTAOTECNICA_API_KEY;

    const request = new Request("http://localhost");
    const result = validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds (returns null) when x-gestaotecnica-api-key header matches the expected key", () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "x-gestaotecnica-api-key": "test-secret-key",
      },
    });
    const result = validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds (returns null) when authorization header matches the expected key without Bearer prefix", () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "authorization": "test-secret-key",
      },
    });
    const result = validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("succeeds (returns null) when authorization header matches the expected key with Bearer prefix", () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "authorization": "Bearer test-secret-key",
      },
    });
    const result = validateGatewayRequest(request);

    assert.strictEqual(result, null);
  });

  it("fails (returns 401) when headers are missing and GESTAOTECNICA_API_KEY is set", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost");
    const result = validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);

    const body = await result.json();
    assert.deepStrictEqual(body, {
      ok: false,
      error: "unauthorized_gateway_request",
    });
  });

  it("fails (returns 401) when headers are incorrect and GESTAOTECNICA_API_KEY is set", async () => {
    process.env.GESTAOTECNICA_API_KEY = "test-secret-key";

    const request = new Request("http://localhost", {
      headers: {
        "x-gestaotecnica-api-key": "wrong-key",
      },
    });
    const result = validateGatewayRequest(request);

    assert.ok(result instanceof MockNextResponse);
    assert.strictEqual(result.status, 401);

    const body = await result.json();
    assert.deepStrictEqual(body, {
      ok: false,
      error: "unauthorized_gateway_request",
    });
  });
});
