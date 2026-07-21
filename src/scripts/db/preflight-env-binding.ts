import postgres from "postgres";

export const REQUIRED_SCHEMAS = [
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

export async function runPreflightChecks(sql: postgres.Sql) {
  // 1. Check schemas
  const schemasRes = await sql`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name = ANY(${REQUIRED_SCHEMAS})
  `;
  const foundSchemas = schemasRes.map((r: postgres.Row) => r.schema_name);
  const missingSchemas = REQUIRED_SCHEMAS.filter((s) => !foundSchemas.includes(s));

  if (missingSchemas.length > 0) {
    throw new Error(`BLOCKER: Missing required schemas: ${missingSchemas.join(", ")}`);
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
    throw new Error(`BLOCKER: Runtime database user '${currentUser}' is a superuser. Application runtime must not use superuser roles.`);
  }
  console.log(`SUCCESS: Runtime user '${currentUser}' is not a superuser.`);

  // 3. Check for least-privilege (should not have CREATE privilege on any required schema except public if applicable, but we check all explicitly)
  // We expect non-superuser runtime role to lack CREATE privileges on application schemas
  const schemasToCheck = REQUIRED_SCHEMAS.filter(s => s !== 'public');

  for (const schema of schemasToCheck) {
    const [privRow] = await sql`SELECT has_schema_privilege(${currentUser}, ${schema}, 'CREATE') as can_create`;

    if (privRow && privRow.can_create) {
      throw new Error(`BLOCKER: Runtime user '${currentUser}' has CREATE privileges on '${schema}' schema. Expected least-privilege role (e.g. app_runtime).`);
    }
  }

  console.log(`SUCCESS: Runtime user '${currentUser}' has expected least-privilege access.`);
  console.log("Preflight complete: Database environment binding is verified.");
}

export async function runPreflight() {
  const dbUrl = process.env.RUNTIME_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("BLOCKER: RUNTIME_DATABASE_URL or DATABASE_URL must be set.");
    process.exit(1);
  }

  const sql = postgres(dbUrl, { max: 1 });

  try {
    await runPreflightChecks(sql);
  } catch (error: any) {
    console.error(error.message || error);
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
