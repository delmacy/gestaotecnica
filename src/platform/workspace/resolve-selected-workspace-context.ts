import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workspaceModuleConfigs } from "@/db/schema";
import { workspaces } from "@/db/runtime/schema/workspace";
import type { WorkspaceContext } from "./workspace-context";

type ResolveSelectedWorkspaceContextInput = {
  workspaceId?: string;
  actor?: WorkspaceContext["actor"];
  source?: WorkspaceContext["source"];
  environmentMode?: WorkspaceContext["environmentMode"];
};

export async function resolveSelectedWorkspaceContext(
  input: ResolveSelectedWorkspaceContextInput,
): Promise<WorkspaceContext | null> {
  if (!input.workspaceId) return null;

  const db = getDb();
  const [workspace] = await db
    .select({
      id: workspaces.id,
      key: workspaces.key,
      name: workspaces.name,
      organizationId: workspaces.organizationId,
      adaptationKey: workspaces.adaptationKey,
    })
    .from(workspaces)
    .where(and(eq(workspaces.id, input.workspaceId), eq(workspaces.status, "active")))
    .limit(1);

  if (!workspace) return null;

  const moduleRows = await db
    .select({ moduleKey: workspaceModuleConfigs.moduleKey })
    .from(workspaceModuleConfigs)
    .where(and(eq(workspaceModuleConfigs.workspaceId, workspace.id), eq(workspaceModuleConfigs.isEnabled, true)));

  return {
    workspaceId: workspace.id,
    workspaceKey: workspace.key,
    workspaceName: workspace.name,
    organizationId: workspace.organizationId ?? undefined,
    adaptationKey: workspace.adaptationKey ?? undefined,
    actor: input.actor ?? { type: "system" },
    source: input.source ?? "ui",
    environmentMode: input.environmentMode ?? "real",
    enabledModules: moduleRows.map((row: { moduleKey: string }) => row.moduleKey),
    scopes: [],
    correlationId: globalThis.crypto?.randomUUID?.() ?? `corr-${Date.now()}`,
  };
}
