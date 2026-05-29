import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  acquisitionNeeds,
  assets,
  maintenancePlans,
  serviceOrders,
  teams,
  technicalProjects,
  workItems,
} from "@/db/schema";

export async function getMaintenancePlans() {
  const db = getDb();
  return db.select({
    id: maintenancePlans.id,
    title: maintenancePlans.title,
    status: maintenancePlans.status,
    priority: maintenancePlans.priority,
    periodStart: maintenancePlans.periodStart,
    periodEnd: maintenancePlans.periodEnd,
    objective: maintenancePlans.objective,
    assetId: maintenancePlans.assetId,
    assetCode: assets.code,
    assetName: assets.name,
    teamName: teams.name,
  }).from(maintenancePlans)
    .leftJoin(assets, eq(maintenancePlans.assetId, assets.id))
    .leftJoin(teams, eq(maintenancePlans.ownerTeamId, teams.id))
    .orderBy(desc(maintenancePlans.createdAt))
    .limit(80);
}

export async function getMaintenancePlanSummary() {
  const db = getDb();
  const [draft] = await db.select({ value: count() }).from(maintenancePlans).where(eq(maintenancePlans.status, "draft"));
  const [active] = await db.select({ value: count() }).from(maintenancePlans).where(eq(maintenancePlans.status, "in_progress"));
  const [approved] = await db.select({ value: count() }).from(maintenancePlans).where(eq(maintenancePlans.status, "approved"));
  return [
    { label: "Rascunhos", value: draft.value },
    { label: "Aprovados", value: approved.value },
    { label: "Em andamento", value: active.value },
  ];
}

export async function getTechnicalProjects() {
  const db = getDb();
  return db.select({
    id: technicalProjects.id,
    title: technicalProjects.title,
    status: technicalProjects.status,
    priority: technicalProjects.priority,
    sponsor: technicalProjects.sponsor,
    startsAt: technicalProjects.startsAt,
    targetEndsAt: technicalProjects.targetEndsAt,
    objective: technicalProjects.objective,
    scope: technicalProjects.scope,
    assetId: technicalProjects.assetId,
    assetCode: assets.code,
    assetName: assets.name,
    workItemId: technicalProjects.workItemId,
    workItemTitle: workItems.title,
  }).from(technicalProjects)
    .leftJoin(assets, eq(technicalProjects.assetId, assets.id))
    .leftJoin(workItems, eq(technicalProjects.workItemId, workItems.id))
    .orderBy(desc(technicalProjects.createdAt))
    .limit(80);
}

export async function getTechnicalProjectSummary() {
  const db = getDb();
  const [proposed] = await db.select({ value: count() }).from(technicalProjects).where(eq(technicalProjects.status, "proposed"));
  const [active] = await db.select({ value: count() }).from(technicalProjects).where(eq(technicalProjects.status, "in_progress"));
  const [completed] = await db.select({ value: count() }).from(technicalProjects).where(eq(technicalProjects.status, "completed"));
  return [
    { label: "Propostos", value: proposed.value },
    { label: "Em andamento", value: active.value },
    { label: "Concluidos", value: completed.value },
  ];
}

export async function getAcquisitionNeeds() {
  const db = getDb();
  return db.select({
    id: acquisitionNeeds.id,
    title: acquisitionNeeds.title,
    status: acquisitionNeeds.status,
    priority: acquisitionNeeds.priority,
    quantity: acquisitionNeeds.quantity,
    estimatedCostCents: acquisitionNeeds.estimatedCostCents,
    justification: acquisitionNeeds.justification,
    assetId: acquisitionNeeds.assetId,
    assetCode: assets.code,
    assetName: assets.name,
    serviceOrderId: acquisitionNeeds.serviceOrderId,
    serviceOrderCode: serviceOrders.code,
    projectId: acquisitionNeeds.projectId,
    projectTitle: technicalProjects.title,
  }).from(acquisitionNeeds)
    .leftJoin(assets, eq(acquisitionNeeds.assetId, assets.id))
    .leftJoin(serviceOrders, eq(acquisitionNeeds.serviceOrderId, serviceOrders.id))
    .leftJoin(technicalProjects, eq(acquisitionNeeds.projectId, technicalProjects.id))
    .orderBy(desc(acquisitionNeeds.createdAt))
    .limit(80);
}

export async function getAcquisitionSummary() {
  const db = getDb();
  const [identified] = await db.select({ value: count() }).from(acquisitionNeeds).where(eq(acquisitionNeeds.status, "identified"));
  const [requested] = await db.select({ value: count() }).from(acquisitionNeeds).where(eq(acquisitionNeeds.status, "requested"));
  const [approved] = await db.select({ value: count() }).from(acquisitionNeeds).where(eq(acquisitionNeeds.status, "approved"));
  return [
    { label: "Identificadas", value: identified.value },
    { label: "Solicitadas", value: requested.value },
    { label: "Aprovadas", value: approved.value },
  ];
}

export async function getStrategyOptions() {
  const db = getDb();
  const [assetRows, teamRows, workItemRows, serviceOrderRows, projectRows] = await Promise.all([
    db.select({ id: assets.id, code: assets.code, name: assets.name }).from(assets).orderBy(desc(assets.createdAt)).limit(50),
    db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(desc(teams.createdAt)).limit(50),
    db.select({ id: workItems.id, title: workItems.title }).from(workItems).orderBy(desc(workItems.createdAt)).limit(50),
    db.select({ id: serviceOrders.id, code: serviceOrders.code, title: serviceOrders.title }).from(serviceOrders).orderBy(desc(serviceOrders.createdAt)).limit(50),
    db.select({ id: technicalProjects.id, title: technicalProjects.title }).from(technicalProjects).orderBy(desc(technicalProjects.createdAt)).limit(50),
  ]);
  return { assets: assetRows, teams: teamRows, workItems: workItemRows, serviceOrders: serviceOrderRows, projects: projectRows };
}
