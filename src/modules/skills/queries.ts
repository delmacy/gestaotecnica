import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  skillCatalog,
  teams,
  technicianProfiles,
  technicianSkills,
  trainingRecords,
  users,
} from "@/db/schema";

export type SkillsOptions = {
  skills: Array<{ id: string; name: string; category: string | null }>;
  technicians: Array<{ id: string; name: string; teamName: string | null }>;
};

export async function getSkills() {
  const db = getDb();
  return db.select({
    id: skillCatalog.id,
    name: skillCatalog.name,
    category: skillCatalog.category,
    description: skillCatalog.description,
    isActive: skillCatalog.isActive,
  }).from(skillCatalog)
    .orderBy(desc(skillCatalog.createdAt))
    .limit(80);
}

export async function getTechnicianSkillMatrix() {
  const db = getDb();
  return db.select({
    id: technicianSkills.id,
    proficiency: technicianSkills.proficiency,
    certifiedAt: technicianSkills.certifiedAt,
    expiresAt: technicianSkills.expiresAt,
    notes: technicianSkills.notes,
    technicianName: users.name,
    teamName: teams.name,
    skillName: skillCatalog.name,
    skillCategory: skillCatalog.category,
  }).from(technicianSkills)
    .innerJoin(technicianProfiles, eq(technicianSkills.technicianProfileId, technicianProfiles.id))
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
    .innerJoin(skillCatalog, eq(technicianSkills.skillId, skillCatalog.id))
    .orderBy(desc(technicianSkills.createdAt))
    .limit(80);
}

export async function getTrainingRecords() {
  const db = getDb();
  return db.select({
    id: trainingRecords.id,
    title: trainingRecords.title,
    provider: trainingRecords.provider,
    status: trainingRecords.status,
    startedAt: trainingRecords.startedAt,
    completedAt: trainingRecords.completedAt,
    expiresAt: trainingRecords.expiresAt,
    notes: trainingRecords.notes,
    technicianName: users.name,
    skillName: skillCatalog.name,
  }).from(trainingRecords)
    .leftJoin(technicianProfiles, eq(trainingRecords.technicianProfileId, technicianProfiles.id))
    .leftJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(skillCatalog, eq(trainingRecords.skillId, skillCatalog.id))
    .orderBy(desc(trainingRecords.createdAt))
    .limit(80);
}

export async function getSkillsSummary() {
  const db = getDb();
  const [skills] = await db.select({ value: count() }).from(skillCatalog);
  const [assignments] = await db.select({ value: count() }).from(technicianSkills);
  const [activeTrainings] = await db.select({ value: count() }).from(trainingRecords).where(eq(trainingRecords.status, "in_progress"));
  return [
    { label: "Competencias", value: skills.value },
    { label: "Vinculos tecnicos", value: assignments.value },
    { label: "Treinamentos ativos", value: activeTrainings.value },
  ];
}

export async function getSkillsOptions(): Promise<SkillsOptions> {
  const db = getDb();
  const [skillRows, technicianRows] = await Promise.all([
    db.select({ id: skillCatalog.id, name: skillCatalog.name, category: skillCatalog.category }).from(skillCatalog).orderBy(desc(skillCatalog.createdAt)).limit(80),
    db.select({
      id: technicianProfiles.id,
      name: users.name,
      teamName: teams.name,
    }).from(technicianProfiles)
      .innerJoin(users, eq(technicianProfiles.userId, users.id))
      .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
      .orderBy(desc(technicianProfiles.createdAt))
      .limit(80),
  ]);
  return { skills: skillRows, technicians: technicianRows };
}
