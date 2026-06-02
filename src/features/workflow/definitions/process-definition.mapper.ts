import type { BuilderDraft } from "@/features/builder/types";
import type { CreateProcessDefinitionInput } from "./process-definition.types";

export function createProcessKeyFromName(name: string): string {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const alphanumeric = normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const trimmed = alphanumeric.replace(/^-+|-+$/g, "");
  return trimmed || "processo";
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
