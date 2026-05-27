import { eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import { eventLogs, flowRuns } from "../db/schema";
import { initializePlatformKernel } from "../platform";
import { runAction } from "../platform/actions";
import { resolveWorkspaceContext } from "../platform/workspace";

async function verifyIntegrity() {
  console.log("--- Verificação de Integridade da Plataforma ---");

  initializePlatformKernel();
  const db = getDb();
  const context = await resolveWorkspaceContext({ source: "system" });

  // 1. Testar Action de Criação de Demanda
  console.log("1. Criando WorkItem via Kernel...");
  const wiResult = await runAction("work_items.create", {
    title: "Verificação de Integridade",
    type: "manutencao",
    autoCreateServiceOrder: true
  }, context);

  if (!wiResult.success) throw new Error("Falha na Action work_items.create");
  const wiId = (wiResult.data as { id: string }).id;
  console.log(`   OK: WorkItem ${wiId} criado.`);

  // 2. Verificar Event Log
  const [event] = await db.select().from(eventLogs).where(eq(eventLogs.entityId, wiId)).orderBy(desc(eventLogs.occurredAt)).limit(1);
  if (!event || event.eventType !== "work_item.created") throw new Error("Evento work_item.created não encontrado.");
  console.log(`   OK: Evento registrado: ${event.eventType}`);

  // 3. Verificar se o Flow de Auto-OS disparou
  // O flow 'work-item-auto-service-order' deve criar uma OS
  console.log("2. Verificando disparo de Flow Automático (Auto-OS)...");

  // Pequeno delay para processamento síncrono/assíncrono
  await new Promise(r => setTimeout(r, 500));

  const [flowRun] = await db.select().from(flowRuns).where(eq(flowRuns.triggerEventType, event.eventType)).orderBy(desc(flowRuns.startedAt)).limit(1);
  if (!flowRun) throw new Error("FlowRun não encontrado para o evento de criação.");
  console.log(`   OK: FlowRun encontrado: ${flowRun.flowKey} (${flowRun.status})`);

  // 4. Verificar se a OS foi criada pela Action disparada pelo Flow
  const [so] = await db.select().from(eventLogs).where(eq(eventLogs.eventType, "service_order.created")).orderBy(desc(eventLogs.occurredAt)).limit(1);
  if (!so || (so.payload as { workItemId: string }).workItemId !== wiId) throw new Error("OS automática não encontrada ou vinculada incorretamente.");
  console.log(`   OK: OS automática criada: ${(so.payload as { code: string }).code}`);

  console.log("\n--- Integridade Verificada com Sucesso! ---");
}

verifyIntegrity().catch(err => {
  console.error("\n--- FALHA NA VERIFICAÇÃO ---");
  console.error(err);
  process.exit(1);
});
