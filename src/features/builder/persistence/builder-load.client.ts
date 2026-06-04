import {
  listProcessDefinitionsAction,
  getProcessDefinitionWithLatestVersionAction,
} from "@/features/workflow/definitions/process-definition.actions";
import type {
  ListSavedProcessesInput,
  ListSavedProcessesResult,
  LoadSavedProcessInput,
  LoadSavedProcessResult,
} from "./builder-load.types";

export async function listSavedProcesses(
  input: ListSavedProcessesInput,
): Promise<ListSavedProcessesResult> {
  try {
    const result = await listProcessDefinitionsAction(input);

    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      };
    }

    return {
      ok: true,
      data: {
        items: result.data as any,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "UNEXPECTED_LIST_ERROR",
        message: "Ocorreu um erro inesperado ao listar processos salvos.",
      },
    };
  }
}

export async function loadSavedProcess(
  input: LoadSavedProcessInput,
): Promise<LoadSavedProcessResult> {
  try {
    const result = await getProcessDefinitionWithLatestVersionAction({
      workspaceId: input.workspaceId,
      id: input.processDefinitionId,
    });

    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      };
    }

    const { processDefinition, latestVersion } = result.data as any;
    let draft = undefined;

    if (latestVersion && latestVersion.definition) {
       const defJson = latestVersion.definition;
       if (defJson && defJson.schemaVersion === 1 && defJson.draft) {
         draft = defJson.draft;
       }
    }

    return {
      ok: true,
      data: {
        processDefinition,
        latestVersion,
        draft,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "UNEXPECTED_LOAD_ERROR",
        message: "Ocorreu um erro inesperado ao carregar o processo salvo.",
      },
    };
  }
}
