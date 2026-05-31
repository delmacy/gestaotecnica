import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main() {
  console.log("Starting database schema bootstrap...");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  const schemas = [
    "identity",
    "workspace",
    "workflow",
    "registry",
    "documents",
    "storage",
    "blueprints",
  ];

  try {
    for (const schema of schemas) {
      console.log(`Creating schema if not exists: ${schema}`);
      await db.execute(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
    }
    console.log("Bootstrap complete.");
  } catch (error) {
    console.error("Error creating schemas:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
