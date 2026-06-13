import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.AGENT_WORK_DATABASE_URL;

if (!connectionString) {
  throw new Error("AGENT_WORK_DATABASE_URL is missing. Do not use PLATFORM or RUNTIME db.");
}

const client = postgres(connectionString);
export const agentWorkDb = drizzle(client, { schema });
