"use server";
import { events as eventLogs } from "@/db/runtime/schema/workflow";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getRuntimeDb } from "@/db";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import {
  acquisitionNeeds,

  maintenancePlans,
  technicalProjects,
} from "@/db/schema";
import {
  acquisitionStatuses,
  planningStatuses,
  priorities,
  type AcquisitionStatusValue,
  type PlanningStatusValue,
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

function readOptionalInteger(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`Numero invalido: ${field}`);
  return parsed;
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

export async function createMaintenancePlan(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const objective = readOptionalText(formData, "objective");
  const assetId = readOptionalText(formData, "assetId");
  const ownerTeamId = readOptionalText(formData, "ownerTeamId");
  const periodStart = readOptionalText(formData, "periodStart");
  const periodEnd = readOptionalText(formData, "periodEnd");

  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(
    "maintenance_plans.create",
    {
      title,
      objective,
      assetId,
      ownerTeamId,
      periodStart,
      periodEnd,
    },
    context,
  );

  if (!result.success) {
    throw new Error(result.error?.message ?? "Falha ao criar plano.");
  }

  revalidatePath("/");
  revalidatePath("/maintenance-plans");
  revalidatePath("/events");
  redirect("/maintenance-plans");
}

export async function updateMaintenancePlanStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<PlanningStatusValue>(formData, "status", planningStatuses, "draft");
  const db = getRuntimeDb();
  const [previous] = await db.select({ id: maintenancePlans.id, title: maintenancePlans.title, status: maintenancePlans.status, assetId: maintenancePlans.assetId }).from(maintenancePlans).where(eq(maintenancePlans.id, id)).limit(1);
  if (!previous) throw new Error("Plano nao encontrado.");
  await db.update(maintenancePlans).set({ status, updatedAt: new Date() }).where(eq(maintenancePlans.id, id));
  await db.insert(eventLogs).values({
    eventType: "maintenance_plan.status_changed",
    entityType: "maintenance_plan",
    entityId: previous.id,
    assetId: previous.assetId,
    payload: { title: previous.title, from: previous.status, to: status },
  });
  revalidatePath("/maintenance-plans");
  redirect("/maintenance-plans");
}

export async function createTechnicalProject(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const objective = readOptionalText(formData, "objective");
  const scope = readOptionalText(formData, "scope");
  const sponsor = readOptionalText(formData, "sponsor");
  const assetId = readOptionalText(formData, "assetId");
  const workItemId = readOptionalText(formData, "workItemId");
  const startsAt = readOptionalDate(formData, "startsAt");
  const targetEndsAt = readOptionalDate(formData, "targetEndsAt");
  const status = readEnum<PlanningStatusValue>(formData, "status", planningStatuses, "draft");
  const priority = readEnum<PriorityValue>(formData, "priority", priorities, "medium");
  const db = getDb();

  const [project] = await db.insert(technicalProjects).values({
    title, objective, scope, sponsor, assetId, workItemId, startsAt, targetEndsAt, status, priority,
  }).returning({
    id: technicalProjects.id,
    title: technicalProjects.title,
    status: technicalProjects.status,
    assetId: technicalProjects.assetId,
    workItemId: technicalProjects.workItemId,
  });

  await db.insert(eventLogs).values({
    eventType: "technical_project.created",
    entityType: "technical_project",
    entityId: project.id,
    assetId: project.assetId,
    workItemId: project.workItemId,
    payload: project,
  });

  revalidatePath("/");
  revalidatePath("/technical-projects");
  revalidatePath("/events");
  redirect("/technical-projects");
}

export async function updateTechnicalProjectStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<PlanningStatusValue>(formData, "status", planningStatuses, "draft");
  const db = getDb();
  const [previous] = await db.select({ id: technicalProjects.id, title: technicalProjects.title, status: technicalProjects.status, assetId: technicalProjects.assetId, workItemId: technicalProjects.workItemId }).from(technicalProjects).where(eq(technicalProjects.id, id)).limit(1);
  if (!previous) throw new Error("Projeto nao encontrado.");
  await db.update(technicalProjects).set({ status, updatedAt: new Date() }).where(eq(technicalProjects.id, id));
  await db.insert(eventLogs).values({
    eventType: "technical_project.status_changed",
    entityType: "technical_project",
    entityId: previous.id,
    assetId: previous.assetId,
    workItemId: previous.workItemId,
    payload: { title: previous.title, from: previous.status, to: status },
  });
  revalidatePath("/technical-projects");
  redirect("/technical-projects");
}

export async function createAcquisitionNeed(formData: FormData) {
  const title = readRequiredText(formData, "title");
  const justification = readOptionalText(formData, "justification");
  const assetId = readOptionalText(formData, "assetId");
  const serviceOrderId = readOptionalText(formData, "serviceOrderId");
  const projectId = readOptionalText(formData, "projectId");
  const quantity = readOptionalInteger(formData, "quantity") ?? 1;
  const estimatedCost = readOptionalInteger(formData, "estimatedCost");
  const status = readEnum<AcquisitionStatusValue>(formData, "status", acquisitionStatuses, "identified");
  const priority = readEnum<PriorityValue>(formData, "priority", priorities, "medium");
  const db = getDb();

  const [need] = await db.insert(acquisitionNeeds).values({
    title,
    justification,
    assetId,
    serviceOrderId,
    projectId,
    quantity,
    estimatedCostCents: estimatedCost ? estimatedCost * 100 : undefined,
    status,
    priority,
  }).returning({
    id: acquisitionNeeds.id,
    title: acquisitionNeeds.title,
    status: acquisitionNeeds.status,
    assetId: acquisitionNeeds.assetId,
    serviceOrderId: acquisitionNeeds.serviceOrderId,
  });

  await db.insert(eventLogs).values({
    eventType: "acquisition_need.created",
    entityType: "acquisition_need",
    entityId: need.id,
    assetId: need.assetId,
    serviceOrderId: need.serviceOrderId,
    payload: need,
  });

  revalidatePath("/");
  revalidatePath("/acquisitions");
  revalidatePath("/events");
  redirect("/acquisitions");
}

export async function updateAcquisitionNeedStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<AcquisitionStatusValue>(formData, "status", acquisitionStatuses, "identified");
  const db = getDb();
  const [previous] = await db.select({ id: acquisitionNeeds.id, title: acquisitionNeeds.title, status: acquisitionNeeds.status, assetId: acquisitionNeeds.assetId, serviceOrderId: acquisitionNeeds.serviceOrderId }).from(acquisitionNeeds).where(eq(acquisitionNeeds.id, id)).limit(1);
  if (!previous) throw new Error("Necessidade nao encontrada.");
  await db.update(acquisitionNeeds).set({ status, updatedAt: new Date() }).where(eq(acquisitionNeeds.id, id));
  await db.insert(eventLogs).values({
    eventType: "acquisition_need.status_changed",
    entityType: "acquisition_need",
    entityId: previous.id,
    assetId: previous.assetId,
    serviceOrderId: previous.serviceOrderId,
    payload: { title: previous.title, from: previous.status, to: status },
  });
  revalidatePath("/acquisitions");
  redirect("/acquisitions");
}
