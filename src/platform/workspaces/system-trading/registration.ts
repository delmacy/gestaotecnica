import { getDb, type DbClient } from "@/db";
import { workspaces, organizations } from "@/db/runtime/schema/workspace";
import { events } from "@/db/runtime/schema/workflow";
import { workspaceModuleConfigs } from "@/db/schema";
import {
  SYSTEM_TRADING,
  SYSTEM_TRADING_REGISTRATION_EVENT,
  SYSTEM_TRADING_REGISTRATION_IDEMPOTENCY_KEY,
  type SystemTradingEnvironmentMetadata,
  type SystemTradingRepositoryMetadata,
} from "./constants";

export type SystemTradingRegistrationResult = {
  organizationId: string;
  workspaceId: string;
  workspaceKey: string;
  workspaceName: string;
  adaptationKey: string;
  repository: SystemTradingRepositoryMetadata;
  environment: SystemTradingEnvironmentMetadata;
  tradingLabModuleKey: string;
};

/**
 * Registers the System Trading workspace in System Builder.
 *
 * Idempotent upsert: organization, workspace (with repository and environment
 * metadata), the Trading Lab module installation and an immutable audit event
 * are all persisted and can be read back via getSystemTradingWorkspaceRegistration.
 */
export async function registerSystemTradingWorkspace(
  db: DbClient = getDb(),
): Promise<SystemTradingRegistrationResult> {
  const [organization] = await db
    .insert(organizations)
    .values({
      key: SYSTEM_TRADING.organization.key,
      name: SYSTEM_TRADING.organization.name,
      status: "active",
    })
    .onConflictDoUpdate({
      target: organizations.key,
      set: {
        name: SYSTEM_TRADING.organization.name,
        status: "active",
        updatedAt: new Date(),
      },
    })
    .returning({ id: organizations.id });

  const repository = SYSTEM_TRADING.workspace.repository;
  const environment = SYSTEM_TRADING.workspace.environment;

  const [workspace] = await db
    .insert(workspaces)
    .values({
      organizationId: organization.id,
      key: SYSTEM_TRADING.workspace.key,
      name: SYSTEM_TRADING.workspace.name,
      status: "active",
      adaptationKey: SYSTEM_TRADING.workspace.adaptationKey,
      metadata: { repository, environment },
    })
    .onConflictDoUpdate({
      target: workspaces.key,
      set: {
        organizationId: organization.id,
        name: SYSTEM_TRADING.workspace.name,
        status: "active",
        adaptationKey: SYSTEM_TRADING.workspace.adaptationKey,
        metadata: { repository, environment },
        updatedAt: new Date(),
      },
    })
    .returning({ id: workspaces.id });

  await db
    .insert(workspaceModuleConfigs)
    .values({
      workspaceId: workspace.id,
      moduleKey: SYSTEM_TRADING.tradingLab.moduleKey,
      name: SYSTEM_TRADING.tradingLab.name,
      description: SYSTEM_TRADING.tradingLab.description,
      layer: SYSTEM_TRADING.tradingLab.layer,
      status: SYSTEM_TRADING.tradingLab.status,
      isEnabled: true,
      sortOrder: SYSTEM_TRADING.tradingLab.sortOrder,
    })
    .onConflictDoUpdate({
      target: [
        workspaceModuleConfigs.workspaceId,
        workspaceModuleConfigs.moduleKey,
      ],
      set: {
        name: SYSTEM_TRADING.tradingLab.name,
        description: SYSTEM_TRADING.tradingLab.description,
        layer: SYSTEM_TRADING.tradingLab.layer,
        status: SYSTEM_TRADING.tradingLab.status,
        isEnabled: true,
        updatedAt: new Date(),
      },
    });

  await db
    .insert(events)
    .values({
      workspaceId: workspace.id,
      eventType: SYSTEM_TRADING_REGISTRATION_EVENT,
      entityType: "workspace",
      entityId: workspace.id,
      actorType: "system",
      source: "system-trading-registration",
      idempotencyKey: SYSTEM_TRADING_REGISTRATION_IDEMPOTENCY_KEY,
      payload: {
        workspaceKey: SYSTEM_TRADING.workspace.key,
        workspaceName: SYSTEM_TRADING.workspace.name,
        repository,
        environment,
        moduleKey: SYSTEM_TRADING.tradingLab.moduleKey,
      },
    })
    .onConflictDoNothing();

  return {
    organizationId: organization.id,
    workspaceId: workspace.id,
    workspaceKey: SYSTEM_TRADING.workspace.key,
    workspaceName: SYSTEM_TRADING.workspace.name,
    adaptationKey: SYSTEM_TRADING.workspace.adaptationKey,
    repository,
    environment,
    tradingLabModuleKey: SYSTEM_TRADING.tradingLab.moduleKey,
  };
}
