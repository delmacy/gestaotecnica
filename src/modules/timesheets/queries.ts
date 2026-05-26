import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  serviceOrders,
  teams,
  technicianProfiles,
  timeEntries,
  users,
} from "@/db/schema";

export async function getTimesheetEntries() {
  const db = getDb();

  return db
    .select({
      id: timeEntries.id,
      startedAt: timeEntries.startedAt,
      endedAt: timeEntries.endedAt,
      durationMinutes: timeEntries.durationMinutes,
      notes: timeEntries.notes,
      createdAt: timeEntries.createdAt,
      serviceOrderId: serviceOrders.id,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      serviceOrderStatus: serviceOrders.status,
      technicianProfileId: technicianProfiles.id,
      technicianName: users.name,
      technicianEmail: users.email,
      technicianRegistrationCode: technicianProfiles.registrationCode,
      technicianLevel: technicianProfiles.level,
      teamName: teams.name,
    })
    .from(timeEntries)
    .innerJoin(serviceOrders, eq(timeEntries.serviceOrderId, serviceOrders.id))
    .innerJoin(
      technicianProfiles,
      eq(timeEntries.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
    .orderBy(desc(timeEntries.startedAt))
    .limit(120);
}

export async function getTimesheetSummary() {
  const db = getDb();

  const [totalRow] = await db
    .select({
      value: sql<number>`coalesce(sum(${timeEntries.durationMinutes}), 0)`,
    })
    .from(timeEntries);
  const [openRow] = await db
    .select({
      value: sql<number>`count(*) filter (where ${timeEntries.endedAt} is null)`,
    })
    .from(timeEntries);
  const [entriesRow] = await db
    .select({
      value: sql<number>`count(*)`,
    })
    .from(timeEntries);

  const totalMinutes = Number(totalRow.value ?? 0);

  return [
    { label: "Horas apontadas", value: Math.round(totalMinutes / 60) },
    { label: "Apontamentos", value: Number(entriesRow.value ?? 0) },
    { label: "Em aberto", value: Number(openRow.value ?? 0) },
  ];
}

export async function getTechnicianTimeSummary() {
  const db = getDb();

  return db
    .select({
      technicianProfileId: technicianProfiles.id,
      technicianName: users.name,
      technicianEmail: users.email,
      teamName: teams.name,
      entries: sql<number>`count(${timeEntries.id})`,
      minutes: sql<number>`coalesce(sum(${timeEntries.durationMinutes}), 0)`,
    })
    .from(timeEntries)
    .innerJoin(
      technicianProfiles,
      eq(timeEntries.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
    .groupBy(technicianProfiles.id, users.name, users.email, teams.name)
    .orderBy(desc(sql`coalesce(sum(${timeEntries.durationMinutes}), 0)`))
    .limit(30);
}
