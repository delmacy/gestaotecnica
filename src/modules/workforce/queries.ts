import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams, technicianProfiles, users } from "@/db/schema";

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

export async function getTechnicians() {
  const db = getDb();

  return db
    .select({
      id: technicianProfiles.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      userStatus: users.status,
      teamId: teams.id,
      teamName: teams.name,
      level: technicianProfiles.level,
      registrationCode: technicianProfiles.registrationCode,
      specialty: technicianProfiles.specialty,
      isAvailable: technicianProfiles.isAvailable,
      createdAt: technicianProfiles.createdAt,
    })
    .from(technicianProfiles)
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
    .orderBy(desc(technicianProfiles.createdAt))
    .limit(50);
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

export async function getWorkforceSummary() {
  const db = getDb();

  const [techniciansRow] = await db.select({ value: count() }).from(technicianProfiles);
  const [availableRow] = await db
    .select({ value: count() })
    .from(technicianProfiles)
    .where(eq(technicianProfiles.isAvailable, true));
  const [teamsRow] = await db.select({ value: count() }).from(teams);
  const [supervisorsRow] = await db
    .select({ value: count() })
    .from(technicianProfiles)
    .where(eq(technicianProfiles.level, "supervisor"));

  return [
    { label: "Tecnicos", value: techniciansRow.value },
    { label: "Disponiveis", value: availableRow.value },
    { label: "Equipes", value: teamsRow.value },
    { label: "Supervisores", value: supervisorsRow.value },
  ];
}
