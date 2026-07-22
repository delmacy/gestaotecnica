import postgres from 'postgres';

const SCHEMAS_TO_CHECK = [
  { schema: 'builder', table: 'agent_gateway_submissions' },
  { schema: 'workspace', table: 'workspaces' },
  { schema: 'identity', table: 'users' },
  { schema: 'workflow', table: 'process_instances' }
];

async function verifySchema() {
  const dbUrl = process.env.DATABASE_URL || process.env.PLATFORM_DATABASE_URL || process.env.RUNTIME_DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL, PLATFORM_DATABASE_URL, or RUNTIME_DATABASE_URL must be set. Failing fast.');
    process.exitCode = 1;
    return;
  }

  console.log('Connecting to database via lazy client...');
  const sql = postgres(dbUrl, { max: 1 });

  try {
    let hasError = false;

    // Check tables in schemas
    for (const { schema, table } of SCHEMAS_TO_CHECK) {
      const res = await sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = ${schema} AND table_name = ${table};
      `;

      if (res.length === 0) {
        console.error(`Error: BLOCKER: ${schema}.${table} table not found. Missing auth/workspace/runtime schemas.`);
        hasError = true;
      } else {
        console.log(`Success: ${schema}.${table} table exists.`);
      }
    }

    if (hasError) {
      process.exitCode = 1;
      return;
    }

    // Check least-privilege DB access
    const [userRow] = await sql`SELECT current_user`;
    const currentUser = userRow.current_user;

    const [roleRow] = await sql`
      SELECT rolsuper
      FROM pg_roles
      WHERE rolname = ${currentUser}
    `;

    if (roleRow && roleRow.rolsuper) {
      console.error(`Error: BLOCKER: Runtime database user '${currentUser}' is a superuser/owner. Runtime env uses a superuser credential.`);
      process.exitCode = 1;
      return;
    }
    console.log(`Success: Runtime user '${currentUser}' is not a superuser.`);

    // Check for least-privilege (should not have CREATE privilege on any required schema except public)
    const schemasToCheck = ['identity', 'workspace', 'workflow', 'registry', 'documents', 'storage', 'blueprints', 'builder'];
    for (const schema of schemasToCheck) {
      const [privRow] = await sql`SELECT has_schema_privilege(${currentUser}, ${schema}, 'CREATE') as can_create`;

      if (privRow && privRow.can_create) {
        console.error(`Error: BLOCKER: Runtime user '${currentUser}' has CREATE privileges on '${schema}' schema. Expected least-privilege role (e.g. app_runtime).`);
        process.exitCode = 1;
        return;
      }
    }
    console.log(`Success: Runtime user '${currentUser}' has expected least-privilege access.`);

  } catch (err: any) {
    console.error('Database query failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

verifySchema();
