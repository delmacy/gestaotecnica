import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { automationRunLogs, automationRuns, automationRules } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type RunAutomationInput = {
  automationRuleId?: string;
  note?: string;
};

export const runAutomationKernelAction: ActionDefinition<RunAutomationInput, { runId: string; status: string }> = {
  key: "automations.run",
  moduleKey: "automations",
  description: "Executa uma automacao ativa em modo manual-first.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["automation_rule.executed"],
  async handler(input) {
    const automationRuleId = String(input.automationRuleId ?? "").trim();
    if (!automationRuleId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "automationRuleId e obrigatorio." },
      };
    }

    const db = getDb();
    const [rule] = await db
      .select({
        id: automationRules.id,
        name: automationRules.name,
        status: automationRules.status,
        provider: automationRules.provider,
        endpointUrl: automationRules.endpointUrl,
        triggerType: automationRules.triggerType,
        payload: automationRules.payload,
      })
      .from(automationRules)
      .where(eq(automationRules.id, automationRuleId))
      .limit(1);

    if (!rule) {
      return { success: false, error: { code: "NOT_FOUND", message: "Automacao nao encontrada." } };
    }
    if (rule.status !== "active") {
      return { success: false, error: { code: "INVALID_STATUS", message: "Automacao precisa estar ativa." } };
    }

    const startedAt = new Date();
    const [run] = await db
      .insert(automationRuns)
      .values({
        automationRuleId: rule.id,
        status: "running",
        triggerSource: "kernel_action",
        requestPayload: {
          note: input.note,
          triggerType: rule.triggerType,
          provider: rule.provider,
          endpointUrl: rule.endpointUrl,
          configuredPayload: rule.payload,
        },
      })
      .returning({ id: automationRuns.id });

    const finishedAt = new Date();
    await db
      .update(automationRuns)
      .set({
        status: "succeeded",
        finishedAt,
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        responsePayload: { mode: "manual-first" },
      })
      .where(eq(automationRuns.id, run.id));

    await db.insert(automationRunLogs).values({
      automationRunId: run.id,
      level: "info",
      message: "Automacao executada via Platform Kernel.",
      payload: { ruleName: rule.name },
    });

    await db.update(automationRules).set({ lastRunAt: finishedAt, updatedAt: finishedAt }).where(eq(automationRules.id, rule.id));

    return {
      success: true,
      data: { runId: run.id, status: "succeeded" },
      events: [
        {
          eventType: "automation_rule.executed",
          entityType: "automation_rule",
          entityId: rule.id,
          payload: { runId: run.id, ruleName: rule.name, status: "succeeded" },
        },
      ],
    };
  },
};
