import { describe, it } from "node:test";
import * as assert from "node:assert";
import { InMemoryWorkspaceRepository } from "@/platform/persistence/repositories/in-memory-workspace.repository";

describe("InMemoryWorkspaceRepository", () => {
  it("should save and retrieve a workspace", async () => {
    const repository = new InMemoryWorkspaceRepository();
    const workspace = { id: "1", name: "Test Workspace", data: "some data" };

    const saved = await repository.save(workspace);
    assert.deepStrictEqual(saved, workspace);

    const retrieved = await repository.findById("1");
    assert.deepStrictEqual(retrieved, workspace);
  });

  it("should return null for non-existent workspace", async () => {
    const repository = new InMemoryWorkspaceRepository();
    const retrieved = await repository.findById("999");
    assert.strictEqual(retrieved, null);
  });
});
