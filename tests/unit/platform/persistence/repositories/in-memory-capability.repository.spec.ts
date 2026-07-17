import { describe, it } from "node:test";
import * as assert from "node:assert";
import { InMemoryCapabilityRepository } from "@/platform/persistence/repositories/in-memory-capability.repository";

describe("InMemoryCapabilityRepository", () => {
  it("should save and retrieve a capability", async () => {
    const repository = new InMemoryCapabilityRepository();
    const capability = { id: "1", name: "Test Capability", description: "desc" };

    const saved = await repository.save(capability);
    assert.deepStrictEqual(saved, capability);

    const retrieved = await repository.findById("1");
    assert.deepStrictEqual(retrieved, capability);
  });

  it("should return null for non-existent capability", async () => {
    const repository = new InMemoryCapabilityRepository();
    const retrieved = await repository.findById("999");
    assert.strictEqual(retrieved, null);
  });
});
