import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  eventLogs,
  workflowInstances,
  workflowTemplates,
  workflowTransitions,
} from "@/db/schema";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

type WorkflowTemplateSnapshot = {
  key: string;
  label: string;
  target: string;
  states: string[];
  config: unknown;
};

function normalizeStates(states: unknown) {
  return Array.isArray(states)
    ? states.map((state) => String(state).trim()).filter(Boolean)
    : [];
}

export async function getActiveWorkflowTemplateForTarget(targetType: string) {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const [template] = await db
    .select()
    .from(workflowTemplates)
    .where(
      and(
        eq(workflowTemplates.workspaceId, workspace.id),
        eq(workflowTemplates.target, targetType),
        eq(workflowTemplates.isActive, true),
      ),
    )
    .orderBy(workflowTemplates.sortOrder, workflowTemplates.label)
    .limit(1);

  return template ?? null;
}

export async function startWorkflowInstanceForTarget({
  targetType,
  targetId,
  actorId,
}: {
  targetType: string;
  targetId: string;
  actorId?: string | null;
}) {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const [existing] = await db
    .select()
    .from(workflowInstances)
    .where(
      and(
        eq(workflowInstances.workspaceId, workspace.id),
        eq(workflowInstances.targetType, targetType),
        eq(workflowInstances.targetId, targetId),
        eq(workflowInstances.status, "active"),
      ),
    )
    .orderBy(desc(workflowInstances.startedAt))
    .limit(1);

  if (existing) return existing;

  const template = await getActiveWorkflowTemplateForTarget(targetType);
  if (!template) return null;

  const states = normalizeStates(template.states);
  const currentState = states[0] ?? "open";
  const snapshot: WorkflowTemplateSnapshot = {
    key: template.key,
    label: template.label,
    target: template.target,
    states,
    config: template.config,
  };

  const [instance] = await db
    .insert(workflowInstances)
    .values({
      workspaceId: workspace.id,
      workflowTemplateId: template.id,
      targetType,
      targetId,
      currentState,
      snapshot,
      startedById: actorId ?? undefined,
    })
    .returning();

  await db.insert(workflowTransitions).values({
    workflowInstanceId: instance.id,
    fromState: "__start__",
    toState: currentState,
    actorId: actorId ?? undefined,
    payload: { templateKey: template.key, targetType, targetId },
  });

  await db.insert(eventLogs).values({
    eventType: "workflow.instance_started",
    entityType: targetType,
    entityId: targetId,
    payload: {
      workflowInstanceId: instance.id,
      templateKey: template.key,
      currentState,
    },
  });

  return instance;
}

export async function transitionWorkflowInstance({
  workflowInstanceId,
  toState,
  actorId,
  note,
}: {
  workflowInstanceId: string;
  toState: string;
  actorId?: string | null;
  note?: string;
}) {
  const db = getDb();
  const [instance] = await db
    .select()
    .from(workflowInstances)
    .where(eq(workflowInstances.id, workflowInstanceId))
    .limit(1);

  if (!instance) throw new Error("Instancia de workflow nao encontrada.");
  if (instance.status !== "active") throw new Error("Workflow nao esta ativo.");

  const states = normalizeStates((instance.snapshot as WorkflowTemplateSnapshot | null)?.states);
  if (states.length > 0 && !states.includes(toState)) {
    throw new Error("Estado nao permitido para este workflow.");
  }

  const completedAt =
    states.length > 0 && states[states.length - 1] === toState ? new Date() : undefined;
  const status = completedAt ? "completed" : "active";

  const [updated] = await db
    .update(workflowInstances)
    .set({
      currentState: toState,
      status,
      completedAt,
      updatedAt: new Date(),
    })
    .where(eq(workflowInstances.id, instance.id))
    .returning();

  await db.insert(workflowTransitions).values({
    workflowInstanceId: instance.id,
    fromState: instance.currentState,
    toState,
    actorId: actorId ?? undefined,
    note,
    payload: { targetType: instance.targetType, targetId: instance.targetId },
  });

  await db.insert(eventLogs).values({
    eventType: "workflow.transitioned",
    entityType: instance.targetType,
    entityId: instance.targetId,
    payload: {
      workflowInstanceId: instance.id,
      from: instance.currentState,
      to: toState,
      note,
    },
  });

  return updated;
}
