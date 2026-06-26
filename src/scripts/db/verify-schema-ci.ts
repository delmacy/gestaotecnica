import postgres from "postgres";

async function main() {
  console.log("Starting CI Schema Verification...");

  const dbUrl = process.env.DATABASE_URL || process.env.PLATFORM_DATABASE_URL || process.env.RUNTIME_DATABASE_URL;

  if (!dbUrl) {
    console.error("ERROR: No database URL provided. Please set DATABASE_URL, PLATFORM_DATABASE_URL, or RUNTIME_DATABASE_URL.");
    process.exitCode = 1;
    return;
  }

  console.log("Database URL found, proceeding to check schemas...");

  // Use a direct lazy client to avoid top-level environment variable evaluation from ORM/app imports
  const sql = postgres(dbUrl, { max: 1 });

  try {
    const requiredTables = [
      { schema: "builder", table: "agent_gateway_submissions" },
      { schema: "workspace", table: "workspaces" }
    ];

    let missingTables = false;

    for (const req of requiredTables) {
      console.log(`Checking for table ${req.schema}.${req.table}...`);

      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = ${req.schema}
          AND table_name = ${req.table}
        );
      `;

      if (result && result.length > 0 && result[0].exists) {
        console.log(`✅ Table ${req.schema}.${req.table} exists.`);
      } else {
        console.error(`❌ ERROR: Table ${req.schema}.${req.table} does not exist.`);
        missingTables = true;
      }
    }

    if (missingTables) {
      console.error("ERROR: One or more required tables are missing in the schema.");
      process.exitCode = 1;
      return;
    }

    console.log("✅ CI Schema Verification completed successfully.");
    process.exitCode = 0;
  } catch (err: any) {
    console.error("ERROR: Failed to verify schemas.");
    console.error(err.message || err);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
