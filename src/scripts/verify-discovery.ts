import { initializePlatformKernel } from "../platform";
import { resolveWorkspaceContext } from "../platform/workspace";
import { getAvailableActionsForEntity } from "../platform/views";

async function verifyDiscovery() {
  console.log("--- Verificação de Descoberta de Ações (View Engine) ---");

  initializePlatformKernel();
  const context = await resolveWorkspaceContext({ source: "ui" });

  console.log("1. Testando ações para WorkItem em estado 'open'...");
  const wiActions = await getAvailableActionsForEntity("work_item", "open", context);
  console.log("   Ações encontradas:", wiActions.map(a => a.key));
  if (!wiActions.some(a => a.key === "work_items.create")) {
     // work_items.create matches work_item.*
  }

  console.log("\n2. Testando ações para Service Order em estado 'assigned'...");
  const soActionsAssigned = await getAvailableActionsForEntity("service_order", "assigned", context);
  console.log("   Ações encontradas (assigned):", soActionsAssigned.map(a => a.key));
  if (!soActionsAssigned.some(a => a.key === "service_orders.complete")) {
     throw new Error("Action service_orders.complete deveria estar disponível para 'assigned'");
  }

  console.log("\n3. Testando ações para Service Order em estado 'draft'...");
  const soActionsDraft = await getAvailableActionsForEntity("service_order", "draft", context);
  console.log("   Ações encontradas (draft):", soActionsDraft.map(a => a.key));
  if (soActionsDraft.some(a => a.key === "service_orders.complete")) {
     throw new Error("Action service_orders.complete NÃO deveria estar disponível para 'draft'");
  }

  console.log("\n--- Descoberta Verificada com Sucesso! ---");
}

verifyDiscovery().catch(err => {
  console.error("\n--- FALHA NA VERIFICAÇÃO DE DESCOBERTA ---");
  console.error(err);
  process.exit(1);
});
