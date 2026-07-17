import { describe, it } from "node:test";
import * as assert from "node:assert";
import { InMemoryClientRepository } from "@/platform/persistence/repositories/in-memory-client.repository";

describe("InMemoryClientRepository", () => {
  it("should save and retrieve a client", async () => {
    const repository = new InMemoryClientRepository();
    const client = { id: "1", name: "Test Client", extra: "data" };

    const saved = await repository.save(client);
    assert.deepStrictEqual(saved, client);

    const retrieved = await repository.findById("1");
    assert.deepStrictEqual(retrieved, client);
  });

  it("should return null for non-existent client", async () => {
    const repository = new InMemoryClientRepository();
    const retrieved = await repository.findById("999");
    assert.strictEqual(retrieved, null);
  });
});
