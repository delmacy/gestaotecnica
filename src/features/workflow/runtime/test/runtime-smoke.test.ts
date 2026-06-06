import { startProcessInstance } from "../runtime.service";
import { advanceStep } from "../runtime-step.service";

/**
 * Este arquivo funciona como um documento vivo para Smoke Test de integração,
 * demonstrando como inicializar e avançar uma instância de forma programática.
 *
 * Por restrições de ambiente isolado (não possuímos banco subido nos tests unitários agora),
 * não usamos jest/vitest, mas documentamos a interface End to End esperada.
 */
export async function runRuntimeSmokeTest(mockDb: any) {
  const workspaceId = "test-workspace-id";
  const processVersionId = "mocked-version-id";

  // 1. Instanciar o processo
  const startResult = await startProcessInstance(mockDb, {
    workspaceId,
    processVersionId,
    initialPayload: { testing: true },
  });

  if (!startResult.ok) {
    throw new Error("Falha ao iniciar instância: " + startResult.error.message);
  }

  const instanceId = startResult.data.id;

  // 2. Simular a busca pelo active step (como feito na Server Action)
  // No mundo real, db seria injetado. Aqui simulamos o output do repositório
  const mockExecutionId = "step-1-execution-id";

  // 3. Avançar a etapa
  const advanceResult = await advanceStep(mockDb, {
    workspaceId,
    processInstanceId: instanceId,
    actionExecutionId: mockExecutionId,
    actionKey: "start_node_key",
    status: "completed",
    output: { result: "success" }
  });

  if (!advanceResult.ok) {
     throw new Error("Falha ao avançar etapa: " + advanceResult.error.message);
  }

  return {
    success: true,
    finalStatus: advanceResult.data.status,
    instanceId
  };
}
