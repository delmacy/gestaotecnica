import { test, describe } from "node:test";
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { appendDomainEvent } from "../../src/platform/events/event-writer";
import { createMockContext } from "../helpers/isolation-helper";
import proxyquire from "proxyquire";

const mockDb = {
  insert: () => ({
    values: () => ({
      returning: () => [{ id: randomUUID() }]
    })
  }),
  select: () => ({
    from: () => ({
      where: () => ({
        orderBy: () => ({
          limit: () => []
        }),
        limit: () => []
      })
    })
  })
};

const { appendDomainEvent: mockedAppend } = proxyquire("../../src/platform/events/event-writer", {
  "@/db": {
    getRuntimeDb: () => mockDb,
    "@global": true
  },
  "./event-log-service": {
    emitEvent: async (input: any, context: any) => ({
      ...input,
      id: randomUUID(),
      correlationId: context.correlationId
    }),
    "@global": true
  }
});

describe("Canonical Event Contract and Event Writer", () => {
  const mockWorkspace = { id: randomUUID(), key: "test-ws" };
  const context = createMockContext(mockWorkspace);

  test("should append a valid canonical event", async () => {
    const entityId = randomUUID();
    const event = await mockedAppend({
      workspaceId: mockWorkspace.id,
      eventType: "test.event",
      entityType: "test-entity",
      entityId: entityId,
      schemaVersion: "1.0",
      payload: { foo: "bar" },
      metadata: { source: "test" },
    }, context as any);

    assert.strictEqual(event.eventType, "test.event");
    assert.strictEqual(event.entityId, entityId);
    assert.strictEqual(event.workspaceId, mockWorkspace.id);
    assert.ok(event.id);
  });

  test("should fail if workspaceId does not match context", async () => {
    const otherWorkspaceId = randomUUID();
    await assert.rejects(
      mockedAppend({
        workspaceId: otherWorkspaceId,
        eventType: "test.event",
        entityType: "test-entity",
        entityId: randomUUID(),
        schemaVersion: "1.0",
        payload: { foo: "bar" },
      }, context as any),
      /Workspace isolation violation/
    );
  });
});
