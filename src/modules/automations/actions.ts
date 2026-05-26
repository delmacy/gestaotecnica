"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { automationRules, eventLogs } from "@/db/schema";
import { automationStatuses, type AutomationStatusValue } from "./constants";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function readEnum<T extends string>(
  formData: FormData,
  field: string,
  allowedValues: readonly { value: T; label: string }[],
  fallback: T,
) {
  const value = String(formData.get(field) ?? fallback);
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export async function createAutomationRule(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const triggerType = readRequiredText(formData, "triggerType");
  const provider = readOptionalText(formData, "provider");
  const endpointUrl = readOptionalText(formData, "endpointUrl");
  const scheduleExpression = readOptionalText(formData, "scheduleExpression");
  const description = readOptionalText(formData, "description");
  const status = readEnum<AutomationStatusValue>(
    formData,
    "status",
    automationStatuses,
    "draft",
  );
  const db = getDb();

  const [rule] = await db.insert(automationRules).values({
    name,
    triggerType,
    provider,
    endpointUrl,
    scheduleExpression,
    description,
    status,
    payload: {},
  }).returning({
    id: automationRules.id,
    name: automationRules.name,
    triggerType: automationRules.triggerType,
    status: automationRules.status,
  });

  await db.insert(eventLogs).values({
    eventType: "automation_rule.created",
    entityType: "automation_rule",
    entityId: rule.id,
    payload: rule,
  });

  revalidatePath("/");
  revalidatePath("/automations");
  revalidatePath("/events");
  redirect("/automations");
}

export async function updateAutomationRuleStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<AutomationStatusValue>(
    formData,
    "status",
    automationStatuses,
    "draft",
  );
  const db = getDb();
  const [previous] = await db.select({
    id: automationRules.id,
    name: automationRules.name,
    status: automationRules.status,
  }).from(automationRules).where(eq(automationRules.id, id)).limit(1);

  if (!previous) throw new Error("Automacao nao encontrada.");

  await db.update(automationRules).set({ status, updatedAt: new Date() }).where(eq(automationRules.id, id));
  await db.insert(eventLogs).values({
    eventType: "automation_rule.status_changed",
    entityType: "automation_rule",
    entityId: previous.id,
    payload: { name: previous.name, from: previous.status, to: status },
  });

  revalidatePath("/automations");
  revalidatePath("/events");
  redirect("/automations");
}
