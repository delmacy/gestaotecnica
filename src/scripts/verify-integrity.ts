import { eq, desc, and, inArray } from "drizzle-orm";
import { getDb } from "../db";
import * as schema from "../db/schema";
import { initializePlatformKernel } from "../platform";
import { runAction } from "../platform/actions";
import { resolveWorkspaceContext } from "../platform/workspace";

async function verifyIntegrity() {
  const testIds: { [key: string]: string[] } = {
    workItems: [],
    serviceOrders: [],
    assets: [],
    shifts: [],
    maintenancePlans: [],
    documents: [],
  };

  console.log("--- Verificação de Integridade da Plataforma ---");

  initializePlatformKernel();
  const db = getDb();
  const context = await resolveWorkspaceContext({ source: "system" });

  try {
    // 1. Testar Action de Criação de Demanda
    console.log("1. Criando WorkItem via Kernel...");
    const wiResult = await runAction("work_items.create", {
      title: "Verificação de Integridade",
      type: "manutencao",
      autoCreateServiceOrder: true
    }, context);

    if (!wiResult.success) throw new Error("Falha na Action work_items.create");
    const wiId = (wiResult.data as { id: string }).id;
    testIds.workItems.push(wiId);
    console.log(`   OK: WorkItem ${wiId} criado.`);

    // 2. Verificar Event Log
    const [event] = await db.select().from(schema.eventLogs).where(eq(schema.eventLogs.entityId, wiId)).orderBy(desc(schema.eventLogs.occurredAt)).limit(1);
    if (!event || event.eventType !== "work_item.created") throw new Error("Evento work_item.created não encontrado.");
    console.log(`   OK: Evento registrado: ${event.eventType}`);

    // 3. Verificar se o Flow de Auto-execucao disparou
    console.log("2. Verificando disparo de Flow Automático (Auto-execucao)...");

    await new Promise(r => setTimeout(r, 500));

    const [flowRun] = await db.select().from(schema.flowRuns).where(eq(schema.flowRuns.triggerEventType, event.eventType)).orderBy(desc(schema.flowRuns.startedAt)).limit(1);
    if (!flowRun) throw new Error("FlowRun não encontrado para o evento de criação.");
    console.log(`   OK: FlowRun encontrado: ${flowRun.flowKey} (${flowRun.status})`);

    // 4. Verificar se a execucao foi criada pela Action disparada pelo Flow
    const [so] = await db.select().from(schema.eventLogs).where(eq(schema.eventLogs.eventType, "service_order.created")).orderBy(desc(schema.eventLogs.occurredAt)).limit(1);
    if (!so || (so.payload as { workItemId: string }).workItemId !== wiId) throw new Error("execucao automática não encontrada ou vinculada incorretamente.");
    testIds.serviceOrders.push(so.entityId!);
    console.log(`   OK: execucao automática criada: ${(so.payload as { code: string }).code}`);

    // 5. Testar Action de Ativos
    console.log("3. Testando Módulo de Ativos...");
    const assetResult = await runAction("assets.create", {
      code: `AST-${Date.now()}`,
      name: "Ativo de Teste Integridade",
      type: "equipment"
    }, context);
    if (!assetResult.success) throw new Error("Falha na Action assets.create");
    const assetId = (assetResult.data as { id: string }).id;
    testIds.assets.push(assetId);
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
    testIds.shifts.push(shiftId);
    console.log(`   OK: Turno ${shiftId} aberto.`);

    const entryResult = await runAction("shift_logs.add_entry", {
      shiftId,
      title: "Ocorrência Teste",
      isPending: true
    }, context);
    if (!entryResult.success) throw new Error("Falha na Action shift_logs.add_entry");
    console.log("   OK: Entrada de log adicionada ao turno.");

    // 7. Testar Fluxo de Governança (Fase 5)
    console.log("5. Testando Governança (execucao -> Aprovação -> Documento)...");
    const soId = so.entityId!;

    console.log(`   Completando execucao ${soId} para disparar Governança...`);
    await runAction("service_orders.complete", { serviceOrderId: soId, conclusion: "Concluída para governança" }, context);

    await new Promise(r => setTimeout(r, 1000));

    const [approvalRequest] = await db.select().from(schema.eventLogs).where(and(eq(schema.eventLogs.entityId, soId), eq(schema.eventLogs.eventType, "approval.requested"))).limit(1);
    if (!approvalRequest) throw new Error("Flow de governança não solicitou aprovação.");
    console.log("   OK: Aprovação solicitada automaticamente.");

    console.log("   Decidindo aprovação (Aprovar)...");
    await runAction("approvals.decide", { serviceOrderId: soId, decision: "approve", note: "Aprovado no teste" }, context);

    await new Promise(r => setTimeout(r, 1000));

    const [docEvent] = await db.select().from(schema.eventLogs).where(eq(schema.eventLogs.eventType, "document.generated")).orderBy(desc(schema.eventLogs.occurredAt)).limit(1);
    if (!docEvent || (docEvent.payload as { serviceOrderId: string }).serviceOrderId !== soId) throw new Error("Documento operacional não foi gerado após aprovação.");
    testIds.documents.push(docEvent.entityId!);
    console.log(`   OK: Documento gerado automaticamente: ${(docEvent.payload as { title: string }).title}`);

    // 8. Testar Módulo de Planejamento (Fase 6)
    console.log("6. Testando Planejamento (Planos de Manutenção)...");
    const planResult = await runAction("maintenance_plans.create", {
      title: "Plano Preventiva Ar-Condicionado",
      objective: "Limpeza mensal dos filtros."
    }, context);
    if (!planResult.success) throw new Error("Falha na Action maintenance_plans.create");
    const planId = (planResult.data as { id: string }).id;
    testIds.maintenancePlans.push(planId);
    console.log(`   OK: Plano de manutenção ${planId} criado.`);

    await new Promise(r => setTimeout(r, 1000));
    const [prevSO] = await db.select().from(schema.eventLogs).where(eq(schema.eventLogs.eventType, "maintenance_plan.order_generated")).orderBy(desc(schema.eventLogs.occurredAt)).limit(1);
    if (!prevSO || prevSO.entityId !== planId) throw new Error("execucao preventiva automática não foi gerada.");
    testIds.serviceOrders.push((prevSO.payload as { serviceOrderId: string }).serviceOrderId);
    console.log(`   OK: execucao preventiva gerada automaticamente: ${(prevSO.payload as { code: string }).code}`);

    // 9. Testar Módulo de Inventário (Fase 7)
    console.log("7. Testando Inventário (Ajuste de Estoque)...");
    const [invItem] = await db.insert(schema.inventoryItems).values({
      sku: `SKU-${Date.now()}`,
      name: "Cabo de Fibra Teste",
      quantityOnHand: 100,
    }).returning();

    const stockResult = await runAction("inventory.adjust_stock", {
      itemId: invItem.id,
      movementType: "outbound",
      quantity: 5,
      notes: "Retirada teste integridade"
    }, context);
    if (!stockResult.success) {
      console.error("Erro no ajuste de estoque:", stockResult.error);
      throw new Error("Falha na Action inventory.adjust_stock");
    }
    console.log(`   OK: Estoque ajustado. Novo saldo: ${(stockResult.data as { newQuantity: number }).newQuantity}`);

    // Limpeza imediata do item de inventário
    await db.delete(schema.inventoryMovements).where(eq(schema.inventoryMovements.itemId, invItem.id));
    await db.delete(schema.inventoryItems).where(eq(schema.inventoryItems.id, invItem.id));

    console.log("\n--- Integridade Verificada com Sucesso! ---");
  } finally {
    console.log("\n--- Realizando Limpeza (Cleanup) ---");
    // Limpar outbox e flow runs primeiro
    await db.delete(schema.flowActionRuns);
    await db.delete(schema.flowRuns);
    await db.delete(schema.outboxEvents);

    // Limpar logs vinculados aos IDs de teste
    if (testIds.serviceOrders.length) {
      await db.delete(schema.eventLogs).where(inArray(schema.eventLogs.serviceOrderId, testIds.serviceOrders));
    }
    if (testIds.workItems.length) {
      await db.delete(schema.eventLogs).where(inArray(schema.eventLogs.workItemId, testIds.workItems));
    }
    if (testIds.assets.length) {
      await db.delete(schema.eventLogs).where(inArray(schema.eventLogs.assetId, testIds.assets));
    }

    if (testIds.documents.length) await db.delete(schema.technicalDocuments).where(inArray(schema.technicalDocuments.id, testIds.documents));
    if (testIds.serviceOrders.length) {
      await db.delete(schema.serviceOrderAssignments).where(inArray(schema.serviceOrderAssignments.serviceOrderId, testIds.serviceOrders));
      await db.delete(schema.serviceOrderTasks).where(inArray(schema.serviceOrderTasks.serviceOrderId, testIds.serviceOrders));
      await db.delete(schema.serviceOrderStages).where(inArray(schema.serviceOrderStages.serviceOrderId, testIds.serviceOrders));
      await db.delete(schema.serviceOrders).where(inArray(schema.serviceOrders.id, testIds.serviceOrders));
    }
    if (testIds.workItems.length) await db.delete(schema.workItems).where(inArray(schema.workItems.id, testIds.workItems));
    if (testIds.maintenancePlans.length) await db.delete(schema.maintenancePlans).where(inArray(schema.maintenancePlans.id, testIds.maintenancePlans));
    if (testIds.shifts.length) {
      await db.delete(schema.shiftLogEntries).where(inArray(schema.shiftLogEntries.shiftId, testIds.shifts));
      await db.delete(schema.shifts).where(inArray(schema.shifts.id, testIds.shifts));
    }
    if (testIds.assets.length) await db.delete(schema.assets).where(inArray(schema.assets.id, testIds.assets));

    console.log("   Cleanup finalizado.");
  }
}

verifyIntegrity().catch(err => {
  console.error("\n--- FALHA NA VERIFICAÇÃO ---");
  console.error(err);
  process.exit(1);
});
