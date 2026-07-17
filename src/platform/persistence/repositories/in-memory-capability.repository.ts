import type { Capability, CapabilityPersistencePort } from "../ports/capability-persistence.port";

export class InMemoryCapabilityRepository implements CapabilityPersistencePort {
  private readonly store = new Map<string, Capability>();

  async save(capability: Capability): Promise<Capability> {
    this.store.set(capability.id, capability);
    return capability;
  }

  async findById(id: string): Promise<Capability | null> {
    return this.store.get(id) || null;
  }
}
