import { and, asc, eq, isNotNull } from "drizzle-orm";
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
    .where(
      and(
        eq(workItemTypeDefinitions.workspaceId, workspace.id),
        eq(workItemTypeDefinitions.isActive, true),
      ),
    )
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
    .where(
      and(
        eq(scheduleTypeDefinitions.workspaceId, workspace.id),
        eq(scheduleTypeDefinitions.isActive, true),
      ),
    )
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
    .where(
      and(
        eq(businessRoleDefinitions.workspaceId, workspace.id),
        eq(businessRoleDefinitions.isActive, true),
        isNotNull(businessRoleDefinitions.legacyLevel),
      ),
    )
    .orderBy(
      asc(businessRoleDefinitions.sortOrder),
      asc(businessRoleDefinitions.label),
    );

  return rows
    .filter((row): row is { value: string; label: string } => Boolean(row.value))
    .map((row: any) => ({ value: row.value, label: row.label }));
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
    .where(
      and(
        eq(assetTypeDefinitions.workspaceId, workspace.id),
        eq(assetTypeDefinitions.isActive, true),
      ),
    )
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
    .where(
      and(
        eq(documentTemplateDefinitions.workspaceId, workspace.id),
        eq(documentTemplateDefinitions.isActive, true),
      ),
    )
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
    .where(
      and(
        eq(reportTemplateDefinitions.workspaceId, workspace.id),
        eq(reportTemplateDefinitions.isActive, true),
      ),
    )
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
    .where(
      and(
        eq(serviceOrderTypeDefinitions.workspaceId, workspace.id),
        eq(serviceOrderTypeDefinitions.isActive, true),
      ),
    )
    .orderBy(
      asc(serviceOrderTypeDefinitions.sortOrder),
      asc(serviceOrderTypeDefinitions.label),
    );
}
