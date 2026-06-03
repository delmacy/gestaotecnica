import { saveBuilderDraftAsProcessDefinitionAction } from "@/features/workflow/definitions/process-definition.actions";
import type {
  SaveBuilderDraftOfficialInput,
  SaveBuilderDraftOfficialResult,
} from "./builder-save.types";

export async function saveBuilderDraftOfficially(
  input: SaveBuilderDraftOfficialInput,
): Promise<SaveBuilderDraftOfficialResult> {
  try {
    const result = await saveBuilderDraftAsProcessDefinitionAction(input);

    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error.code,
          message: result.error.message,
          issues: "issues" in result.error ? (result.error.issues as unknown[]) : undefined,
        },
      };
    }

    return {
      ok: true,
      data: {
        processDefinitionId: result.data.processDefinition.id,
        versionId: result.data.version.id,
        version: result.data.version.version,
        savedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "UNEXPECTED_SAVE_ERROR",
        message: "Ocorreu um erro inesperado ao salvar oficialmente o processo.",
      },
    };
  }
}
