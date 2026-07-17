export type Capability = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export interface CapabilityPersistencePort {
  save(capability: Capability): Promise<Capability>;
  findById(id: string): Promise<Capability | null>;
}
