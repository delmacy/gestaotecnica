import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  acquisitionNeeds,
  assets,
  resourceNeeds,
  teams,
  technicalProjects,
} from "@/db/schema";

export async function getResourceNeeds() {
  const db = getDb();
  return db.select({
    id: resourceNeeds.id,
    title: resourceNeeds.title,
    category: resourceNeeds.category,
    status: resourceNeeds.status,
    priority: resourceNeeds.priority,
    quantity: resourceNeeds.quantity,
    justification: resourceNeeds.justification,
    assetCode: assets.code,
    assetName: assets.name,
    projectTitle: technicalProjects.title,
    acquisitionTitle: acquisitionNeeds.title,
    teamName: teams.name,
  }).from(resourceNeeds)
    .leftJoin(assets, eq(resourceNeeds.assetId, assets.id))
    .leftJoin(technicalProjects, eq(resourceNeeds.projectId, technicalProjects.id))
    .leftJoin(acquisitionNeeds, eq(resourceNeeds.acquisitionNeedId, acquisitionNeeds.id))
    .leftJoin(teams, eq(resourceNeeds.ownerTeamId, teams.id))
    .orderBy(desc(resourceNeeds.createdAt))
    .limit(80);
}

export async function getResourceNeedsSummary() {
  const db = getDb();
  const [identified] = await db.select({ value: count() }).from(resourceNeeds).where(eq(resourceNeeds.status, "identified"));
  const [approved] = await db.select({ value: count() }).from(resourceNeeds).where(eq(resourceNeeds.status, "approved"));
  const [fulfilled] = await db.select({ value: count() }).from(resourceNeeds).where(eq(resourceNeeds.status, "fulfilled"));
  return [
    { label: "Identificadas", value: identified.value },
    { label: "Aprovadas", value: approved.value },
    { label: "Atendidas", value: fulfilled.value },
  ];
}

export async function getResourceNeedOptions() {
  const db = getDb();
  const [assetRows, teamRows, projectRows, acquisitionRows] = await Promise.all([
    db.select({ id: assets.id, code: assets.code, name: assets.name }).from(assets).orderBy(desc(assets.createdAt)).limit(50),
    db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(desc(teams.createdAt)).limit(50),
    db.select({ id: technicalProjects.id, title: technicalProjects.title }).from(technicalProjects).orderBy(desc(technicalProjects.createdAt)).limit(50),
    db.select({ id: acquisitionNeeds.id, title: acquisitionNeeds.title }).from(acquisitionNeeds).orderBy(desc(acquisitionNeeds.createdAt)).limit(50),
  ]);
  return { assets: assetRows, teams: teamRows, projects: projectRows, acquisitions: acquisitionRows };
}
