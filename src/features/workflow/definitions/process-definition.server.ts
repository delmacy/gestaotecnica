import type { ProcessDefinitionDb } from "./process-definition.repository";
import { createProcessDefinition } from "./process-definition.service";
import type {
  CreateProcessDefinitionServerInput,
  CreateProcessDefinitionServerResult
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
