import { eq } from "drizzle-orm";
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
import { workspaces } from "@/db/runtime/schema/workspace";
import { ecosystemModules } from "./module-catalog";
import { bootstrapPlatformRegistry } from "../registry/application/bootstrap";

function roleFlag<T extends string>(
  role: (typeof activeAdaptation.businessRoles)[number],
  key: T,
) {
  return key in role ? Boolean(role[key as keyof typeof role]) : false;
}

function roleText<T extends string>(
  role: (typeof activeAdaptation.businessRoles)[number],
  key: T,
) {
  const value = key in role ? role[key as keyof typeof role] : undefined;
  return typeof value === "string" ? value : undefined;
}

export async function ensureActiveWorkspaceConfig() {
  const db = getDb();

  const [workspace] = await db
    .insert(workspaces)
    .values({
      key: activeAdaptation.key,
      name: activeAdaptation.workspaceName,
      adaptationKey: activeAdaptation.key,
      metadata: {
        adaptationName: activeAdaptation.name,
        terminology: activeAdaptation.terminology,
      },
    })
    .onConflictDoUpdate({
      target: workspaces.key,
      set: {
        name: activeAdaptation.workspaceName,
        adaptationKey: activeAdaptation.key,
        isActive: true,
        metadata: {
          adaptationName: activeAdaptation.name,
          terminology: activeAdaptation.terminology,
        },
        updatedAt: new Date(),
      },
    })
    .returning({ id: workspaces.id });

  for (const [index, module] of ecosystemModules.entries()) {
    await db
      .insert(workspaceModuleConfigs)
      .values({
        workspaceId: workspace.id,
        moduleKey: module.key,
        name: module.name,
        description: module.description,
        layer: module.layer,
        status: module.status,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          workspaceModuleConfigs.workspaceId,
          workspaceModuleConfigs.moduleKey,
        ],
        set: {
          name: module.name,
          description: module.description,
          layer: module.layer,
          status: module.status,
          isEnabled: true,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, type] of activeAdaptation.demandTypes.entries()) {
    await db
      .insert(workItemTypeDefinitions)
      .values({
        workspaceId: workspace.id,
        key: type.key,
        label: type.label,
        description: type.description,
        defaultPriority: type.defaultPriority,
        defaultQueue: type.defaultQueue,
        canGenerateServiceOrder: type.canGenerateServiceOrder,
        canAppearInShiftLog: type.canAppearInShiftLog,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          workItemTypeDefinitions.workspaceId,
          workItemTypeDefinitions.key,
        ],
        set: {
          label: type.label,
          description: type.description,
          defaultPriority: type.defaultPriority,
          defaultQueue: type.defaultQueue,
          canGenerateServiceOrder: type.canGenerateServiceOrder,
          canAppearInShiftLog: type.canAppearInShiftLog,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, type] of activeAdaptation.serviceOrderTypes.entries()) {
    await db
      .insert(serviceOrderTypeDefinitions)
      .values({
        workspaceId: workspace.id,
        key: type.key,
        label: type.label,
        description: type.description,
        requiresAsset: type.requiresAsset,
        requiresTimeEntry: type.requiresTimeEntry,
        requiresEvidence: type.requiresEvidence,
        requiresSupervisorApproval: type.requiresSupervisorApproval,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          serviceOrderTypeDefinitions.workspaceId,
          serviceOrderTypeDefinitions.key,
        ],
        set: {
          label: type.label,
          description: type.description,
          requiresAsset: type.requiresAsset,
          requiresTimeEntry: type.requiresTimeEntry,
          requiresEvidence: type.requiresEvidence,
          requiresSupervisorApproval: type.requiresSupervisorApproval,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, type] of activeAdaptation.assetTypes.entries()) {
    await db
      .insert(assetTypeDefinitions)
      .values({
        workspaceId: workspace.id,
        key: type.key,
        label: type.label,
        tracksMaintenance: type.tracksMaintenance,
        tracksLocation: type.tracksLocation,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [assetTypeDefinitions.workspaceId, assetTypeDefinitions.key],
        set: {
          label: type.label,
          tracksMaintenance: type.tracksMaintenance,
          tracksLocation: type.tracksLocation,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, type] of activeAdaptation.shiftTypes.entries()) {
    await db
      .insert(scheduleTypeDefinitions)
      .values({
        workspaceId: workspace.id,
        key: type.key,
        label: type.label,
        description: type.description,
        requiresShiftLog: type.requiresShiftLog,
        receivesTickets: type.receivesTickets,
        receivesServiceOrders: type.receivesServiceOrders,
        allowsOverlap: type.allowsOverlap,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          scheduleTypeDefinitions.workspaceId,
          scheduleTypeDefinitions.key,
        ],
        set: {
          label: type.label,
          description: type.description,
          requiresShiftLog: type.requiresShiftLog,
          receivesTickets: type.receivesTickets,
          receivesServiceOrders: type.receivesServiceOrders,
          allowsOverlap: type.allowsOverlap,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, role] of activeAdaptation.businessRoles.entries()) {
    await db
      .insert(businessRoleDefinitions)
      .values({
        workspaceId: workspace.id,
        key: role.key,
        label: role.label,
        legacyLevel: roleText(role, "legacyLevel"),
        canExecuteServiceOrder: roleFlag(role, "canExecuteServiceOrder"),
        requiresSupervision: roleFlag(role, "requiresSupervision"),
        canApprove: roleFlag(role, "canApprove"),
        canAssignServiceOrder: roleFlag(role, "canAssignServiceOrder"),
        canReviewShiftLog: roleFlag(role, "canReviewShiftLog"),
        canValidateTechnicalWork: roleFlag(role, "canValidateTechnicalWork"),
        canPrepareDocuments: roleFlag(role, "canPrepareDocuments"),
        canReviewCompleteness: roleFlag(role, "canReviewCompleteness"),
        canPlanMaintenance: roleFlag(role, "canPlanMaintenance"),
        canManageAcquisitions: roleFlag(role, "canManageAcquisitions"),
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          businessRoleDefinitions.workspaceId,
          businessRoleDefinitions.key,
        ],
        set: {
          label: role.label,
          legacyLevel: roleText(role, "legacyLevel"),
          canExecuteServiceOrder: roleFlag(role, "canExecuteServiceOrder"),
          requiresSupervision: roleFlag(role, "requiresSupervision"),
          canApprove: roleFlag(role, "canApprove"),
          canAssignServiceOrder: roleFlag(role, "canAssignServiceOrder"),
          canReviewShiftLog: roleFlag(role, "canReviewShiftLog"),
          canValidateTechnicalWork: roleFlag(role, "canValidateTechnicalWork"),
          canPrepareDocuments: roleFlag(role, "canPrepareDocuments"),
          canReviewCompleteness: roleFlag(role, "canReviewCompleteness"),
          canPlanMaintenance: roleFlag(role, "canPlanMaintenance"),
          canManageAcquisitions: roleFlag(role, "canManageAcquisitions"),
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, queue] of activeAdaptation.queues.entries()) {
    await db
      .insert(workspaceQueues)
      .values({
        workspaceId: workspace.id,
        key: queue.key,
        label: queue.label,
        description: queue.description,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [workspaceQueues.workspaceId, workspaceQueues.key],
        set: {
          label: queue.label,
          description: queue.description,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, workflow] of activeAdaptation.workflows.entries()) {
    await db
      .insert(workflowTemplates)
      .values({
        workspaceId: workspace.id,
        key: workflow.key,
        label: workflow.label,
        target: workflow.target,
        states: workflow.states,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [workflowTemplates.workspaceId, workflowTemplates.key],
        set: {
          label: workflow.label,
          target: workflow.target,
          states: workflow.states,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, template] of activeAdaptation.reportTemplates.entries()) {
    await db
      .insert(reportTemplateDefinitions)
      .values({
        workspaceId: workspace.id,
        key: template.key,
        label: template.label,
        target: template.target,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          reportTemplateDefinitions.workspaceId,
          reportTemplateDefinitions.key,
        ],
        set: {
          label: template.label,
          target: template.target,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, template] of activeAdaptation.documentTemplates.entries()) {
    await db
      .insert(documentTemplateDefinitions)
      .values({
        workspaceId: workspace.id,
        key: template.key,
        label: template.label,
        target: template.target,
        sortOrder: index,
      })
      .onConflictDoUpdate({
        target: [
          documentTemplateDefinitions.workspaceId,
          documentTemplateDefinitions.key,
        ],
        set: {
          label: template.label,
          target: template.target,
          isActive: true,
          sortOrder: index,
          updatedAt: new Date(),
        },
      });
  }

  const [persistedWorkspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspace.id))
    .limit(1);

  await bootstrapPlatformRegistry();

  return persistedWorkspace;
}
