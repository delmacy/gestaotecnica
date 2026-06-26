import postgres from 'postgres';

async function verifySchema() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Failing fast.');
    process.exitCode = 1;
    return;
  }

  console.log('Connecting to database via lazy client...');
  const sql = postgres(process.env.DATABASE_URL, { max: 1 });

  try {
    const builderRes = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'builder' AND table_name = 'agent_gateway_submissions';
    `;

    if (builderRes.length === 0) {
      console.error('Error: builder.agent_gateway_submissions table not found.');
      process.exitCode = 1;
    } else {
      console.log('Success: builder.agent_gateway_submissions table exists.');
    }

    const workspaceRes = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'workspace' AND table_name = 'workspaces';
    `;

    if (workspaceRes.length === 0) {
      console.error('Error: workspace.workspaces table not found.');
      process.exitCode = 1;
    } else {
      console.log('Success: workspace.workspaces table exists.');
    }
  } catch (err: any) {
    console.error('Database query failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

verifySchema();
