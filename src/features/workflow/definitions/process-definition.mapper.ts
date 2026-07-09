import type { BuilderDraft } from "@/features/builder/types";
import type { CreateProcessDefinitionInput } from "./process-definition.types";

export function createProcessKeyFromName(name: string): string {
  if (!name) return "processo";

  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let alphanumeric = normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  alphanumeric = alphanumeric.replace(/-+/g, "-");
  let trimmed = alphanumeric.replace(/^-+|-+$/g, "");

  if (/^[0-9]/.test(trimmed)) {
    trimmed = "p-" + trimmed;
  }

  if (!trimmed || !/^[a-z]/.test(trimmed)) {
    trimmed = "processo";
  }

  if (trimmed.length < 3) {
    trimmed = trimmed.padEnd(3, "0");
  }

  if (trimmed.length > 100) {
    trimmed = trimmed.substring(0, 100).replace(/-+$/, "");
  }

  return trimmed;
}

export function mapBuilderDraftToCreateProcessDefinitionInput(input: {
  workspaceId: string;
  draft: BuilderDraft;
  createdBy?: string;
}): CreateProcessDefinitionInput {
  const { workspaceId, draft, createdBy } = input;
  const name = draft.name || "Processo sem nome";

  return {
    workspaceId,
    key: createProcessKeyFromName(name),
    name,
    description: draft.description,
    draft,
    createdBy,
  };
}
