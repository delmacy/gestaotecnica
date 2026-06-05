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
  input: CreateProcessDefinitionServerInput
): Promise<CreateProcessDefinitionServerResult> {
  try {
    const result = await createProcessDefinition(db, input);
    return { ok: true, data: result };
  } catch (err: unknown) {
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
      error: { code: "SERVER_ERROR", message: "Ocorreu um erro interno inesperado ao criar a definição do processo." }
    };
  }
}

export async function listProcessDefinitionsServer(
  db: ProcessDefinitionDb,
  input: {
    workspaceId: string;
    status?: "draft" | "published" | "archived";
    limit?: number;
    offset?: number;
  }
): Promise<ListProcessDefinitionsResult> {
  try {
    const definitions = await listProcessDefinitions(db, input);
    return { ok: true, data: { items: definitions } };
  } catch (err: unknown) {
    return {
      ok: false,
      error: { code: "SERVER_ERROR", message: "Ocorreu um erro interno inesperado ao listar processos." }
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
  } catch (err: unknown) {
    return {
      ok: false,
      error: { code: "SERVER_ERROR", message: "Ocorreu um erro interno inesperado ao carregar o processo." }
    };
  }
}
