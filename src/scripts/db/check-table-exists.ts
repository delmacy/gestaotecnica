import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

async function main() {
  const tableName = process.argv[2];
  if (!tableName) {
    console.error("Please provide a table name in schema.table format.");
    process.exit(1);
  }

  const [schema, table] = tableName.split('.');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("DATABASE_URL not set. Skipping verification.");
    return;
  }

  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = ${schema}
        AND table_name = ${table}
      );
    `;

    if (result[0]?.exists) {
      console.log(`Table ${tableName} exists.`);
    } else {
      console.error(`Table ${tableName} does NOT exist!`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`Error checking table existence: ${error.message}`);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch(console.error);
