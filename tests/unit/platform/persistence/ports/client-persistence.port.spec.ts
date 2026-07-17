import { describe, it } from "node:test";
import * as assert from "node:assert";
import type { Client, ClientPersistencePort } from "@/platform/persistence/ports/client-persistence.port";

describe("ClientPersistencePort", () => {
  it("should enforce the structural contract", async () => {
    class MockClientPersistencePort implements ClientPersistencePort {
      async save(client: Client): Promise<Client> {
        return client;
      }
      async findById(id: string): Promise<Client | null> {
        if (id === "1") {
          return { id: "1", name: "Test Client" };
        }
        return null;
      }
    }

    const port: ClientPersistencePort = new MockClientPersistencePort();

    const saved = await port.save({ id: "2", name: "New Client" });
    assert.strictEqual(saved.id, "2");
    assert.strictEqual(saved.name, "New Client");

    const found = await port.findById("1");
    assert.strictEqual(found?.id, "1");
    assert.strictEqual(found?.name, "Test Client");

    const notFound = await port.findById("999");
    assert.strictEqual(notFound, null);
  });
});
