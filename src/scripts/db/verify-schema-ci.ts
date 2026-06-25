import { getPlatformDb, getRuntimeDb, closeDatabaseConnections } from "../../db/index";
import { sql } from "drizzle-orm";

async function verifySchema() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERRO: DATABASE_URL is not set.");
    process.exit(1);
  }

  try {
    const platformDb = getPlatformDb();
    const platformResult = await platformDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'builder'
        AND table_name = 'agent_gateway_submissions'
      );
    `);
    const isAgentGatewayPresent = platformResult[0]?.exists === true;

    const runtimeDb = getRuntimeDb();
    const runtimeResult = await runtimeDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'workspace'
        AND table_name = 'workspaces'
      );
    `);
    const isWorkspacesPresent = runtimeResult[0]?.exists === true;

    if (!isAgentGatewayPresent || !isWorkspacesPresent) {
      console.error("ERRO: Algumas tabelas obrigatorias estao faltando!");
      console.error(`- builder.agent_gateway_submissions: ${isAgentGatewayPresent}`);
      console.error(`- workspace.workspaces: ${isWorkspacesPresent}`);
      process.exit(1);
    }

    console.log("SUCESSO: Todas as tabelas obrigatorias estao presentes.");
    process.exit(0);
  } catch (error) {
    console.error("ERRO ao verificar schema:", error);
    process.exit(1);
  } finally {
    await closeDatabaseConnections();
  }
}

verifySchema();
