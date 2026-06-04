import type { ProcessDefinitionDb } from "./process-definition.repository";
import { createProcessDefinition } from "./process-definition.service";
import { listProcessDefinitions, getProcessDefinitionById } from "./process-definition.queries";
import type {
  CreateProcessDefinitionServerInput,
  CreateProcessDefinitionServerResult,
  ListProcessDefinitionsResult,
  GetProcessDefinitionResult
} from "./process-definition.api-types";
import { ProcessDefinitionValidationError, ProcessDefinitionPersistenceError } from "./process-definition.errors";

export async function createProcessDefinitionServer(
  db: ProcessDefinitionDb,
  input: CreateProcessDefinitionServerInput,
  systemUserId?: string
): Promise<CreateProcessDefinitionServerResult> {
  try {
    const result = await createProcessDefinition(db, input);
    return { ok: true, data: result };
  } catch (err: any) {
    if (err instanceof ProcessDefinitionValidationError) {
      return {
        ok: false,
        error: { code: "VALIDATION_ERROR", message: err.message, issues: err.issues }
      };
    }
    if (err instanceof ProcessDefinitionPersistenceError) {
      return {
        ok: false,
        error: { code: "PERSISTENCE_ERROR", message: err.message }
      };
    }
    return {
      ok: false,
      error: { code: "SERVER_ERROR", message: err.message || "Erro desconhecido", issues: err.issues }
    };
  }
}

export async function listProcessDefinitionsServer(
  db: ProcessDefinitionDb,
  workspaceId: string
): Promise<ListProcessDefinitionsResult> {
  try {
    const definitions = await listProcessDefinitions(db, workspaceId);

    // Map Date to string for safe serialization across boundaries if necessary
    const mappedDefinitions = definitions.map((def: any) => ({
      ...def,
      updatedAt: def.updatedAt ? def.updatedAt.toISOString() : undefined,
    }));

    return { ok: true, data: mappedDefinitions };
  } catch (err: any) {
    return {
      ok: false,
      error: { code: "SERVER_ERROR", message: "Erro ao listar processos." }
    };
  }
}

export async function getProcessDefinitionWithLatestVersionServer(
  db: ProcessDefinitionDb,
  workspaceId: string,
  processDefinitionId: string
): Promise<GetProcessDefinitionResult> {
  try {
    const definition = await getProcessDefinitionById(db, workspaceId, processDefinitionId);
    if (!definition) {
      return {
        ok: false,
        error: { code: "NOT_FOUND", message: "Processo não encontrado." }
      };
    }

    return { ok: true, data: definition };
  } catch (err: any) {
    return {
      ok: false,
      error: { code: "SERVER_ERROR", message: "Erro ao carregar processo." }
    };
  }
}
