import { describe, it } from 'node:test';
import assert from 'node:assert';
import { POST, GET } from "../../src/app/api/builder/navigation/workspace-switching/route";
import { NextRequest } from "next/server";

describe('Workspace Switching API Routes (route.ts)', () => {

    it("GET parses valid payload and invokes handler correctly", async () => {
      (global as unknown as { mockDbResult: unknown[] }).mockDbResult = [];
      const req = new Request("http://localhost/api/builder/navigation/workspace-switching?userId=u1");
      const res = await GET(req as NextRequest);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.ok(Array.isArray(body.workspaces));
    });

    it("POST validates targetWorkspaceId and resolves", async () => {
      (global as unknown as { mockDbResult: unknown[] }).mockDbResult = [{ id: 'ws-1' }];
      const req = new Request("http://localhost/api/builder/navigation/workspace-switching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentWorkspaceId: "ws-2", targetWorkspaceId: "ws-1", userId: "u1" })
      });
      const res = await POST(req as NextRequest);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.status, "success");
    });

    it("POST rejects invalid payload with 400", async () => {
      const req = new Request("http://localhost/api/builder/navigation/workspace-switching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentWorkspaceId: "ws-1" }) // missing target
      });
      const res = await POST(req as NextRequest);
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.strictEqual(body.error, "Invalid request payload");
    });

});
