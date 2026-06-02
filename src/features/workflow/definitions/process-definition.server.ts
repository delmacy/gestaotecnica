import "server-only";

import type { ProcessDefinitionDb } from "./process-definition.repository";
import { createProcessDefinition, createProcessVersion } from "./process-definition.service";
import { ProcessDefinitionValidationError, ProcessDefinitionPersistenceError } from "./process-definition.errors";
import {
  listProcessDefinitions,
  getProcessDefinitionWithLatestVersion,
} from "./process-definition.queries";
import type {
  CreateProcessDefinitionRequest,
  CreateProcessDefinitionResponse,
  CreateProcessVersionRequest,
  CreateProcessVersionResponse,
  ListProcessDefinitionsInput,
  ListProcessDefinitionsResponse,
  GetProcessDefinitionWithLatestVersionResponse,
} from "./process-definition.api-types";

function buildErrorResponse(error: unknown) {
  if (error instanceof ProcessDefinitionValidationError) {
    return {
      ok: false as const,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        issues: error.issues,
      },
    };
  }
  if (error instanceof ProcessDefinitionPersistenceError) {
    return {
      ok: false as const,
      error: {
        code: "PERSISTENCE_ERROR",
        message: error.message,
      },
    };
  }
  return {
    ok: false as const,
    error: {
      code: "INTERNAL_ERROR",
      message: "Ocorreu um erro interno inesperado ao processar a definição do fluxo.",
    },
  };
}

export async function createProcessDefinitionServer(
  db: ProcessDefinitionDb,
  request: CreateProcessDefinitionRequest,
): Promise<CreateProcessDefinitionResponse> {
  try {
    const result = await createProcessDefinition(db, request);
    return { ok: true, data: result };
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function createProcessVersionServer(
  db: ProcessDefinitionDb,
  request: CreateProcessVersionRequest,
): Promise<CreateProcessVersionResponse> {
  try {
    const result = await createProcessVersion(db, request);
    return { ok: true, data: result };
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function listProcessDefinitionsServer(
  db: ProcessDefinitionDb,
  input: ListProcessDefinitionsInput,
): Promise<ListProcessDefinitionsResponse> {
  if (!input.workspaceId) {
    return {
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "O ID do workspace é obrigatório para listagem." },
    };
  }

  try {
    const items = await listProcessDefinitions(db, input);
    return { ok: true, data: { items } };
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function getProcessDefinitionWithLatestVersionServer(
  db: ProcessDefinitionDb,
  id: string,
): Promise<GetProcessDefinitionWithLatestVersionResponse> {
  if (!id) {
    return {
      ok: false,
      error: { code: "VALIDATION_ERROR", message: "O ID da definição de processo é obrigatório." },
    };
  }

  try {
    const result = await getProcessDefinitionWithLatestVersion(db, id);
    if (!result) {
      return {
        ok: false,
        error: { code: "NOT_FOUND", message: "Definição de processo não encontrada." },
      };
    }
    return { ok: true, data: result };
  } catch (error) {
    return buildErrorResponse(error);
  }
}
