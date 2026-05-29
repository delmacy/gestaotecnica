import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { workspaceModuleConfigs, workspaces } from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";
import type { ActorType, ExecutionSource, WorkspaceContext } from "./workspace-context";

type ResolveWorkspaceContextInput = {
  workspaceKey?: string;
  actor?: {
    type?: ActorType;
    id?: string;
    name?: string;
  };
  source?: ExecutionSource;
  scopes?: string[];
  correlationId?: string;
};

function createCorrelationId() {
  return globalThis.crypto?.randomUUID?.() ?? `corr-${Date.now()}`;
}

const fallbackEnabledModules = [
  "work-items",
  "service-orders",
  "assets",
  "reports",
  "notifications",
  "documents",
  "legacy",
  "shifts",
  "evidences",
  "approvals",
  "events",
  "workflow-engine",
  "automations",
  "integrations",
];

export async function resolveWorkspaceContext(
  input: ResolveWorkspaceContextInput = {},
): Promise<WorkspaceContext> {
  const workspaceKey = input.workspaceKey ?? "system-builder";
  const lookupKeys =
    workspaceKey === "system-builder"
      ? ["system-builder", "system-builder-dev"]
      : [workspaceKey];
  const db = getDb();

  let [workspace] = await db
    .select({
      id: workspaces.id,
      key: workspaces.key,
      adaptationKey: workspaces.adaptationKey,
    })
    .from(workspaces)
    .where(and(inArray(workspaces.key, lookupKeys), eq(workspaces.isActive, true)))
    .limit(1);

  if (!workspace && workspaceKey === "system-builder") {
    const seededWorkspace = await ensureActiveWorkspaceConfig();
    workspace = {
      id: seededWorkspace.id,
      key: seededWorkspace.key,
      adaptationKey: seededWorkspace.adaptationKey,
    };
  }

  const enabledModules = workspace
    ? await db
        .select({ moduleKey: workspaceModuleConfigs.moduleKey })
        .from(workspaceModuleConfigs)
        .where(
          and(
            eq(workspaceModuleConfigs.workspaceId, workspace.id),
            eq(workspaceModuleConfigs.isEnabled, true),
          ),
        )
        .then((rows) => rows.map((row) => row.moduleKey))
    : fallbackEnabledModules;

  return {
    workspaceId: workspace?.id ?? workspaceKey,
    workspaceKey: workspace?.key ?? workspaceKey,
    adaptationKey: workspace?.adaptationKey ?? "system-builder",
    actor: {
      type: input.actor?.type ?? "system",
      id: input.actor?.id,
      name: input.actor?.name,
    },
    source: input.source ?? "system",
    enabledModules: enabledModules.length > 0 ? enabledModules : fallbackEnabledModules,
    scopes: input.scopes ?? ["*"],
    correlationId: input.correlationId ?? createCorrelationId(),
  };
}
