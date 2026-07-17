import { describe, it } from "node:test";
import * as assert from "node:assert";
import type { Workspace, WorkspacePersistencePort } from "@/platform/persistence/ports/workspace-persistence.port";

describe("WorkspacePersistencePort", () => {
  it("should enforce the structural contract", async () => {
    // A mock implementation asserting the structure matches the interface
    class MockWorkspacePersistencePort implements WorkspacePersistencePort {
      async save(workspace: Workspace): Promise<Workspace> {
        return workspace;
      }
      async findById(id: string): Promise<Workspace | null> {
        if (id === "1") {
          return { id: "1", name: "Test Workspace" };
        }
        return null;
      }
    }

    const port: WorkspacePersistencePort = new MockWorkspacePersistencePort();

    const saved = await port.save({ id: "2", name: "New Workspace" });
    assert.strictEqual(saved.id, "2");
    assert.strictEqual(saved.name, "New Workspace");

    const found = await port.findById("1");
    assert.strictEqual(found?.id, "1");
    assert.strictEqual(found?.name, "Test Workspace");

    const notFound = await port.findById("999");
    assert.strictEqual(notFound, null);
  });
});
