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

  // 5. Testar Action de Ativos
  console.log("3. Testando Módulo de Ativos...");
  const assetResult = await runAction("assets.create", {
    code: `AST-${Date.now()}`,
    name: "Ativo de Teste Integridade",
    type: "equipment"
  }, context);
  if (!assetResult.success) throw new Error("Falha na Action assets.create");
  const assetId = (assetResult.data as { id: string }).id;
  console.log(`   OK: Ativo ${assetId} criado.`);

  const updateAssetResult = await runAction("assets.update_status", {
    assetId,
    status: "maintenance",
    note: "Teste de integridade"
  }, context);
  if (!updateAssetResult.success) {
    console.error("Erro na Action assets.update_status:", updateAssetResult.error);
    throw new Error("Falha na Action assets.update_status");
  }
  console.log("   OK: Status do ativo atualizado.");

  // 6. Testar Action de Turnos
  console.log("4. Testando Módulo de Turnos...");
  const shiftResult = await runAction("shifts.open", { name: "Turno Teste" }, context);
  if (!shiftResult.success) {
    console.error("Erro na Action shifts.open:", shiftResult.error);
    throw new Error("Falha na Action shifts.open");
  }
  const shiftId = (shiftResult.data as { id: string }).id;
  console.log(`   OK: Turno ${shiftId} aberto.`);

  const entryResult = await runAction("shift_logs.add_entry", {
    shiftId,
    title: "Ocorrência Teste",
    isPending: true
  }, context);
  if (!entryResult.success) throw new Error("Falha na Action shift_logs.add_entry");
  console.log("   OK: Entrada de log adicionada ao turno.");

  console.log("\n--- Integridade Verificada com Sucesso! ---");
}

verifyIntegrity().catch(err => {
  console.error("\n--- FALHA NA VERIFICAÇÃO ---");
  console.error(err);
  process.exit(1);
});
