import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let agentWorkClient: postgres.Sql | null = null;
let agentWorkDbInstance: any = null;

export function getAgentWorkDb() {
  if (!agentWorkDbInstance) {
    const databaseUrl = process.env.AGENT_WORK_DATABASE_URL;

    const isTest = process.env.NODE_ENV === "test";
    const finalUrl = databaseUrl || (isTest ? process.env.DATABASE_URL : undefined);

    if (!finalUrl) {
      throw new Error(
        "AGENT_WORK_DATABASE_URL environment variable is required to connect to the Work Board. " +
        "It must not fallback to DATABASE_URL in production."
      );
    }

    agentWorkClient = postgres(finalUrl, {
      max: 5,
      prepare: false,
    });

    agentWorkDbInstance = drizzle(agentWorkClient, { schema });
  }

  return agentWorkDbInstance;
}

export async function closeAgentWorkDb() {
  if (agentWorkClient) {
    await agentWorkClient.end({ timeout: 5 });
    agentWorkClient = null;
    agentWorkDbInstance = null;
  }
}
