import { describe, it } from "node:test";
import * as assert from "node:assert";
import type { Capability, CapabilityPersistencePort } from "@/platform/persistence/ports/capability-persistence.port";

describe("CapabilityPersistencePort", () => {
  it("should enforce the structural contract", async () => {
    class MockCapabilityPersistencePort implements CapabilityPersistencePort {
      async save(capability: Capability): Promise<Capability> {
        return capability;
      }
      async findById(id: string): Promise<Capability | null> {
        if (id === "1") {
          return { id: "1", name: "Test Capability" };
        }
        return null;
      }
    }

    const port: CapabilityPersistencePort = new MockCapabilityPersistencePort();

    const saved = await port.save({ id: "2", name: "New Capability" });
    assert.strictEqual(saved.id, "2");
    assert.strictEqual(saved.name, "New Capability");

    const found = await port.findById("1");
    assert.strictEqual(found?.id, "1");
    assert.strictEqual(found?.name, "Test Capability");

    const notFound = await port.findById("999");
    assert.strictEqual(notFound, null);
  });
});
