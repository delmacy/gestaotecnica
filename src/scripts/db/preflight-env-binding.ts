import postgres from "postgres";

export async function runPreflight() {
  const dbUrl = process.env.RUNTIME_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("BLOCKER: RUNTIME_DATABASE_URL or DATABASE_URL must be set.");
    process.exit(1);
  }

  const sql = postgres(dbUrl, { max: 1 });

  try {
    // 1. Check schemas
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

    const schemasRes = await sql`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = ANY(${requiredSchemas})
    `;
    const foundSchemas = schemasRes.map((r: any) => r.schema_name);
    const missingSchemas = requiredSchemas.filter((s) => !foundSchemas.includes(s));

    if (missingSchemas.length > 0) {
      console.error(`BLOCKER: Missing required schemas: ${missingSchemas.join(", ")}`);
      process.exit(1);
    }
    console.log("SUCCESS: All required schemas are present.");

    // 2. Check superuser status
    const [userRow] = await sql`SELECT current_user`;
    const currentUser = userRow.current_user;

    const [roleRow] = await sql`
      SELECT rolsuper
      FROM pg_roles
      WHERE rolname = ${currentUser}
    `;

    if (roleRow && roleRow.rolsuper) {
      console.error(`BLOCKER: Runtime database user '${currentUser}' is a superuser. Application runtime must not use superuser roles.`);
      process.exit(1);
    }
    console.log(`SUCCESS: Runtime user '${currentUser}' is not a superuser.`);

    // 3. Check for least-privilege (should not have CREATE privilege on schemas)
    // Only owner_migration or break_glass or superuser should have CREATE on these schemas.
    const [privRow] = await sql`SELECT has_schema_privilege(${currentUser}, 'builder', 'CREATE') as can_create`;

    if (privRow && privRow.can_create) {
      console.error(`BLOCKER: Runtime user '${currentUser}' has CREATE privileges on 'builder' schema. Expected least-privilege role (e.g. app_runtime).`);
      process.exit(1);
    }
    console.log(`SUCCESS: Runtime user '${currentUser}' has expected least-privilege access.`);

    console.log("Preflight complete: Database environment binding is verified.");
  } catch (error) {
    console.error("Error running preflight:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

if (require.main === module) {
  runPreflight().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
