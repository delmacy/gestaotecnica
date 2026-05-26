import { asc, count, eq } from "drizzle-orm";
import { activeAdaptation } from "@/adaptations/active";
import { getDb } from "@/db";
import {
  assetTypeDefinitions,
  businessRoleDefinitions,
  documentTemplateDefinitions,
  reportTemplateDefinitions,
  scheduleTypeDefinitions,
  serviceOrderTypeDefinitions,
  workItemTypeDefinitions,
  workflowTemplates,
  workspaceModuleConfigs,
  workspaceQueues,
} from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

export async function getWorkspaceConfigOverview() {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const [
    modules,
    demandTypes,
    serviceOrderTypes,
    assetTypes,
    shiftTypes,
    businessRoles,
    queues,
    workflows,
    reportTemplates,
    documentTemplates,
  ] = await Promise.all([
    db
      .select()
      .from(workspaceModuleConfigs)
      .where(eq(workspaceModuleConfigs.workspaceId, workspace.id))
      .orderBy(asc(workspaceModuleConfigs.sortOrder), asc(workspaceModuleConfigs.name)),
    db
      .select()
      .from(workItemTypeDefinitions)
      .where(eq(workItemTypeDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(workItemTypeDefinitions.sortOrder),
        asc(workItemTypeDefinitions.label),
      ),
    db
      .select()
      .from(serviceOrderTypeDefinitions)
      .where(eq(serviceOrderTypeDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(serviceOrderTypeDefinitions.sortOrder),
        asc(serviceOrderTypeDefinitions.label),
      ),
    db
      .select()
      .from(assetTypeDefinitions)
      .where(eq(assetTypeDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(assetTypeDefinitions.sortOrder),
        asc(assetTypeDefinitions.label),
      ),
    db
      .select()
      .from(scheduleTypeDefinitions)
      .where(eq(scheduleTypeDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(scheduleTypeDefinitions.sortOrder),
        asc(scheduleTypeDefinitions.label),
      ),
    db
      .select()
      .from(businessRoleDefinitions)
      .where(eq(businessRoleDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(businessRoleDefinitions.sortOrder),
        asc(businessRoleDefinitions.label),
      ),
    db
      .select()
      .from(workspaceQueues)
      .where(eq(workspaceQueues.workspaceId, workspace.id))
      .orderBy(asc(workspaceQueues.sortOrder), asc(workspaceQueues.label)),
    db
      .select()
      .from(workflowTemplates)
      .where(eq(workflowTemplates.workspaceId, workspace.id))
      .orderBy(asc(workflowTemplates.sortOrder), asc(workflowTemplates.label)),
    db
      .select()
      .from(reportTemplateDefinitions)
      .where(eq(reportTemplateDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(reportTemplateDefinitions.sortOrder),
        asc(reportTemplateDefinitions.label),
      ),
    db
      .select()
      .from(documentTemplateDefinitions)
      .where(eq(documentTemplateDefinitions.workspaceId, workspace.id))
      .orderBy(
        asc(documentTemplateDefinitions.sortOrder),
        asc(documentTemplateDefinitions.label),
      ),
  ]);

  const [{ value: moduleCount }] = await db
    .select({ value: count() })
    .from(workspaceModuleConfigs)
    .where(eq(workspaceModuleConfigs.workspaceId, workspace.id));

  return {
    adaptation: activeAdaptation,
    workspace,
    modules,
    totals: {
      modules: moduleCount,
      demandTypes: demandTypes.length,
      serviceOrderTypes: serviceOrderTypes.length,
      assetTypes: assetTypes.length,
      shiftTypes: shiftTypes.length,
      businessRoles: businessRoles.length,
      queues: queues.length,
      workflows: workflows.length,
      reportTemplates: reportTemplates.length,
      documentTemplates: documentTemplates.length,
    },
    catalogs: {
      demandTypes,
      serviceOrderTypes,
      assetTypes,
      shiftTypes,
      businessRoles,
      queues,
      workflows,
      reportTemplates,
      documentTemplates,
    },
  };
}
