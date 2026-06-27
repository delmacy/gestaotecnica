import { test, describe } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import proxyquire from "proxyquire";

const mockDb = {
  insert: () => ({
    values: () => ({
      returning: () => [{ id: randomUUID() }]
    })
  }),
  update: () => ({
    set: () => ({
      where: () => []
    })
  }),
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => [],
        orderBy: () => []
      })
    })
  })
};

const { requestApproval, decideApproval } = proxyquire("../../src/modules/approval-workflow/kernel-actions", {
  "@/db": {
    getRuntimeDb: () => mockDb,
    "@global": true
  },
  "@/modules/workspace-membership/service": {
    assertWorkspaceMembership: async () => {}, // mock success
    "@global": true
  },
  "@/platform/events/event-writer": {
    appendDomainEvent: async () => ({ id: randomUUID() }),
    "@global": true
  }
});

describe("Approval Workflow Module (Mocked)", () => {
  const workspaceId = randomUUID();
  const context = {
    workspaceId,
    actor: { type: "user", id: randomUUID() },
    correlationId: "test-corr"
  };

  test("should initiate an approval request", async () => {
    const result = await requestApproval.handler({
      title: "Test Approval",
      subjectType: "document",
      subjectId: "doc-123",
      steps: [
        { approverId: randomUUID(), approverType: "user" }
      ]
    }, context as any);

    assert.strictEqual(result.success, true);
    assert.ok(result.data.requestId);
  });

  // More granular tests would require a more sophisticated DB mock or a real test DB
});
