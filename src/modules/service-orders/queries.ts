import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  eventLogs,
  evidences,
  serviceOrderAssignments,
  serviceOrders,
  serviceOrderStages,
  serviceOrderTargets,
  serviceOrderTasks,
  teams,
  technicianProfiles,
  timeEntries,
  users,
  workItems,
} from "@/db/schema";
import { getWorkspaceServiceOrderTypeOptions } from "@/platform/workspaces/catalogs";
import type { ServiceOrderTypeValue } from "./constants";

export async function getServiceOrders() {
  const db = getDb();

  return db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      title: serviceOrders.title,
      type: serviceOrders.type,
      objective: serviceOrders.objective,
      status: serviceOrders.status,
      priority: serviceOrders.priority,
      workItemId: serviceOrders.workItemId,
      assetId: serviceOrders.assetId,
      assetCode: assets.code,
      assetName: assets.name,
      createdAt: serviceOrders.createdAt,
    })
    .from(serviceOrders)
    .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
    .orderBy(desc(serviceOrders.createdAt))
    .limit(50);
}

export async function getServiceOrderById(id: string) {
  const db = getDb();

  const [serviceOrder] = await db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      title: serviceOrders.title,
      type: serviceOrders.type,
      objective: serviceOrders.objective,
      status: serviceOrders.status,
      priority: serviceOrders.priority,
      workItemId: serviceOrders.workItemId,
      workItemTitle: workItems.title,
      assetId: serviceOrders.assetId,
      assetCode: assets.code,
      assetName: assets.name,
      completedAt: serviceOrders.completedAt,
      approvedAt: serviceOrders.approvedAt,
      createdAt: serviceOrders.createdAt,
      updatedAt: serviceOrders.updatedAt,
    })
    .from(serviceOrders)
    .leftJoin(workItems, eq(serviceOrders.workItemId, workItems.id))
    .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
    .where(eq(serviceOrders.id, id))
    .limit(1);

  return serviceOrder ?? null;
}

export async function getServiceOrderEvents(id: string) {
  const db = getDb();

  return db
    .select({
      id: eventLogs.id,
      eventType: eventLogs.eventType,
      payload: eventLogs.payload,
      occurredAt: eventLogs.occurredAt,
    })
    .from(eventLogs)
    .where(eq(eventLogs.serviceOrderId, id))
    .orderBy(desc(eventLogs.occurredAt));
}

