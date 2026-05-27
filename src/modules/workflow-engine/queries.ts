import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  workflowInstances,
  workflowTemplates,
  workflowTransitions,
} from "@/db/schema";

export async function getWorkflowInstances(limit = 80) {
  const db = getDb();

  return db
    .select({
      id: workflowInstances.id,
      targetType: workflowInstances.targetType,
      targetId: workflowInstances.targetId,
      currentState: workflowInstances.currentState,
      status: workflowInstances.status,
      startedAt: workflowInstances.startedAt,
      completedAt: workflowInstances.completedAt,
      templateKey: workflowTemplates.key,
      templateLabel: workflowTemplates.label,
    })
    .from(workflowInstances)
    .innerJoin(workflowTemplates, eq(workflowInstances.workflowTemplateId, workflowTemplates.id))
    .orderBy(desc(workflowInstances.startedAt))
    .limit(limit);
}

export async function getWorkflowInstancesForTarget(targetType: string, targetId: string) {
  const db = getDb();

  return db
    .select({
      id: workflowInstances.id,
      currentState: workflowInstances.currentState,
      status: workflowInstances.status,
      snapshot: workflowInstances.snapshot,
      startedAt: workflowInstances.startedAt,
      completedAt: workflowInstances.completedAt,
      templateKey: workflowTemplates.key,
      templateLabel: workflowTemplates.label,
    })
    .from(workflowInstances)
    .innerJoin(workflowTemplates, eq(workflowInstances.workflowTemplateId, workflowTemplates.id))
    .where(
      and(
        eq(workflowInstances.targetType, targetType),
        eq(workflowInstances.targetId, targetId),
      ),
    )
    .orderBy(desc(workflowInstances.startedAt));
}

export async function getWorkflowTransitions(instanceId: string) {
  const db = getDb();

  return db
    .select({
      id: workflowTransitions.id,
      fromState: workflowTransitions.fromState,
      toState: workflowTransitions.toState,
      note: workflowTransitions.note,
      occurredAt: workflowTransitions.occurredAt,
    })
    .from(workflowTransitions)
    .where(eq(workflowTransitions.workflowInstanceId, instanceId))
    .orderBy(desc(workflowTransitions.occurredAt));
}
