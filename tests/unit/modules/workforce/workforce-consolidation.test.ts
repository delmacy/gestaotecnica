import { describe, it } from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";

const mockDb = {
  getDb: () => ({
    insert: () => ({
      values: () => ({
        returning: async () => [{ id: "d290f1ee-6c54-4b01-90e6-d701748f0853" }],
      }),
    }),
  }),
};

const { createWorkforceMemberKernelAction } = proxyquire("../../../../src/modules/workforce/kernel-actions", {
  "@/db": mockDb,
});

describe("Workforce Consolidation Kernel Actions", () => {
  it("should create a consolidated workforce member candidate", async () => {
    const context = { workspaceId: "d290f1ee-6c54-4b01-90e6-d701748f0851", actorId: "d290f1ee-6c54-4b01-90e6-d701748f0852" };
    const input = {
      name: "Jane Smith",
      level: "especialista",
      function: "Architect",
      competencies: ["Drizzle", "React"],
      status: "active",
    };

    const result = await createWorkforceMemberKernelAction.handler(input, context as any);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data.id, "d290f1ee-6c54-4b01-90e6-d701748f0853");
    assert.strictEqual(result.events?.[0].eventType, "workforce.member_created");
  });
});
