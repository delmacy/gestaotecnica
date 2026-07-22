import postgres from 'postgres';

const SCHEMAS_TO_CHECK = [
  { schema: 'builder', table: 'agent_gateway_submissions' },
  { schema: 'workspace', table: 'workspaces' },
  { schema: 'identity', table: 'users' },
  { schema: 'workflow', table: 'process_instances' }
];

async function verifySchema() {
  const primaryDbUrl = process.env.DATABASE_URL || process.env.PLATFORM_DATABASE_URL || process.env.RUNTIME_DATABASE_URL;
  if (!primaryDbUrl) {
    console.error('DATABASE_URL, PLATFORM_DATABASE_URL, or RUNTIME_DATABASE_URL must be set. Failing fast.');
    process.exitCode = 1;
    return;
  }

  console.log('Phase 1: Connecting to database via lazy client to check schema presence...');
  const sql = postgres(primaryDbUrl, { max: 1 });

  try {
    let hasError = false;

    // Phase 1: Check tables in schemas
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
  } catch (err: unknown) {
    console.error('Database query failed during schema check:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
    await sql.end();
    return;
  }

  await sql.end();

  // Phase 2: Check least-privilege DB access
  console.log('\nPhase 2: Checking least-privilege DB access...');
  const runtimeDbUrl = process.env.RUNTIME_DATABASE_URL;
  const isSynthetic = !runtimeDbUrl || runtimeDbUrl === process.env.DATABASE_URL || runtimeDbUrl === process.env.PLATFORM_DATABASE_URL;

  if (isSynthetic) {
    console.log("Info: RUNTIME_DATABASE_URL matches DATABASE_URL/PLATFORM_DATABASE_URL or is not set. Skipping least-privilege check (synthetic/demo path).");
    return;
  }

  const runtimeSql = postgres(runtimeDbUrl, { max: 1 });

  try {
    const [userRow] = await runtimeSql`SELECT current_user`;
    const currentUser = userRow.current_user;

    const [roleRow] = await runtimeSql`
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
      const [privRow] = await runtimeSql`SELECT has_schema_privilege(${currentUser}, ${schema}, 'CREATE') as can_create`;

      if (privRow && privRow.can_create) {
        console.error(`Error: BLOCKER: Runtime user '${currentUser}' has CREATE privileges on '${schema}' schema. Expected least-privilege role (e.g. app_runtime).`);
        process.exitCode = 1;
        return;
      }
    }
    console.log(`Success: Runtime user '${currentUser}' has expected least-privilege access.`);

  } catch (err: unknown) {
    console.error('Database query failed during least-privilege check:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  } finally {
    await runtimeSql.end();
  }
}

verifySchema();
