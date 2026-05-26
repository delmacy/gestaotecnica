import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required to initialize the database.");
    }

    client = postgres(databaseUrl, {
      max: 1,
      prepare: false,
    });

    db = drizzle(client, { schema });
  }

  return db;
}

export type DbClient = ReturnType<typeof getDb>;
