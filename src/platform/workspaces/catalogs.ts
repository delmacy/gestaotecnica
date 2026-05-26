import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  businessRoleDefinitions,
  scheduleTypeDefinitions,
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
