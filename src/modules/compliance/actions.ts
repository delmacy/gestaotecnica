"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { complianceAudits, complianceFindings, eventLogs } from "@/db/schema";
import {
  auditStatuses,
  findingSeverities,
  findingStatuses,
  priorities,
  type AuditStatusValue,
  type FindingSeverityValue,
  type FindingStatusValue,
  type PriorityValue,
} from "./constants";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function readOptionalDate(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Data invalida: ${field}`);
  return date;
}

function readEnum<T extends string>(
  formData: FormData,
  field: string,
  allowedValues: readonly { value: T; label: string }[],
  fallback: T,
) {
  const value = String(formData.get(field) ?? fallback);
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export async function createComplianceAudit(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const status = readEnum<AuditStatusValue>(formData, "status", auditStatuses, "planned");
  const priority = readEnum<PriorityValue>(formData, "priority", priorities, "medium");
  const db = getDb();
  const [audit] = await db.insert(complianceAudits).values({
    title,
    status,
    priority,
    area: readOptionalText(formData, "area"),
    ownerTeamId: readOptionalText(formData, "ownerTeamId"),
    assetId: readOptionalText(formData, "assetId"),
    plannedAt: readOptionalDate(formData, "plannedAt"),
    completedAt: readOptionalDate(formData, "completedAt"),
    summary: readOptionalText(formData, "summary"),
  }).returning({
    id: complianceAudits.id,
    title: complianceAudits.title,
    status: complianceAudits.status,
    assetId: complianceAudits.assetId,
  });

  await db.insert(eventLogs).values({
    eventType: "compliance_audit.created",
    entityType: "compliance_audit",
    entityId: audit.id,
    assetId: audit.assetId,
    payload: audit,
  });

  revalidatePath("/");
  revalidatePath("/compliance");
  revalidatePath("/events");
  redirect("/compliance");
}

export async function updateComplianceAuditStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<AuditStatusValue>(formData, "status", auditStatuses, "planned");
  const db = getDb();
  const [previous] = await db.select({ id: complianceAudits.id, title: complianceAudits.title, status: complianceAudits.status, assetId: complianceAudits.assetId }).from(complianceAudits).where(eq(complianceAudits.id, id)).limit(1);
  if (!previous) throw new Error("Auditoria nao encontrada.");
  await db.update(complianceAudits).set({ status, updatedAt: new Date() }).where(eq(complianceAudits.id, id));
  await db.insert(eventLogs).values({
    eventType: "compliance_audit.status_changed",
    entityType: "compliance_audit",
    entityId: previous.id,
    assetId: previous.assetId,
    payload: { title: previous.title, from: previous.status, to: status },
  });
  revalidatePath("/compliance");
  revalidatePath("/events");
  redirect("/compliance");
}

export async function createComplianceFinding(formData: FormData) {
  const auditId = readRequiredText(formData, "auditId");
  const title = readRequiredText(formData, "title");
  const severity = readEnum<FindingSeverityValue>(formData, "severity", findingSeverities, "medium");
  const status = readEnum<FindingStatusValue>(formData, "status", findingStatuses, "open");
  const db = getDb();
  const [finding] = await db.insert(complianceFindings).values({
    auditId,
    title,
    severity,
    status,
    responsibleTeamId: readOptionalText(formData, "responsibleTeamId"),
    dueAt: readOptionalDate(formData, "dueAt"),
    description: readOptionalText(formData, "description"),
    correctiveAction: readOptionalText(formData, "correctiveAction"),
  }).returning({
    id: complianceFindings.id,
    auditId: complianceFindings.auditId,
    title: complianceFindings.title,
    severity: complianceFindings.severity,
    status: complianceFindings.status,
  });

  await db.insert(eventLogs).values({
    eventType: "compliance_finding.created",
    entityType: "compliance_finding",
    entityId: finding.id,
    payload: finding,
  });

  revalidatePath("/");
  revalidatePath("/compliance");
  revalidatePath("/events");
  redirect("/compliance");
}
