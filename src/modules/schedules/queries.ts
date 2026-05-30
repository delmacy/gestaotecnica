import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { schedules, teams, technicianProfiles, users } from "@/db/schema";
import { getWorkspaceScheduleTypeOptions } from "@/platform/workspaces/catalogs";
import type { ScheduleTypeValue } from "./constants";

export async function getSchedules() {
  const db = getDb();

  return db
    .select({
      id: schedules.id,
      title: schedules.title,
      type: schedules.type,
      status: schedules.status,
      startsAt: schedules.startsAt,
      endsAt: schedules.endsAt,
      notes: schedules.notes,
      technicianName: users.name,
      technicianEmail: users.email,
      teamName: teams.name,
      createdAt: schedules.createdAt,
    })
    .from(schedules)
    .leftJoin(
      technicianProfiles,
      eq(schedules.technicianProfileId, technicianProfiles.id),
    )
    .leftJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(schedules.teamId, teams.id))
    .orderBy(desc(schedules.startsAt))
    .limit(80);
}

export async function getScheduleSummary() {
  const db = getDb();
  const [planned] = await db
    .select({ value: count() })
    .from(schedules)
    .where(eq(schedules.status, "planned"));
  const [confirmed] = await db
    .select({ value: count() })
    .from(schedules)
    .where(eq(schedules.status, "confirmed"));
  const [onCall] = await db
    .select({ value: count() })
    .from(schedules)
    .where(eq(schedules.type, "sobreaviso"));

  return [
    { label: "Planejadas", value: planned.value },
    { label: "Confirmadas", value: confirmed.value },
    { label: "Sobreaviso", value: onCall.value },
  ];
}

export async function getScheduleTypeOptions() {
  const options = await getWorkspaceScheduleTypeOptions();
  return options.map((option) => ({
    ...option,
    value: option.value as ScheduleTypeValue,
  }));
}