export async function getServiceOrderAssignments(id: string) {
  const db = getDb();

  return db
    .select({
      id: serviceOrderAssignments.id,
      role: serviceOrderAssignments.role,
      assignedAt: serviceOrderAssignments.assignedAt,
      releasedAt: serviceOrderAssignments.releasedAt,
      technicianProfileId: technicianProfiles.id,
      technicianName: users.name,
      technicianEmail: users.email,
      technicianLevel: technicianProfiles.level,
      technicianSpecialty: technicianProfiles.specialty,
      technicianRegistrationCode: technicianProfiles.registrationCode,
      technicianIsAvailable: technicianProfiles.isAvailable,
      teamName: teams.name,
    })
    .from(serviceOrderAssignments)
    .innerJoin(
      technicianProfiles,
      eq(serviceOrderAssignments.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
    .where(eq(serviceOrderAssignments.serviceOrderId, id))
    .orderBy(desc(serviceOrderAssignments.assignedAt));
}

export async function getServiceOrderTimeEntries(id: string) {
  const db = getDb();

  return db
    .select({
      id: timeEntries.id,
      startedAt: timeEntries.startedAt,
      endedAt: timeEntries.endedAt,
      durationMinutes: timeEntries.durationMinutes,
      notes: timeEntries.notes,
      createdAt: timeEntries.createdAt,
      technicianProfileId: technicianProfiles.id,
      technicianName: users.name,
      technicianEmail: users.email,
      technicianRegistrationCode: technicianProfiles.registrationCode,
    })
    .from(timeEntries)
    .innerJoin(
      technicianProfiles,
      eq(timeEntries.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .where(eq(timeEntries.serviceOrderId, id))
    .orderBy(desc(timeEntries.startedAt));
}

export async function getServiceOrderEvidences(id: string) {
  const db = getDb();

  return db
    .select({
      id: evidences.id,
      title: evidences.title,
      description: evidences.description,
      fileUrl: evidences.fileUrl,
      mimeType: evidences.mimeType,
      createdAt: evidences.createdAt,
    })
    .from(evidences)
    .where(eq(evidences.serviceOrderId, id))
    .orderBy(desc(evidences.createdAt));
}

export async function getServiceOrderStages(id: string) {
  const db = getDb();

  return db
    .select({
      id: serviceOrderStages.id,
      title: serviceOrderStages.title,
      status: serviceOrderStages.status,
      position: serviceOrderStages.position,
      startedAt: serviceOrderStages.startedAt,
      completedAt: serviceOrderStages.completedAt,
      notes: serviceOrderStages.notes,
      createdAt: serviceOrderStages.createdAt,
    })
    .from(serviceOrderStages)
    .where(eq(serviceOrderStages.serviceOrderId, id))
    .orderBy(serviceOrderStages.position, serviceOrderStages.createdAt);
}

export async function getServiceOrderTasks(id: string) {
  const db = getDb();

  return db
    .select({
      id: serviceOrderTasks.id,
      stageId: serviceOrderTasks.stageId,
      title: serviceOrderTasks.title,
      description: serviceOrderTasks.description,
      status: serviceOrderTasks.status,
      dueAt: serviceOrderTasks.dueAt,
      completedAt: serviceOrderTasks.completedAt,
      technicianName: users.name,
      technicianEmail: users.email,
    })
    .from(serviceOrderTasks)
    .leftJoin(
      technicianProfiles,
      eq(serviceOrderTasks.assignedTechnicianProfileId, technicianProfiles.id),
    )
    .leftJoin(users, eq(technicianProfiles.userId, users.id))
    .where(eq(serviceOrderTasks.serviceOrderId, id))
    .orderBy(desc(serviceOrderTasks.createdAt));
}

export async function getServiceOrderTargets(id: string) {
  const db = getDb();

  return db
    .select({
      id: serviceOrderTargets.id,
      targetType: serviceOrderTargets.targetType,
      targetId: serviceOrderTargets.targetId,
      title: serviceOrderTargets.title,
      notes: serviceOrderTargets.notes,
      assetId: serviceOrderTargets.assetId,
      assetCode: assets.code,
      assetName: assets.name,
      workItemId: serviceOrderTargets.workItemId,
      workItemTitle: workItems.title,
      createdAt: serviceOrderTargets.createdAt,
    })
    .from(serviceOrderTargets)
    .leftJoin(assets, eq(serviceOrderTargets.assetId, assets.id))
    .leftJoin(workItems, eq(serviceOrderTargets.workItemId, workItems.id))
    .where(eq(serviceOrderTargets.serviceOrderId, id))
    .orderBy(desc(serviceOrderTargets.createdAt));
}

export async function getServiceOrderSummary() {
  const db = getDb();

  const [totalRow] = await db.select({ value: count() }).from(serviceOrders);
  const [openRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, "open"));
  const [inProgressRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, "in_progress"));
  const [completedRow] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, "completed"));

  return [
    { label: "OS", value: totalRow.value },
    { label: "Abertas", value: openRow.value },
    { label: "Em execucao", value: inProgressRow.value },
    { label: "Concluidas", value: completedRow.value },
  ];
}

export async function getServiceOrdersForWorkItem(workItemId: string) {
  const db = getDb();

  return db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      title: serviceOrders.title,
      type: serviceOrders.type,
      status: serviceOrders.status,
      priority: serviceOrders.priority,
      createdAt: serviceOrders.createdAt,
    })
    .from(serviceOrders)
    .where(eq(serviceOrders.workItemId, workItemId))
    .orderBy(desc(serviceOrders.createdAt));
}

export async function getServiceOrderTypeOptions() {
  const options = await getWorkspaceServiceOrderTypeOptions();
  return options.map((option: any) => ({
    ...option,
    value: option.value as ServiceOrderTypeValue,
  }));
}
