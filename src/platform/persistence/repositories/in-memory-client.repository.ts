import type { Client, ClientPersistencePort } from "../ports/client-persistence.port";

export class InMemoryClientRepository implements ClientPersistencePort {
  private readonly store = new Map<string, Client>();

  async save(client: Client): Promise<Client> {
    this.store.set(client.id, client);
    return client;
  }

  async findById(id: string): Promise<Client | null> {
    return this.store.get(id) || null;
  }
}
