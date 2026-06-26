import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main() {
  console.log("Starting CI Migrations Application...");

  const dbUrl = process.env.DATABASE_URL || process.env.PLATFORM_DATABASE_URL || process.env.RUNTIME_DATABASE_URL;

  if (!dbUrl) {
    console.error("ERROR: No database URL provided for migrations. Please set DATABASE_URL, PLATFORM_DATABASE_URL, or RUNTIME_DATABASE_URL.");
    process.exitCode = 1;
    return;
  }

  // Use max 1 connection to prevent hanging in single execution script
  const sql = postgres(dbUrl, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log("Applying migrations from ./drizzle folder...");

    // Applying migrations non-interactively
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ CI Migrations successfully applied.");
    process.exitCode = 0;
  } catch (err: any) {
    console.error("ERROR: Failed to apply migrations.");
    console.error(err.message || err);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
