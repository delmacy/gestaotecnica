import "dotenv/config";
import postgres from "postgres";

async function main() {
  console.log("Starting database schema bootstrap...");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });

  const schemas = [
    "identity",
    "workspace",
    "workflow",
    "registry",
    "documents",
    "storage",
    "blueprints",
    "builder",
  ];

  try {
    for (const schema of schemas) {
      console.log(`Creating schema if not exists: ${schema}`);
      await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
    }
    console.log("Bootstrap complete.");
  } catch (error) {
    console.error("Error creating schemas:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
