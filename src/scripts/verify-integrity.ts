import { eq, desc, and } from "drizzle-orm";
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

  // 7. Testar Fluxo de Governança (Fase 5)
  console.log("5. Testando Governança (OS -> Aprovação -> Documento)...");
  // Assumindo que temos uma OS criada no passo 2: OS automática
  const [lastSO] = await db.select().from(eventLogs).where(eq(eventLogs.eventType, "service_order.created")).orderBy(desc(eventLogs.occurredAt)).limit(1);
  const soId = lastSO.entityId!;

  console.log(`   Completando OS ${soId} para disparar Governança...`);
  await runAction("service_orders.complete", { serviceOrderId: soId, conclusion: "Concluída para governança" }, context);

  // Pequeno delay para flows
  await new Promise(r => setTimeout(r, 1000));

  // Verificar se aprovação foi solicitada pelo flow 'service-order-governance'
  const [approvalRequest] = await db.select().from(eventLogs).where(and(eq(eventLogs.entityId, soId), eq(eventLogs.eventType, "approval.requested"))).limit(1);
  if (!approvalRequest) throw new Error("Flow de governança não solicitou aprovação.");
  console.log("   OK: Aprovação solicitada automaticamente.");

  // Decidir aprovação (Aprovar)
  console.log("   Decidindo aprovação (Aprovar)...");
  await runAction("approvals.decide", { serviceOrderId: soId, decision: "approve", note: "Aprovado no teste" }, context);

  await new Promise(r => setTimeout(r, 1000));

  // Verificar se documento foi gerado pelo flow 'service-order-approved-document'
  const [docEvent] = await db.select().from(eventLogs).where(eq(eventLogs.eventType, "document.generated")).orderBy(desc(eventLogs.occurredAt)).limit(1);
  if (!docEvent || (docEvent.payload as { serviceOrderId: string }).serviceOrderId !== soId) throw new Error("Documento técnico não foi gerado após aprovação.");
  console.log(`   OK: Documento gerado automaticamente: ${(docEvent.payload as { title: string }).title}`);

  // 8. Testar Módulo de Planejamento (Fase 6)
  console.log("6. Testando Planejamento (Planos de Manutenção)...");
  const planResult = await runAction("maintenance_plans.create", {
    title: "Plano Preventiva Ar-Condicionado",
    objective: "Limpeza mensal dos filtros."
  }, context);
  if (!planResult.success) throw new Error("Falha na Action maintenance_plans.create");
  const planId = (planResult.data as { id: string }).id;
  console.log(`   OK: Plano de manutenção ${planId} criado.`);

  // Verificar se a OS preventiva foi gerada pelo flow 'periodic-maintenance-generator'
  await new Promise(r => setTimeout(r, 1000));
  const [prevSO] = await db.select().from(eventLogs).where(eq(eventLogs.eventType, "maintenance_plan.order_generated")).orderBy(desc(eventLogs.occurredAt)).limit(1);
  if (!prevSO || prevSO.entityId !== planId) throw new Error("OS preventiva automática não foi gerada.");
  console.log(`   OK: OS preventiva gerada automaticamente: ${(prevSO.payload as { code: string }).code}`);

  console.log("\n--- Integridade Verificada com Sucesso! ---");
}

verifyIntegrity().catch(err => {
  console.error("\n--- FALHA NA VERIFICAÇÃO ---");
  console.error(err);
  process.exit(1);
});
