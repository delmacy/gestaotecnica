import { count, desc, eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import {
  schedules,
  serviceOrders,
  teams,
  technicianProfiles,
  technicianUnavailabilities,
  users,
  workforceAllocations,
  workItems,
} from "@/db/schema";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { getWorkspaceTechnicianLevelOptions } from "@/platform/workspaces/catalogs";
import type { TechnicianLevelValue } from "./constants";
import type { WorkforceMember, WorkforceUnavailability } from "./contracts/workforce.schema";

const WORKFORCE_MEMBER_ORIGIN = "workforce.member";
const WORKFORCE_UNAVAILABILITY_ORIGIN = "workforce.unavailability";

export type WorkforceAllocationOptions = {
  technicians: Array<{
    id: string;
    name: string;
    email: string;
    teamName: string | null;
    level: string;
    specialty: string | null;
    registrationCode: string | null;
  }>;
  serviceOrders: Array<{ id: string; code: string; title: string }>;
  workItems: Array<{ id: string; title: string }>;
  schedules: Array<{ id: string; title: string }>;
};

export async function getTeams() {
  const db = getDb();
  return db
    .select({
      id: teams.id,
      name: teams.name,
      description: teams.description,
      isActive: teams.isActive,
      createdAt: teams.createdAt,
    })
    .from(teams)
    .orderBy(desc(teams.createdAt))
    .limit(50);
}

export async function getTechnicians(): Promise<WorkforceMember[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, WORKFORCE_MEMBER_ORIGIN)
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(100);

  return results.map((row: any) => mapRowToWorkforceMember(row));
}

export async function getTechnicianById(id: string): Promise<WorkforceMember | null> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, WORKFORCE_MEMBER_ORIGIN)
      )
    )
    .limit(1);

  if (!row) return null;
  return mapRowToWorkforceMember(row);
}

function mapRowToWorkforceMember(row: any): WorkforceMember {
  const data = (row.proposedDefinition as Record<string, any>) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    userId: data.userId,
    name: row.name,
    teamId: data.teamId,
    level: data.level || "trainee",
    function: data.function,
    competencies: data.competencies || [],
    registrationCode: data.registrationCode,
    specialty: data.specialty,
    status: row.status as any,
    isAvailable: data.isAvailable ?? true,
    metadata: data.metadata || {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getUnavailabilities(memberId?: string): Promise<WorkforceUnavailability[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, WORKFORCE_UNAVAILABILITY_ORIGIN)
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(50);

  const list = results.map((row: any) => mapRowToUnavailability(row));
  if (memberId) return list.filter((u: WorkforceUnavailability) => u.memberId === memberId);
  return list;
}

function mapRowToUnavailability(row: any): WorkforceUnavailability {
  const data = (row.proposedDefinition as Record<string, any>) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    memberId: data.memberId,
    reason: data.reason,
    startsAt: new Date(data.startsAt),
    endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
    status: row.status as any,
    notes: row.description || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getWorkforceSummary() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [total] = await db
    .select({ value: count() })
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, WORKFORCE_MEMBER_ORIGIN)
      )
    );

  const [active] = await db
    .select({ value: count() })
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, WORKFORCE_MEMBER_ORIGIN),
        eq(processCandidates.status, "active")
      )
    );

  return [
    { label: "Membros", value: total.value },
    { label: "Ativos", value: active.value },
  ];
}

export async function getTechnicianLevelOptions() {
  const options = await getWorkspaceTechnicianLevelOptions();
  return options.map((option) => ({
    ...option,
    value: option.value as TechnicianLevelValue,
  }));
}

export async function getWorkforceHistory(entityId: string, entityType: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();
  return db
    .select()
    .from(eventLogs)
    .where(
      and(
        eq(eventLogs.workspaceId, context.workspaceId),
        eq(eventLogs.entityId, entityId),
        eq(eventLogs.entityType, entityType)
      )
    )
    .orderBy(desc(eventLogs.createdAt));
}

// Minimal options for forms
export async function getWorkforceMemberOptions() {
  const members = await getTechnicians();
  return members.map(m => ({ id: m.id, name: m.name }));
}

// Aliases for compatibility with legacy components
export const getTechnicianUnavailabilities = getUnavailabilities;

export async function getWorkforceAllocations() {
  const db = getDb();

  return db
    .select({
      id: workforceAllocations.id,
      allocationType: workforceAllocations.allocationType,
      status: workforceAllocations.status,
      startsAt: workforceAllocations.startsAt,
      endsAt: workforceAllocations.endsAt,
      effortMinutes: workforceAllocations.effortMinutes,
      notes: workforceAllocations.notes,
      technicianName: users.name,
      technicianEmail: users.email,
      technicianLevel: technicianProfiles.level,
      teamName: teams.name,
      serviceOrderId: serviceOrders.id,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      workItemId: workItems.id,
      workItemTitle: workItems.title,
      scheduleId: schedules.id,
      scheduleTitle: schedules.title,
    })
    .from(workforceAllocations)
    .innerJoin(
      technicianProfiles,
      eq(workforceAllocations.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(workforceAllocations.teamId, teams.id))
    .leftJoin(serviceOrders, eq(workforceAllocations.serviceOrderId, serviceOrders.id))
    .leftJoin(workItems, eq(workforceAllocations.workItemId, workItems.id))
    .leftJoin(schedules, eq(workforceAllocations.scheduleId, schedules.id))
    .orderBy(desc(workforceAllocations.createdAt))
    .limit(80);
}

export async function getWorkforceAllocationOptions(): Promise<WorkforceAllocationOptions> {
  const db = getDb();

  const [techniciansRows, serviceOrdersRows, workItemsRows, schedulesRows] = await Promise.all([
    db
      .select({
        id: technicianProfiles.id,
        name: users.name,
        email: users.email,
        teamName: teams.name,
        level: technicianProfiles.level,
        specialty: technicianProfiles.specialty,
        registrationCode: technicianProfiles.registrationCode,
      })
      .from(technicianProfiles)
      .innerJoin(users, eq(technicianProfiles.userId, users.id))
      .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
      .where(eq(technicianProfiles.isAvailable, true))
      .orderBy(desc(technicianProfiles.createdAt))
      .limit(100),
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
      })
      .from(serviceOrders)
      .orderBy(desc(serviceOrders.createdAt))
      .limit(60),
    db
      .select({
        id: workItems.id,
        title: workItems.title,
      })
      .from(workItems)
      .orderBy(desc(workItems.createdAt))
      .limit(60),
    db
      .select({
        id: schedules.id,
        title: schedules.title,
      })
      .from(schedules)
      .orderBy(desc(schedules.createdAt))
      .limit(60),
  ]);

  return {
    technicians: techniciansRows,
    serviceOrders: serviceOrdersRows,
    workItems: workItemsRows,
    schedules: schedulesRows,
  };
}

export async function getTechnicianOptions() {
  const db = getDb();
  return db
    .select({
      id: technicianProfiles.id,
      name: users.name,
      email: users.email,
      teamName: teams.name,
      level: technicianProfiles.level,
      specialty: technicianProfiles.specialty,
      registrationCode: technicianProfiles.registrationCode,
    })
    .from(technicianProfiles)
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
    .where(eq(technicianProfiles.isAvailable, true))
    .orderBy(desc(technicianProfiles.createdAt))
    .limit(100);
}
