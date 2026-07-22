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

export interface DiagnosticResult {
  success: boolean;
  isSynthetic: boolean;
  hasDbUrl: boolean;
  canConnect: boolean;
  missingSchemas: string[];
  isSuperuser: boolean;
  hasCreatePrivilege: boolean;
  violatedSchemas: string[];
  setupComplete: boolean;
  errorMessage?: string;
}

export async function runAuthDiagnostics(): Promise<DiagnosticResult> {
  const runtimeDbUrl = process.env.RUNTIME_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;
  const dbUrl = runtimeDbUrl || databaseUrl;

  const isSynthetic = !runtimeDbUrl || runtimeDbUrl === databaseUrl || runtimeDbUrl === process.env.PLATFORM_DATABASE_URL;

  if (!dbUrl) {
    return {
      success: false,
      isSynthetic,
      hasDbUrl: false,
      canConnect: false,
      missingSchemas: [],
      isSuperuser: false,
      hasCreatePrivilege: false,
      violatedSchemas: [],
      setupComplete: false,
      errorMessage: "RUNTIME_DATABASE_URL ou DATABASE_URL não está configurada no ambiente.",
    };
  }

  let sql: postgres.Sql | null = null;
  try {
    sql = postgres(dbUrl, { max: 1, connect_timeout: 3 });

    // 1. Connection check
    const connCheck = await sql`SELECT 1 as connected`;
    if (connCheck.length === 0 || connCheck[0]["connected"] !== 1) {
      throw new Error("Resposta inesperada do banco de dados.");
    }

    // 2. Schema check
    const schemasRes = await sql`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = ANY(${REQUIRED_SCHEMAS})
    `;
    const foundSchemas = schemasRes.map((r: postgres.Row) => String(r["schema_name"]));
    const missingSchemas = REQUIRED_SCHEMAS.filter((s) => !foundSchemas.includes(s));

    // 3. Superuser check
    const [userRow] = await sql`SELECT current_user`;
    const currentUser = String(userRow["current_user"]);

    const [roleRow] = await sql`
      SELECT rolsuper
      FROM pg_roles
      WHERE rolname = ${currentUser}
    `;
    const isSuperuser = roleRow ? Boolean(roleRow["rolsuper"]) : false;

    // 4. Create privileges check (least-privilege)
    const schemasToCheck = REQUIRED_SCHEMAS.filter((s) => s !== "public");
    const violatedSchemas: string[] = [];
    for (const schema of schemasToCheck) {
      const [privRow] = await sql`
        SELECT has_schema_privilege(${currentUser}, ${schema}, 'CREATE') as can_create
      `;
      if (privRow && privRow["can_create"]) {
        violatedSchemas.push(schema);
      }
    }
    const hasCreatePrivilege = violatedSchemas.length > 0;

    // 5. Setup complete check (check if auth_accounts table exists first, then if records are present)
    const tablesRes = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'auth_accounts'
    `;
    let setupComplete = false;
    if (tablesRes.length > 0) {
      const accountsCountRes = await sql`
        SELECT id FROM auth_accounts LIMIT 1
      `;
      setupComplete = accountsCountRes.length > 0;
    }

    return {
      success: true,
      isSynthetic,
      hasDbUrl: true,
      canConnect: true,
      missingSchemas,
      isSuperuser,
      hasCreatePrivilege,
      violatedSchemas,
      setupComplete,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const sanitizedMsg = errorMsg
      .replace(/postgres:\/\/[^@]+@/, "postgres://****@")
      .replace(/postgresql:\/\/[^@]+@/, "postgresql://****@");

    return {
      success: false,
      isSynthetic,
      hasDbUrl: true,
      canConnect: false,
      missingSchemas: [],
      isSuperuser: false,
      hasCreatePrivilege: false,
      violatedSchemas: [],
      setupComplete: false,
      errorMessage: `Erro ao conectar/consultar o banco de dados: ${sanitizedMsg}`,
    };
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}
