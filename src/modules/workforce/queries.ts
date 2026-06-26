import { count, desc, eq, and, sql } from "drizzle-orm";
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

/**
 * BLOCKED: getTeams cannot guarantee workspace isolation yet (missing workspaceId in legacy teams table).
 * Returns empty for now to enforce multi-tenancy safety.
 */
export async function getTeams() {
  return [];
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
        eq(processCandidates.origin, WORKFORCE_UNAVAILABILITY_ORIGIN),
        memberId ? sql`${processCandidates.proposedDefinition}->>'memberId' = ${memberId}` : undefined
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(50);

  return results.map((row: any) => mapRowToUnavailability(row));
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

/**
 * BLOCKED: Legacy queries below are blocked/limited to ensure workspace isolation.
 */
export async function getWorkforceAllocations() { return []; }
export async function getTechnicianUnavailabilities() { return []; }
export async function getWorkforceAllocationOptions(): Promise<WorkforceAllocationOptions> {
  return { technicians: [], serviceOrders: [], workItems: [], schedules: [] };
}

export async function getTechnicianOptions(): Promise<any[]> {
  return [];
}

export async function getWorkforceMemberOptions(): Promise<any[]> {
  return [];
}
