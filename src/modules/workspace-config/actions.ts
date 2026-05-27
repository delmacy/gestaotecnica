"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import {
  assetTypeDefinitions,
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

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    throw new Error(`Campo obrigatorio ausente: ${field}`);
  }

  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : null;
}

function readOptionalCheckbox(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

function readOptionalNumber(formData: FormData, field: string, fallback = 0) {
  const value = Number(formData.get(field) ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

export async function updateWorkspaceCatalogItem(formData: FormData) {
  const catalog = readRequiredText(formData, "catalog");
  const id = readRequiredText(formData, "id");
  const label = readRequiredText(formData, "label");
  const description = readOptionalText(formData, "description");
  const isActive = readOptionalCheckbox(formData, "isActive");
  const db = getDb();
  const updatedAt = new Date();

  switch (catalog) {
    case "module":
      await db
        .update(workspaceModuleConfigs)
        .set({ name: label, description, isEnabled: isActive, updatedAt })
        .where(eq(workspaceModuleConfigs.id, id));
      break;
    case "demandType":
      await db
        .update(workItemTypeDefinitions)
        .set({ label, description, isActive, updatedAt })
        .where(eq(workItemTypeDefinitions.id, id));
      break;
    case "serviceOrderType":
      await db
        .update(serviceOrderTypeDefinitions)
        .set({ label, description, isActive, updatedAt })
        .where(eq(serviceOrderTypeDefinitions.id, id));
      break;
    case "assetType":
      await db
        .update(assetTypeDefinitions)
        .set({ label, isActive, updatedAt })
        .where(eq(assetTypeDefinitions.id, id));
      break;
    case "shiftType":
      await db
        .update(scheduleTypeDefinitions)
        .set({ label, description, isActive, updatedAt })
        .where(eq(scheduleTypeDefinitions.id, id));
      break;
    case "queue":
      await db
        .update(workspaceQueues)
        .set({ label, description, isActive, updatedAt })
        .where(eq(workspaceQueues.id, id));
      break;
    case "workflow":
      await db
        .update(workflowTemplates)
        .set({ label, isActive, updatedAt })
        .where(eq(workflowTemplates.id, id));
      break;
    case "reportTemplate":
      await db
        .update(reportTemplateDefinitions)
        .set({ label, isActive, updatedAt })
        .where(eq(reportTemplateDefinitions.id, id));
      break;
    case "documentTemplate":
      await db
        .update(documentTemplateDefinitions)
        .set({ label, isActive, updatedAt })
        .where(eq(documentTemplateDefinitions.id, id));
      break;
    default:
      throw new Error(`Catalogo nao suportado: ${catalog}`);
  }

  revalidatePath("/workspace-config");
}

export async function createWorkspaceCatalogItem(formData: FormData) {
  const catalog = readRequiredText(formData, "catalog");
  const key = readRequiredText(formData, "key");
  const label = readRequiredText(formData, "label");
  const description = readOptionalText(formData, "description");
  const target = readOptionalText(formData, "target") ?? "workspace";
  const sortOrder = readOptionalNumber(formData, "sortOrder", 100);
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  switch (catalog) {
    case "demandType":
      await db
        .insert(workItemTypeDefinitions)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          description,
          defaultPriority: "medium",
          canGenerateServiceOrder: true,
          canAppearInShiftLog: false,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [
            workItemTypeDefinitions.workspaceId,
            workItemTypeDefinitions.key,
          ],
          set: { label, description, isActive: true, updatedAt: new Date() },
        });
      break;
    case "serviceOrderType":
      await db
        .insert(serviceOrderTypeDefinitions)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          description,
          requiresTimeEntry: true,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [
            serviceOrderTypeDefinitions.workspaceId,
            serviceOrderTypeDefinitions.key,
          ],
          set: { label, description, isActive: true, updatedAt: new Date() },
        });
      break;
    case "assetType":
      await db
        .insert(assetTypeDefinitions)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [assetTypeDefinitions.workspaceId, assetTypeDefinitions.key],
          set: { label, isActive: true, updatedAt: new Date() },
        });
      break;
    case "shiftType":
      await db
        .insert(scheduleTypeDefinitions)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          description,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [
            scheduleTypeDefinitions.workspaceId,
            scheduleTypeDefinitions.key,
          ],
          set: { label, description, isActive: true, updatedAt: new Date() },
        });
      break;
    case "queue":
      await db
        .insert(workspaceQueues)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          description,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [workspaceQueues.workspaceId, workspaceQueues.key],
          set: { label, description, isActive: true, updatedAt: new Date() },
        });
      break;
    case "documentTemplate":
      await db
        .insert(documentTemplateDefinitions)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          target,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [
            documentTemplateDefinitions.workspaceId,
            documentTemplateDefinitions.key,
          ],
          set: { label, target, isActive: true, updatedAt: new Date() },
        });
      break;
    case "reportTemplate":
      await db
        .insert(reportTemplateDefinitions)
        .values({
          workspaceId: workspace.id,
          key,
          label,
          target,
          sortOrder,
        })
        .onConflictDoUpdate({
          target: [
            reportTemplateDefinitions.workspaceId,
            reportTemplateDefinitions.key,
          ],
          set: { label, target, isActive: true, updatedAt: new Date() },
        });
      break;
    default:
      throw new Error(`Catalogo nao suportado para criacao: ${catalog}`);
  }

  revalidatePath("/workspace-config");
}
