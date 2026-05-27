import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { automationRunLogs, automationRuns, automationRules } from "@/db/schema";

export async function getAutomationRules() {
  const db = getDb();
  return db.select({
    id: automationRules.id,
    name: automationRules.name,
    triggerType: automationRules.triggerType,
    status: automationRules.status,
    provider: automationRules.provider,
    endpointUrl: automationRules.endpointUrl,
    scheduleExpression: automationRules.scheduleExpression,
    description: automationRules.description,
    lastRunAt: automationRules.lastRunAt,
  }).from(automationRules)
    .orderBy(desc(automationRules.createdAt))
    .limit(80);
}

export async function getAutomationSummary() {
  const db = getDb();
  const [draft] = await db.select({ value: count() }).from(automationRules).where(eq(automationRules.status, "draft"));
  const [active] = await db.select({ value: count() }).from(automationRules).where(eq(automationRules.status, "active"));
  const [failed] = await db.select({ value: count() }).from(automationRules).where(eq(automationRules.status, "failed"));
  return [
    { label: "Rascunhos", value: draft.value },
    { label: "Ativas", value: active.value },
    { label: "Com falha", value: failed.value },
  ];
}

export async function getAutomationRuns() {
  const db = getDb();

  return db
    .select({
      id: automationRuns.id,
      status: automationRuns.status,
      triggerSource: automationRuns.triggerSource,
      startedAt: automationRuns.startedAt,
      finishedAt: automationRuns.finishedAt,
      durationMs: automationRuns.durationMs,
      errorMessage: automationRuns.errorMessage,
      automationRuleId: automationRules.id,
      automationRuleName: automationRules.name,
      provider: automationRules.provider,
      triggerType: automationRules.triggerType,
    })
    .from(automationRuns)
    .innerJoin(automationRules, eq(automationRuns.automationRuleId, automationRules.id))
    .orderBy(desc(automationRuns.startedAt))
    .limit(80);
}

export async function getRecentAutomationRunLogs() {
  const db = getDb();

  return db
    .select({
      id: automationRunLogs.id,
      level: automationRunLogs.level,
      message: automationRunLogs.message,
      occurredAt: automationRunLogs.occurredAt,
      automationRunId: automationRuns.id,
      automationRuleName: automationRules.name,
    })
    .from(automationRunLogs)
    .innerJoin(automationRuns, eq(automationRunLogs.automationRunId, automationRuns.id))
    .innerJoin(automationRules, eq(automationRuns.automationRuleId, automationRules.id))
    .orderBy(desc(automationRunLogs.occurredAt))
    .limit(80);
}
