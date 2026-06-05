import type { RuntimeDb } from "./runtime.repository";
import {
  getProcessInstanceById,
  updateActionExecutionStatus,
  insertActionExecution,
  getActionExecutionById,
  updateProcessInstanceStatus
} from "./runtime.repository";
import { advanceStepInputSchema } from "./runtime.validation";
import type { AdvanceStepInput, AdvanceStepResult } from "./runtime.types";
import type { RuntimeResult } from "./runtime.errors";

// Imports limitados da definitions boundary apenas para path-finding e reading
import { getProcessVersionById } from "../definitions/process-definition.queries";

// Helper defension against dynamic object formats
function extractNodesAndEdges(definitionJson: any) {
  const nodes = definitionJson?.nodes || definitionJson?.draft?.nodes || [];
  const edges = definitionJson?.edges || definitionJson?.draft?.edges || [];
  return { nodes, edges };
}

export async function advanceStep(
  db: RuntimeDb,
  input: AdvanceStepInput
): Promise<RuntimeResult<AdvanceStepResult>> {
  try {
    // 1. Validation
    const parseResult = advanceStepInputSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Input de avanço de step inválido.",
        },
      };
    }

    const {
      workspaceId,
      processInstanceId,
      actionExecutionId,
      actionKey,
      output,
      status
    } = parseResult.data;

    // We must have an execution id to advance it accurately, we expect it for precise advancement
    // even though the schema is relaxed to allow actionKey. Let's stick with actionExecutionId.
    if (!actionExecutionId) {
      return {
        ok: false,
        error: { code: "INVALID_INPUT", message: "actionExecutionId is strictly required for this linear engine implementation." }
      };
    }

    // 2. Load Process Instance
    const instance = await getProcessInstanceById(db, workspaceId, processInstanceId);
    if (!instance) {
      return {
        ok: false,
        error: { code: "INSTANCE_NOT_FOUND", message: "A instância referenciada não foi encontrada ou não pertence a este tenant." }
      };
    }

    if (instance.status !== "active") {
      return {
        ok: false,
        error: { code: "INVALID_INPUT", message: "A instância já não está mais ativa." }
      };
    }

    // 3. Complete the current Step (Action Execution)
    const currentStatus = status || "completed";
    await updateActionExecutionStatus(db, {
      workspaceId,
      instanceId: processInstanceId,
      actionExecutionId: actionExecutionId,
      status: currentStatus,
      outputPayload: output,
      finishedAt: new Date(),
    });

    // 4. Load Definition for Path-Finding
    const version = await getProcessVersionById(db as any, instance.processVersionId);
    if (!version || !version.definition) {
      return {
        ok: false,
        error: { code: "INVALID_PROCESS_DEFINITION", message: "Definição do processo ausente ou falha de query." }
      };
    }

    const { nodes, edges } = extractNodesAndEdges(version.definition);

    // 5. Derive actionKey if missing, needed for Path Finding
    let currentActionKey = actionKey;
    if (!currentActionKey) {
      const executionRecord = await getActionExecutionById(db, workspaceId, actionExecutionId);
      if (!executionRecord) {
        return {
          ok: false,
          error: { code: "INVALID_INPUT", message: "Não foi possível derivar a actionKey. Execução não encontrada." }
        };
      }
      currentActionKey = executionRecord.actionKey;
    }

    // 6. Path Finding (Simple linear path)
    const outgoingEdges = edges.filter((e: any) => e.source === currentActionKey);

    if (outgoingEdges.length === 0) {
      // Reached End or terminal node
      await updateProcessInstanceStatus(db, workspaceId, processInstanceId, "completed");
      return {
        ok: true,
        data: {
          executionId: actionExecutionId,
          instanceId: processInstanceId,
          status: "completed"
        }
      };
    }

    // Path Finding - taking first edge only for this simple linear engine (no branches)
    const nextEdge = outgoingEdges[0];
    const nextNodeId = nextEdge.target;

    const nextNode = nodes.find((n: any) => n.id === nextNodeId);
    if (!nextNode) {
      return {
        ok: false,
        error: { code: "INVALID_PROCESS_DEFINITION", message: "O nó alvo da aresta não existe no diagrama." }
      };
    }

    if (nextNode.type === "end") {
      // Next node is explicitly the end block. We can just complete the process.
      await updateProcessInstanceStatus(db, workspaceId, processInstanceId, "completed");
      return {
        ok: true,
        data: {
          executionId: actionExecutionId,
          instanceId: processInstanceId,
          status: "completed" // indicates the entire path closed gracefully
        }
      };
    }

    // 6. Create Next Step as active (pending/running)
    const newActionExecution = await insertActionExecution(db, {
      workspaceId,
      instanceId: processInstanceId,
      actionKey: nextNodeId,
      status: "pending",
      // inputPayload remains empty by default, the next operator must supply it
    });

    return {
      ok: true,
      data: {
        executionId: newActionExecution.id,
        instanceId: processInstanceId,
        status: newActionExecution.status
      }
    };

  } catch (_error) {
    return {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Falha síncrona não tratada no Runtime Step Service." }
    };
  }
}
