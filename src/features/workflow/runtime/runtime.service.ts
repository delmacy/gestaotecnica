import type { RuntimeDb } from "./runtime.repository";
import { insertProcessInstance, insertProcessPayload } from "./runtime.repository";
import { getProcessVersionById } from "../definitions/process-definition.queries";
import { startProcessInstanceInputSchema } from "./runtime.validation";
import type { StartProcessInstanceInput, ProcessInstanceRecord } from "./runtime.types";
import type { RuntimeResult } from "./runtime.errors";
import { logEvent } from "./events";

export async function startProcessInstance(
  db: RuntimeDb,
  input: StartProcessInstanceInput
): Promise<RuntimeResult<ProcessInstanceRecord>> {
  try {
    const parseResult = startProcessInstanceInputSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Parâmetros inválidos para iniciar a instância."
        }
      };
    }

    const { workspaceId, processVersionId, createdById, initialPayload } = parseResult.data;

    // 1. Verificar a versão do processo
    // Necessário cast para "any" no db apenas para compatibilizar a injeção caso o type vaze Drizzle
    const version = await getProcessVersionById(db as any, processVersionId);
    if (!version) {
      return {
        ok: false,
        error: { code: "PROCESS_VERSION_NOT_FOUND", message: "Versão de processo não encontrada." }
      };
    }

    if (version.status !== "published") {
      return {
        ok: false,
        error: { code: "PROCESS_VERSION_NOT_PUBLISHED", message: "Apenas versões publicadas podem ser instanciadas." }
      };
    }

    // 2. Criar a instância
    const instance = await insertProcessInstance(db, {
      workspaceId,
      processVersionId,
      createdById,
      status: "active"
    });

    // 3. Criar payload associado (se necessário / enviado)
    if (initialPayload && Object.keys(initialPayload).length > 0) {
      await insertProcessPayload(db, {
        instanceId: instance.id,
        workspaceId,
        data: initialPayload
      });
    }

    // 4. Registrar Evento de Início de Processo
    await logEvent(db as any, {
      workspaceId,
      instanceId: instance.id,
      eventType: "process.started",
      entityType: "process_instance",
      entityId: instance.id,
      actorType: createdById ? "user" : "system",
      actorId: createdById || undefined,
      payload: initialPayload || {},
    });

    return {
      ok: true,
      data: instance
    };
  } catch (_error) {
    return {
      ok: false,
      error: { code: "INTERNAL_ERROR", message: "Erro inesperado ao criar instância." }
    };
  }
}
