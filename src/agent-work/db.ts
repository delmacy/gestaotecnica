import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let agentWorkDbInstance: PostgresJsDatabase<typeof schema> | null = null;
let clientInstance: postgres.Sql | null = null;

export function createAgentWorkDb(connectionString?: string) {
  if (agentWorkDbInstance) {
    return agentWorkDbInstance;
  }

  let dbUrl = connectionString;
  if (!dbUrl) {
    dbUrl = process.env.NODE_ENV === "test"
      ? process.env.AGENT_WORK_TEST_DATABASE_URL
      : process.env.AGENT_WORK_DATABASE_URL;
  }

  if (!dbUrl) {
    throw new Error("AGENT_WORK_DATABASE_URL or AGENT_WORK_TEST_DATABASE_URL is missing.");
  }

  clientInstance = postgres(dbUrl);
  agentWorkDbInstance = drizzle(clientInstance, { schema });
  return agentWorkDbInstance;
}

export function getAgentWorkDb() {
  if (!agentWorkDbInstance) {
    throw new Error("Agent Work DB is not initialized. Call createAgentWorkDb first.");
  }
  return agentWorkDbInstance;
}

export async function closeAgentWorkDb() {
  if (clientInstance) {
    await clientInstance.end({ timeout: 5 });
    clientInstance = null;
  }
  agentWorkDbInstance = null;
}

export async function withAgentWorkDb<T>(fn: () => Promise<T>): Promise<T> {
  const db = createAgentWorkDb();
  try {
    return await fn();
  } finally {
    await closeAgentWorkDb();
  }
}
