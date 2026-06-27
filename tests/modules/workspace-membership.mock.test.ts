import { test, describe } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import proxyquire from "proxyquire";

const mockDb = {
  select: () => ({
    from: () => ({
      innerJoin: () => ({
        where: () => ({
          limit: () => [],
          then: (cb: any) => cb([])
        }),
        whereIn: () => []
      }),
      where: () => ({
        limit: () => [],
        then: (cb: any) => cb([])
      })
    })
  })
};

const { getWorkspaceMember, assertWorkspaceMembership } = proxyquire("../../src/modules/workspace-membership/service", {
  "@/db": {
    getRuntimeDb: () => mockDb,
    "@global": true
  }
});

describe("Workspace Membership Service (Mocked)", () => {
  const workspaceId = randomUUID();
  const userId = randomUUID();

  test("should fail assertion if member not found", async () => {
    // mockDb returns empty array, so member not found
    await assert.rejects(
      assertWorkspaceMembership(userId, workspaceId),
      /is not an active member/
    );
  });

  test("getWorkspaceMember should return null if not found", async () => {
    const result = await getWorkspaceMember(randomUUID(), workspaceId);
    assert.strictEqual(result, null);
  });
});
