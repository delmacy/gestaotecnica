import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  complianceAudits,
  complianceFindings,
  teams,
} from "@/db/schema";

export async function getComplianceAudits() {
  const db = getDb();
  return db.select({
    id: complianceAudits.id,
    title: complianceAudits.title,
    area: complianceAudits.area,
    status: complianceAudits.status,
    priority: complianceAudits.priority,
    plannedAt: complianceAudits.plannedAt,
    completedAt: complianceAudits.completedAt,
    summary: complianceAudits.summary,
    teamName: teams.name,
    assetCode: assets.code,
    assetName: assets.name,
  }).from(complianceAudits)
    .leftJoin(teams, eq(complianceAudits.ownerTeamId, teams.id))
    .leftJoin(assets, eq(complianceAudits.assetId, assets.id))
    .orderBy(desc(complianceAudits.createdAt))
    .limit(80);
}

export async function getComplianceFindings() {
  const db = getDb();
  return db.select({
    id: complianceFindings.id,
    title: complianceFindings.title,
    severity: complianceFindings.severity,
    status: complianceFindings.status,
    dueAt: complianceFindings.dueAt,
    description: complianceFindings.description,
    correctiveAction: complianceFindings.correctiveAction,
    auditTitle: complianceAudits.title,
    teamName: teams.name,
  }).from(complianceFindings)
    .innerJoin(complianceAudits, eq(complianceFindings.auditId, complianceAudits.id))
    .leftJoin(teams, eq(complianceFindings.responsibleTeamId, teams.id))
    .orderBy(desc(complianceFindings.createdAt))
    .limit(80);
}

export async function getComplianceSummary() {
  const db = getDb();
  const [audits] = await db.select({ value: count() }).from(complianceAudits);
  const [requiresAction] = await db.select({ value: count() }).from(complianceAudits).where(eq(complianceAudits.status, "requires_action"));
  const [openFindings] = await db.select({ value: count() }).from(complianceFindings).where(eq(complianceFindings.status, "open"));
  return [
    { label: "Auditorias", value: audits.value },
    { label: "Requerem acao", value: requiresAction.value },
    { label: "Achados abertos", value: openFindings.value },
  ];
}

export async function getComplianceOptions() {
  const db = getDb();
  const [auditRows, teamRows, assetRows] = await Promise.all([
    db.select({ id: complianceAudits.id, title: complianceAudits.title }).from(complianceAudits).orderBy(desc(complianceAudits.createdAt)).limit(80),
    db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(desc(teams.createdAt)).limit(50),
    db.select({ id: assets.id, code: assets.code, name: assets.name }).from(assets).orderBy(desc(assets.createdAt)).limit(50),
  ]);
  return { audits: auditRows, teams: teamRows, assets: assetRows };
}
