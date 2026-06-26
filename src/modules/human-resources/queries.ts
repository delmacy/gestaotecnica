import { eq, desc, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { EmployeeProfile, EmployeeHistoryEvent } from "./contracts/hr.schema";

const HR_ORIGIN = "human-resources";

function mapRowToEmployee(row: any): EmployeeProfile {
  const proposed = (row.proposedDefinition as Record<string, any>) || {};
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    registrationCode: proposed.registrationCode || "",
    name: row.name,
    position: proposed.position || "",
    department: proposed.department || "",
    managerId: proposed.managerId,
    managerName: proposed.managerName,
    admissionDate: proposed.admissionDate || "",
    status: row.status as any,
    contacts: proposed.contacts || [],
    observations: row.description ?? undefined,
    metadata: proposed.metadata || {},
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getEmployees(filters?: { status?: string; department?: string }): Promise<EmployeeProfile[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, HR_ORIGIN),
        filters?.status ? eq(processCandidates.status, filters.status) : undefined
      )
    )
    .orderBy(desc(processCandidates.createdAt))
    .limit(100);

  // Client-side filtering for department since it's in JSONB
  let employees = results.map(mapRowToEmployee);

  if (filters?.department) {
    employees = employees.filter((e: EmployeeProfile) => e.department === filters.department);
  }

  return employees;
}

export async function getEmployeeById(id: string): Promise<EmployeeProfile | null> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const [row] = await db
    .select()
    .from(processCandidates)
    .where(
      and(
        eq(processCandidates.id, id),
        eq(processCandidates.workspaceId, context.workspaceId),
        eq(processCandidates.origin, HR_ORIGIN)
      )
    )
    .limit(1);

  if (!row) return null;

  return mapRowToEmployee(row);
}

export async function getEmployeeHistory(id: string): Promise<EmployeeHistoryEvent[]> {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const db = getDb();

  const results = await db
    .select({
      id: eventLogs.id,
      entityId: eventLogs.entityId,
      eventType: eventLogs.eventType,
      payload: eventLogs.payload,
      occurredAt: eventLogs.createdAt,
    })
    .from(eventLogs)
    .where(
      and(
        eq(eventLogs.entityId, id),
        eq(eventLogs.workspaceId, context.workspaceId)
      )
    )
    .orderBy(desc(eventLogs.createdAt));

  return results as EmployeeHistoryEvent[];
}
