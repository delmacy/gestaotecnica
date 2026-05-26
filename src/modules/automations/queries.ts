import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { automationRules } from "@/db/schema";

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
