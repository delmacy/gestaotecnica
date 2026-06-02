import { validateBuilderDraft } from "@/features/builder/process-editor/validate-builder-draft";
import type { CreateProcessDefinitionInput } from "./process-definition.types";

export type ProcessDefinitionInputValidationIssue = {
  code: string;
  message: string;
  path?: string;
};

export type ProcessDefinitionInputValidationResult = {
  valid: boolean;
  issues: ProcessDefinitionInputValidationIssue[];
};

export function validateCreateProcessDefinitionInput(
  input: CreateProcessDefinitionInput,
): ProcessDefinitionInputValidationResult {
  const issues: ProcessDefinitionInputValidationIssue[] = [];

  if (!input.workspaceId || input.workspaceId.trim() === "") {
    issues.push({
      code: "WORKSPACE_ID_REQUIRED",
      message: "O ID do workspace é obrigatório para salvar o processo.",
      path: "workspaceId",
    });
  }

  if (!input.key || input.key.trim() === "") {
    issues.push({
      code: "PROCESS_KEY_REQUIRED",
      message: "A chave do processo é obrigatória.",
      path: "key",
    });
  }

  if (!input.name || input.name.trim() === "") {
    issues.push({
      code: "PROCESS_NAME_REQUIRED",
      message: "O nome do processo é obrigatório.",
      path: "name",
    });
  }

  if (!input.draft) {
    issues.push({
      code: "PROCESS_DRAFT_REQUIRED",
      message: "O rascunho (draft) do processo é obrigatório.",
      path: "draft",
    });
  } else {
    const draftValidation = validateBuilderDraft(input.draft);
    if (!draftValidation.valid) {
      issues.push({
        code: "PROCESS_DRAFT_INVALID",
        message: "O rascunho do processo contém erros arquiteturais.",
        path: "draft",
      });
      // Import the draft errors into the top-level validation issues
      for (const draftIssue of draftValidation.issues) {
        if (draftIssue.severity === "error") {
          issues.push({
            code: draftIssue.code,
            message: draftIssue.message,
            path: `draft.${draftIssue.path || ""}`,
          });
        }
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
