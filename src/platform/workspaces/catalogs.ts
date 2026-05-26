import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assetTypeDefinitions,
  businessRoleDefinitions,
  documentTemplateDefinitions,
  reportTemplateDefinitions,
  scheduleTypeDefinitions,
  serviceOrderTypeDefinitions,
  workItemTypeDefinitions,
} from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "./bootstrap";

export type CatalogOption = {
  value: string;
  label: string;
  description?: string | null;
};

export async function getWorkspaceWorkItemTypeOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const rows = await db
    .select({
      value: workItemTypeDefinitions.key,
      label: workItemTypeDefinitions.label,
      description: workItemTypeDefinitions.description,
    })
    .from(workItemTypeDefinitions)
    .where(eq(workItemTypeDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(workItemTypeDefinitions.sortOrder),
      asc(workItemTypeDefinitions.label),
    );

  return rows;
}

export async function getWorkspaceScheduleTypeOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const rows = await db
    .select({
      value: scheduleTypeDefinitions.key,
      label: scheduleTypeDefinitions.label,
      description: scheduleTypeDefinitions.description,
    })
    .from(scheduleTypeDefinitions)
    .where(eq(scheduleTypeDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(scheduleTypeDefinitions.sortOrder),
      asc(scheduleTypeDefinitions.label),
    );

  return rows;
}

export async function getWorkspaceTechnicianLevelOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const rows = await db
    .select({
      value: businessRoleDefinitions.legacyLevel,
      label: businessRoleDefinitions.label,
    })
    .from(businessRoleDefinitions)
    .where(eq(businessRoleDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(businessRoleDefinitions.sortOrder),
      asc(businessRoleDefinitions.label),
    );

  return rows
    .filter((row): row is { value: string; label: string } => Boolean(row.value))
    .map((row) => ({ value: row.value, label: row.label }));
}

export async function getWorkspaceAssetTypeOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  return db
    .select({
      value: assetTypeDefinitions.key,
      label: assetTypeDefinitions.label,
    })
    .from(assetTypeDefinitions)
    .where(eq(assetTypeDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(assetTypeDefinitions.sortOrder),
      asc(assetTypeDefinitions.label),
    );
}

export async function getWorkspaceDocumentTemplateOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  return db
    .select({
      value: documentTemplateDefinitions.key,
      label: documentTemplateDefinitions.label,
    })
    .from(documentTemplateDefinitions)
    .where(eq(documentTemplateDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(documentTemplateDefinitions.sortOrder),
      asc(documentTemplateDefinitions.label),
    );
}

export async function getWorkspaceReportTemplateOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  return db
    .select({
      value: reportTemplateDefinitions.key,
      label: reportTemplateDefinitions.label,
    })
    .from(reportTemplateDefinitions)
    .where(eq(reportTemplateDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(reportTemplateDefinitions.sortOrder),
      asc(reportTemplateDefinitions.label),
    );
}

export async function getWorkspaceServiceOrderTypeOptions(): Promise<CatalogOption[]> {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  return db
    .select({
      value: serviceOrderTypeDefinitions.key,
      label: serviceOrderTypeDefinitions.label,
      description: serviceOrderTypeDefinitions.description,
    })
    .from(serviceOrderTypeDefinitions)
    .where(eq(serviceOrderTypeDefinitions.workspaceId, workspace.id))
    .orderBy(
      asc(serviceOrderTypeDefinitions.sortOrder),
      asc(serviceOrderTypeDefinitions.label),
    );
}
