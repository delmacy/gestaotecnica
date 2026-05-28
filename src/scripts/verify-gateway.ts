import { POST } from "../app/api/integrations/commands/route";
import { getDb } from "../db";
import { integrationCommands } from "../db/schema";
import { eq } from "drizzle-orm";

async function verifyGateway() {
  console.log("--- Verificação do Integration Command Gateway ---");

  // 1. Configurar API Key para o teste
  const TEST_KEY = "test-integration-key-123";
  process.env.GESTAOTECNICA_API_KEY = TEST_KEY;

  const createRequest = (body: Record<string, unknown>, key?: string) => {
    return new Request("http://localhost/api/integrations/commands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { "x-gestaotecnica-api-key": key } : {}),
      },
      body: JSON.stringify(body),
    });
  };

  // 2. Testar Não Autorizado
  console.log("1. Testando chamada sem API Key...");
  const reqUnauth = createRequest({ command: "work_items.create" });
  const resUnauth = await POST(reqUnauth);
  if (resUnauth.status !== 401) throw new Error(`Deveria retornar 401, retornou ${resUnauth.status}`);
  console.log("   OK: Retornou 401.");

  // 3. Testar Comando Válido
  console.log("2. Testando comando válido com API Key...");
  const idempotencyKey = `idemp-${Date.now()}`;
  const payload = {
    title: "Demanda via Gateway",
    description: "Criada pelo teste de integração",
    type: "incidente"
  };

  const reqValid = createRequest({
    command: "work_items.create",
    idempotencyKey,
    payload
  }, TEST_KEY);

  const resValid = await POST(reqValid);
  const dataValid = await resValid.json();

  if (resValid.status !== 200 || !dataValid.success) {
    console.error("Erro no Gateway:", dataValid);
    throw new Error("Falha ao processar comando válido.");
  }
  console.log(`   OK: Comando processado. CorrelationId: ${dataValid.correlationId}`);

  // 4. Testar Idempotência
  console.log("3. Testando idempotência...");
  const reqIdemp = createRequest({
    command: "work_items.create",
    idempotencyKey,
    payload
  }, TEST_KEY);

  const resIdemp = await POST(reqIdemp);
  const dataIdemp = await resIdemp.json();

  if (dataIdemp.correlationId !== dataValid.correlationId) {
    throw new Error("Falha na idempotência: CorrelationId diferente.");
  }
  console.log("   OK: Idempotência funcionou (mesmo CorrelationId retornado).");

  // 5. Verificar Persistência
  console.log("4. Verificando persistência no banco...");
  const db = getDb();
  const [persisted] = await db.select().from(integrationCommands).where(eq(integrationCommands.idempotencyKey, idempotencyKey)).limit(1);

  if (!persisted || persisted.status !== "succeeded") {
    throw new Error("Comando não persistido corretamente no banco.");
  }
  console.log(`   OK: Comando persistido com status: ${persisted.status}`);

  console.log("\n--- Gateway Verificado com Sucesso! ---");
}

verifyGateway().catch(err => {
  console.error("\n--- FALHA NA VERIFICAÇÃO DO GATEWAY ---");
  console.error(err);
  process.exit(1);
});
