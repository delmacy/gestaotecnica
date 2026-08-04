import { eq } from "drizzle-orm";
import { getDb, type DbClient } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { workspaceModuleConfigs } from "@/db/schema";
import {
  SYSTEM_TRADING_TRADING_LAB_MODULE_KEY,
  SYSTEM_TRADING_WORKSPACE_KEY,
  type SystemTradingEnvironmentMetadata,
  type SystemTradingRepositoryMetadata,
} from "./constants";

export type SystemTradingModuleRow = {
  moduleKey: string;
  name: string;
  description: string | null;
  layer: string;
  status: string;
  isEnabled: boolean;
};

export type SystemTradingWorkspaceRegistration = {
  workspaceId: string;
  workspaceKey: string;
  workspaceName: string;
  status: string;
  adaptationKey: string | null;
  repository: SystemTradingRepositoryMetadata | null;
  environment: SystemTradingEnvironmentMetadata | null;
  tradingLabInstalled: boolean;
  modules: SystemTradingModuleRow[];
};

function readRepositoryMetadata(metadata: unknown): SystemTradingRepositoryMetadata | null {
  if (!metadata || typeof metadata !== "object") return null;
  const repository = (metadata as { repository?: unknown }).repository;
  if (!repository || typeof repository !== "object") return null;
  const candidate = repository as {
    owner?: unknown;
    name?: unknown;
    url?: unknown;
    branch?: unknown;
  };
  if (
    typeof candidate.owner !== "string" ||
    typeof candidate.name !== "string" ||
    typeof candidate.url !== "string" ||
    typeof candidate.branch !== "string"
  ) {
    return null;
  }
  return {
    owner: candidate.owner,
    name: candidate.name,
    url: candidate.url,
    branch: candidate.branch,
  };
}

function readEnvironmentMetadata(
  metadata: unknown,
): SystemTradingEnvironmentMetadata | null {
  if (!metadata || typeof metadata !== "object") return null;
  const environment = (metadata as { environment?: unknown }).environment;
  if (!environment || typeof environment !== "object") return null;
  const candidate = environment as {
    stage?: unknown;
    label?: unknown;
    runtime?: unknown;
    database?: unknown;
  };
  if (
    typeof candidate.stage !== "string" ||
    typeof candidate.label !== "string" ||
    typeof candidate.runtime !== "string" ||
    typeof candidate.database !== "string"
  ) {
    return null;
  }
  return {
    stage: candidate.stage,
    label: candidate.label,
    runtime: candidate.runtime,
    database: candidate.database,
  };
}

/**
 * Reads the registered System Trading workspace back from persistence,
 * including repository and environment metadata and installed modules
 * (Trading Lab). Returns null when the workspace has not been registered yet.
 */
export async function getSystemTradingWorkspaceRegistration(
  db: DbClient = getDb(),
): Promise<SystemTradingWorkspaceRegistration | null> {
  const [workspace] = await db
    .select({
      id: workspaces.id,
      key: workspaces.key,
      name: workspaces.name,
      status: workspaces.status,
      adaptationKey: workspaces.adaptationKey,
      metadata: workspaces.metadata,
    })
    .from(workspaces)
    .where(eq(workspaces.key, SYSTEM_TRADING_WORKSPACE_KEY))
    .limit(1);

  if (!workspace) return null;

  const moduleRows = await db
    .select({
      moduleKey: workspaceModuleConfigs.moduleKey,
      name: workspaceModuleConfigs.name,
      description: workspaceModuleConfigs.description,
      layer: workspaceModuleConfigs.layer,
      status: workspaceModuleConfigs.status,
      isEnabled: workspaceModuleConfigs.isEnabled,
    })
    .from(workspaceModuleConfigs)
    .where(eq(workspaceModuleConfigs.workspaceId, workspace.id));

  const repository = readRepositoryMetadata(workspace.metadata);
  const environment = readEnvironmentMetadata(workspace.metadata);

  return {
    workspaceId: workspace.id,
    workspaceKey: workspace.key,
    workspaceName: workspace.name,
    status: workspace.status,
    adaptationKey: workspace.adaptationKey,
    repository,
    environment,
    tradingLabInstalled: moduleRows.some(
      (module: SystemTradingModuleRow) =>
        module.moduleKey === SYSTEM_TRADING_TRADING_LAB_MODULE_KEY &&
        module.isEnabled,
    ),
    modules: moduleRows,
  };
}
