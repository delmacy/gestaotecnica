import { initializePlatformKernel } from "../platform";
import { runAction } from "../platform/actions";
import { resolveWorkspaceContext } from "../platform/workspace";

async function testGoldenCycle() {
  console.log("--- Iniciando Teste do Ciclo de Ouro ---");

  // 1. Inicializar Kernel
  initializePlatformKernel();

  // 2. Resolver Contexto
  const context = await resolveWorkspaceContext({
    workspaceKey: "system-builder",
    source: "system",
  });

  console.log(`Contexto resolvido: ${context.workspaceKey} (${context.correlationId})`);

  // 3. Executar Action que dispara o ciclo
  // Primeiro criamos uma execucao (precisamos de um ID válido para completar)
  // Como não temos banco garantido aqui, este script servirá para validar a fiação.

  console.log("Executando: service_orders.create...");
  const createResult = await runAction("service_orders.create", {
    title: "Execucao Teste Ciclo de Ouro",
    type: "manutencao"
  }, context);

  if (!createResult.success) {
    console.error("Falha ao criar execucao:", createResult.error);
    return;
  }

  const serviceOrderId = (createResult.data as { id: string }).id;
  console.log(`Execucao criada: ${serviceOrderId}`);

  // 4. Completar a execucao para disparar o Flow
  console.log("Executando: service_orders.complete (isso deve disparar o Flow)...");
  const completeResult = await runAction("service_orders.complete", {
    serviceOrderId,
    conclusion: "Teste de ciclo completo"
  }, context);

  if (!completeResult.success) {
    console.error("Falha ao completar execucao:", completeResult.error);
    return;
  }

  console.log("Execucao completada com sucesso.");
  console.log("Verifique os logs acima para mensagens de [notifications.send] disparadas pelo Flow.");
  console.log("--- Teste Concluído ---");
}

testGoldenCycle().catch(console.error);
