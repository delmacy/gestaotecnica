export type Client = {
  id: string;
  name: string;
  [key: string]: unknown;
};

export interface ClientPersistencePort {
  save(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
}
