import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
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
import { getWorkspaceTechnicianLevelOptions } from "@/platform/workspaces/catalogs";
import type { TechnicianLevelValue } from "./constants";

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
    { label: "Responsavels", value: techniciansRow.value },
    { label: "Disponiveis", value: availableRow.value },
    { label: "Equipes", value: teamsRow.value },
    { label: "Supervisores", value: supervisorsRow.value },
  ];
}

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

export async function getTechnicianUnavailabilities() {
  const db = getDb();

  return db
    .select({
      id: technicianUnavailabilities.id,
      reason: technicianUnavailabilities.reason,
      startsAt: technicianUnavailabilities.startsAt,
      endsAt: technicianUnavailabilities.endsAt,
      notes: technicianUnavailabilities.notes,
      technicianName: users.name,
      technicianEmail: users.email,
      technicianLevel: technicianProfiles.level,
    })
    .from(technicianUnavailabilities)
    .innerJoin(
      technicianProfiles,
      eq(technicianUnavailabilities.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .orderBy(desc(technicianUnavailabilities.startsAt))
    .limit(80);
}

export async function getWorkforceAllocationOptions() {
  const db = getDb();

  const [technicians, serviceOrdersRows, workItemsRows, schedulesRows] = await Promise.all([
    getTechnicianOptions(),
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
    technicians,
    serviceOrders: serviceOrdersRows,
    workItems: workItemsRows,
    schedules: schedulesRows,
  };
}

export async function getTechnicianLevelOptions() {
  const options = await getWorkspaceTechnicianLevelOptions();
  return options.map((option) => ({
    ...option,
    value: option.value as TechnicianLevelValue,
  }));
}
