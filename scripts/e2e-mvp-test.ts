import { initializePlatformKernel } from "../src/platform/kernel";
import { runAction } from "../src/platform/actions";
import { emitEvent } from "../src/platform/events";
import { getRuntimeDb } from "../src/db";
import { organizations, workspaces } from "../src/db/runtime/schema/workspace";
import { flowDefinitions, events } from "../src/db/runtime/schema/workflow";
import { entityDefinitions, dynamicRecords } from "../src/db/runtime/schema/workspace";
import { flowRuns } from "../src/db/schema";
import { eq, and } from "drizzle-orm";

async function runE2E() {
  console.log("🚀 Iniciando Teste E2E: System Builder MVP");
  initializePlatformKernel();
  const db = getRuntimeDb();

  // 1. Criar Organização
  console.log("\n1. Criando Organização...");
  const orgRes = await runAction("organizations.create", {
    key: "e2e-org-" + Date.now(),
    name: "E2E Organization"
  }, { source: "system", enabledModules: ["workspace"] });
  if (!orgRes.success) {
    console.error("Org Error:", orgRes.error);
    throw new Error("Falha ao criar organização");
  }
  const orgId = (orgRes.data as any).id;
  console.log("✅ Organização criada:", orgId);

  // 2. Criar Workspace
  console.log("\n2. Criando Workspace...");
  const wsRes = await runAction("workspaces.create", {
    organizationId: orgId,
    key: "e2e-ws",
    name: "E2E Workspace"
  }, { source: "system", enabledModules: ["workspace"] });
  if (!wsRes.success) throw new Error("Falha ao criar workspace");
  const workspaceId = (wsRes.data as any).id;
  console.log("✅ Workspace criado:", workspaceId);

  // 3. Instalar Capability (Work Items)
  console.log("\n3. Instalando Capability: work-items...");
  const capRes = await runAction("workspaces.install_capability", {
    workspaceId,
    capabilityKey: "work-items",
    name: "Gestão de Demandas"
  }, { source: "system", enabledModules: ["workspace"] });
  if (!capRes.success) throw new Error("Falha ao instalar capability");
  console.log("✅ Capability instalada.");

  // 4. Criar e Publicar Flow via UI Definition
  console.log("\n4. Criando e Publicando Flow de Automação...");
  const flowKey = "e2e-auto-flow";
  const flowDef = {
    nodes: [
      { id: "trigger", type: "flow", data: { label: "work_item.created", type: "event" } },
      { id: "action", type: "flow", data: { label: "notifications.send", type: "action" } }
    ],
    edges: [
      { id: "e1", source: "trigger", target: "action" }
    ]
  };

  await runAction("flows.save_definition", {
    workspaceId,
    key: flowKey,
    name: "E2E Auto Flow",
    definition: flowDef
  }, { source: "system", workspaceId, enabledModules: ["workflow"] });

  await runAction("flows.publish", {
    workspaceId,
    key: flowKey
  }, { source: "system", workspaceId, enabledModules: ["workflow"] });
  console.log("✅ Flow criado e publicado.");

  // 5. Criar Entidade Dinâmica (Chamados)
  console.log("\n5. Criando Entidade: Chamados...");
  const entRes = await runAction("entities.create", {
    workspaceId,
    key: "chamado",
    name: "Chamado Técnico",
    fields: [
      { key: "titulo", name: "Título", type: "text" },
      { key: "status", name: "Status", type: "text" }
    ]
  }, { source: "system", enabledModules: ["workspace"] });
  if (!entRes.success) throw new Error("Falha ao criar entidade");
  console.log("✅ Entidade criada.");

  // 6. Salvar Registro Dinâmico
  console.log("\n6. Salvando Registro Dinâmico...");
  const recRes = await runAction("records.save", {
    workspaceId,
    entityKey: "chamado",
    data: { titulo: "Teste E2E", status: "Aberto" }
  }, { source: "system", enabledModules: ["workspace"] });
  if (!recRes.success) throw new Error("Falha ao salvar registro");
  console.log("✅ Registro salvo.");

  // 7. Simular Evento (work_item.created)
  console.log("\n5. Emitindo evento: work_item.created...");
  const context = {
    workspaceId,
    enabledModules: ["work-items", "workflow", "notifications"],
    source: "ui",
    correlationId: "e2e-corr-id"
  };

  // Note: emitEvent will trigger flow execution via outbox/FlowRunner
  await emitEvent("work_item.created", {
    title: "E2E Test Item",
    priority: "high"
  }, context);
  console.log("✅ Evento emitido.");

  // 6. Verificar Execução do Flow no Banco
  console.log("\n6. Verificando execução do flow...");
  // Aguarda um pouco para processamento assíncrono (embora no momento pareça síncrono no outbox)
  await new Promise(resolve => setTimeout(resolve, 2000));

  const runs = await db.select().from(flowRuns).where(eq(flowRuns.workspaceId, workspaceId));
  if (runs.length > 0) {
    console.log("✅ Flow Run encontrado!");
    console.log(JSON.stringify(runs[0], null, 2));
  } else {
    console.log("❌ Nenhum Flow Run encontrado para este workspace.");
  }

  console.log("\n🏁 Teste E2E Finalizado.");
}

runE2E().catch(err => {
  console.error("\n❌ Erro no Teste E2E:", err);
  process.exit(1);
});
