import type { BuilderDraft } from "../types";

export function createEmptyBuilderDraft(
  input?: Partial<Pick<BuilderDraft, "id" | "workspaceId" | "name" | "description">>,
): BuilderDraft {
  const now = new Date().toISOString();

  return {
    id: input?.id,
    workspaceId: input?.workspaceId,
    name: input?.name ?? "Novo processo",
    description: input?.description,
    status: "draft",
    version: 1,
    nodes: [],
    edges: [],
    metadata: {},
    createdAt: now,
    updatedAt: now,
  };
}
