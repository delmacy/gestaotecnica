import { describe, it } from "node:test";
import assert from "node:assert";
import Module from "node:module";

// Mock Next.js next/server
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string): unknown {
  if (id === "next/server") {
    return {
      NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
          json: async () => data,
          status: init?.status || 200,
        }),
      },
    };
  }
  return originalRequire.apply(this, [id] as [string]);
};

import { POST } from "@/app/api/runtime/evidence/handoff/route";

interface MockResponse {
  json: () => Promise<unknown>;
  status: number;
}

describe("Runtime Evidence Handoff Route", () => {
  it("should return empty state when required information missing", async () => {
    const req = {
      json: async () => ({}),
      headers: { get: () => null }
    } as unknown as Request;

    const response = await POST(req) as unknown as MockResponse;
    const data = await response.json() as { success: boolean; status: string };
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.status, "empty");
  });

  it("should return blocked state when user role is blocked", async () => {
    const req = {
      json: async () => ({
        processId: "test-process",
        executionPayload: { field: "value" },
        timestamp: "2023-01-01T00:00:00Z"
      }),
      headers: {
        get: (key: string) => key === "x-user-role" ? "blocked" : null
      }
    } as unknown as Request;

    const response = await POST(req) as unknown as MockResponse;
    const data = await response.json() as { success: boolean; status: string };
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.status, "blocked");
  });

  it("should return success for valid request", async () => {
    const req = {
      json: async () => ({
        processId: "test-process",
        executionPayload: { field: "value" },
        timestamp: "2023-01-01T00:00:00Z"
      }),
      headers: {
        get: () => null
      }
    } as unknown as Request;

    const response = await POST(req) as unknown as MockResponse;
    const data = await response.json() as { success: boolean; status: string; evidenceId: string };
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.status, "success");
    assert.ok(data.evidenceId.startsWith("live_"));
  });
});
