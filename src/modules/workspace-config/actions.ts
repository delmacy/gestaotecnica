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

export async function updateWorkspaceCatalogItem(formData: FormData) {
  const catalog = readRequiredText(formData, "catalog");
  const id = readRequiredText(formData, "id");
  const label = readRequiredText(formData, "label");
  const description = readOptionalText(formData, "description");
  const db = getDb();
  const updatedAt = new Date();

  switch (catalog) {
    case "module":
      await db
        .update(workspaceModuleConfigs)
        .set({ name: label, description, updatedAt })
        .where(eq(workspaceModuleConfigs.id, id));
      break;
    case "demandType":
      await db
        .update(workItemTypeDefinitions)
        .set({ label, description, updatedAt })
        .where(eq(workItemTypeDefinitions.id, id));
      break;
    case "serviceOrderType":
      await db
        .update(serviceOrderTypeDefinitions)
        .set({ label, description, updatedAt })
        .where(eq(serviceOrderTypeDefinitions.id, id));
      break;
    case "assetType":
      await db
        .update(assetTypeDefinitions)
        .set({ label, updatedAt })
        .where(eq(assetTypeDefinitions.id, id));
      break;
    case "shiftType":
      await db
        .update(scheduleTypeDefinitions)
        .set({ label, description, updatedAt })
        .where(eq(scheduleTypeDefinitions.id, id));
      break;
    case "queue":
      await db
        .update(workspaceQueues)
        .set({ label, description, updatedAt })
        .where(eq(workspaceQueues.id, id));
      break;
    case "workflow":
      await db
        .update(workflowTemplates)
        .set({ label, updatedAt })
        .where(eq(workflowTemplates.id, id));
      break;
    case "reportTemplate":
      await db
        .update(reportTemplateDefinitions)
        .set({ label, updatedAt })
        .where(eq(reportTemplateDefinitions.id, id));
      break;
    case "documentTemplate":
      await db
        .update(documentTemplateDefinitions)
        .set({ label, updatedAt })
        .where(eq(documentTemplateDefinitions.id, id));
      break;
    default:
      throw new Error(`Catalogo nao suportado: ${catalog}`);
  }

  revalidatePath("/workspace-config");
}
