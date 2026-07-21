import "dotenv/config";
import postgres from "postgres";

export async function checkEnvBinding() {
  const dbUrl = process.env.RUNTIME_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("RUNTIME_DATABASE_URL or DATABASE_URL must be set for preflight check.");
  }

  const sql = postgres(dbUrl, { max: 1 });

  try {
    // 1. Check if user is superuser
    const currentRole = await sql`SELECT current_user`;
    const username = currentRole[0].current_user;

    const superuserCheck = await sql`
      SELECT usesuper FROM pg_user WHERE usename = ${username}
    `;

    if (superuserCheck.length > 0 && superuserCheck[0].usesuper) {
      throw new Error(`Role ${username} is a superuser. Runtime environment must not use superuser credentials.`);
    }

    // 2. Check required schemas
    const requiredSchemas = [
      "public",
      "identity",
      "workspace",
      "workflow",
      "registry",
      "documents",
      "storage",
      "blueprints",
      "builder",
    ];

    const schemas = await sql`
      SELECT schema_name FROM information_schema.schemata
      WHERE schema_name IN ${sql(requiredSchemas)}
    `;

    const foundSchemas = schemas.map(s => s.schema_name);
    const missingSchemas = requiredSchemas.filter(s => !foundSchemas.includes(s));

    if (missingSchemas.length > 0) {
      throw new Error(`Missing required schemas: ${missingSchemas.join(", ")}`);
    }

    // 3. Verify user has USAGE on schemas
    for (const schema of requiredSchemas) {
      const hasUsage = await sql`
        SELECT has_schema_privilege(${username}, ${schema}, 'USAGE') as has_usage
      `;
      if (!hasUsage[0].has_usage) {
        throw new Error(`Role ${username} does not have USAGE privilege on schema ${schema}.`);
      }
    }

    console.log("Environment binding preflight check passed successfully.");
  } finally {
    await sql.end();
  }
}

// Allow running as a standalone script
if (require.main === module) {
  checkEnvBinding().catch((err) => {
    console.error("Env Binding Preflight Check Failed:");
    console.error(err.message);
    process.exit(1);
  });
}
