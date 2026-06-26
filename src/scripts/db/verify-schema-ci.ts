import postgres from "postgres";

async function verifySchema() {
  const dbUrl = process.env.DATABASE_URL || process.env.PLATFORM_DATABASE_URL || process.env.RUNTIME_DATABASE_URL;
  if (!dbUrl) {
    console.error("ERRO: DATABASE_URL, PLATFORM_DATABASE_URL ou RUNTIME_DATABASE_URL is not set.");
    process.exitCode = 1;
    return;
  }

  const client = postgres(dbUrl, { max: 1 });
  let exitCode = 0;

  try {
    const agentGatewayResult = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'builder'
        AND table_name = 'agent_gateway_submissions'
      );
    `;
    const isAgentGatewayPresent = agentGatewayResult[0]?.exists === true;

    const workspacesResult = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'workspace'
        AND table_name = 'workspaces'
      );
    `;
    const isWorkspacesPresent = workspacesResult[0]?.exists === true;

    if (!isAgentGatewayPresent || !isWorkspacesPresent) {
      console.error("ERRO: Algumas tabelas obrigatorias estao faltando!");
      console.error(`- builder.agent_gateway_submissions: ${isAgentGatewayPresent}`);
      console.error(`- workspace.workspaces: ${isWorkspacesPresent}`);
      exitCode = 1;
    } else {
      console.log("SUCESSO: Todas as tabelas obrigatorias estao presentes.");
    }
  } catch (error) {
    console.error("ERRO ao verificar schema:", error);
    exitCode = 1;
  } finally {
    await client.end({ timeout: 5 });
    process.exitCode = exitCode;
  }
}

verifySchema();
