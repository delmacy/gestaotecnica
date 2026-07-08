import { eq, and, inArray } from "drizzle-orm";
import {
  processInstances,
  processPayloads,
  actionExecutions
} from "@/db/runtime/schema/workflow";
import type {
  ProcessInstanceInsert,
  ProcessInstanceRecord,
  ActionExecutionInsert,
  ActionExecutionRecord,
  ProcessPayloadRecord,
  ProcessInstanceStatus,
  UpdateActionExecutionInput,
  ActionExecutionStatus
} from "./runtime.types";

// Minimal DB Type for dependency injection, avoiding deep drizzle type leaks
export type RuntimeDb = {
  insert: any;
  select: any;
  update: any;
  delete: any;
  query?: any;
};

export function mapProcessInstanceRow(row: any): ProcessInstanceRecord {
  if (!row) return row;
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    processVersionId: row.processVersionId,
    currentStateId: row.currentStateId,
    status: row.status,
    createdById: row.createdById,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export function mapProcessPayloadRow(row: any): ProcessPayloadRecord {
  if (!row) return row;
  return {
    id: row.id,
    instanceId: row.instanceId,
    workspaceId: row.workspaceId,
    schemaVersion: row.schema_version ?? row.schemaVersion,
    data: row.data,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export function mapActionExecutionRow(row: any): ActionExecutionRecord {
  if (!row) return row;
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    instanceId: row.instanceId,
    actionKey: row.actionKey,
    actorId: row.actorId,
    inputPayload: row.inputPayload,
    outputPayload: row.outputPayload,
    status: row.status,
    error: row.error,
    startedAt: row.startedAt,
    finishedAt: row.finishedAt
  };
}

export async function insertProcessInstance(
  db: RuntimeDb,
  data: ProcessInstanceInsert
): Promise<ProcessInstanceRecord> {
  const [instance] = await db
    .insert(processInstances)
    .values(data)
    .returning();

  return mapProcessInstanceRow(instance);
}

export async function insertProcessPayload(
  db: RuntimeDb,
  data: {
    id?: string;
    instanceId: string;
    workspaceId: string;
    schemaVersion?: string;
    data?: Record<string, unknown>;
  }
): Promise<ProcessPayloadRecord> {
  const [payload] = await db
    .insert(processPayloads)
    .values(data)
    .returning();

  return mapProcessPayloadRow(payload);
}

export async function insertActionExecution(
  db: RuntimeDb,
  data: ActionExecutionInsert
): Promise<ActionExecutionRecord> {
  const [execution] = await db
    .insert(actionExecutions)
    .values(data)
    .returning();

  return mapActionExecutionRow(execution);
}

export async function getProcessInstanceById(
  db: RuntimeDb,
  workspaceId: string,
  instanceId: string
): Promise<ProcessInstanceRecord | null> {
  const [instance] = await db
    .select()
    .from(processInstances)
    .where(
      and(
        eq(processInstances.id, instanceId),
        eq(processInstances.workspaceId, workspaceId)
      )
    );

  return instance ? mapProcessInstanceRow(instance) : null;
}

export async function getProcessPayloadForInstance(
  db: RuntimeDb,
  workspaceId: string,
  instanceId: string
): Promise<ProcessPayloadRecord | null> {
  const [payload] = await db
    .select()
    .from(processPayloads)
    .where(
      and(
        eq(processPayloads.instanceId, instanceId),
        eq(processPayloads.workspaceId, workspaceId)
      )
    );

  return payload ? mapProcessPayloadRow(payload) : null;
}

export async function listActionExecutionsForInstance(
  db: RuntimeDb,
  workspaceId: string,
  instanceId: string
): Promise<ActionExecutionRecord[]> {
  const executions = await db
    .select()
    .from(actionExecutions)
    .where(
      and(
        eq(actionExecutions.instanceId, instanceId),
        eq(actionExecutions.workspaceId, workspaceId)
      )
    );

  return executions.map(mapActionExecutionRow);
}

export async function updateProcessInstanceStatus(
  db: RuntimeDb,
  workspaceId: string,
  instanceId: string,
  status: ProcessInstanceStatus
): Promise<ProcessInstanceRecord | null> {
  const [updated] = await db
    .update(processInstances)
    .set({
      status,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(processInstances.id, instanceId),
        eq(processInstances.workspaceId, workspaceId)
      )
    )
    .returning();

  return updated ? mapProcessInstanceRow(updated) : null;
}

export async function getActionExecutionById(
  db: RuntimeDb,
  workspaceId: string,
  actionExecutionId: string
): Promise<ActionExecutionRecord | null> {
  const [execution] = await db
    .select()
    .from(actionExecutions)
    .where(
      and(
        eq(actionExecutions.id, actionExecutionId),
        eq(actionExecutions.workspaceId, workspaceId)
      )
    );

  return execution ? mapActionExecutionRow(execution) : null;
}

export async function getActiveActionExecutionForInstance(
  db: RuntimeDb,
  workspaceId: string,
  instanceId: string,
  targetStatuses: ActionExecutionStatus[] = ["running", "pending"]
): Promise<ActionExecutionRecord | null> {
  const [active] = await db
    .select()
    .from(actionExecutions)
    .where(
      and(
        eq(actionExecutions.instanceId, instanceId),
        eq(actionExecutions.workspaceId, workspaceId),
        inArray(actionExecutions.status, targetStatuses)
      )
    )
    .limit(1);

  return active ? mapActionExecutionRow(active) : null;
}

export async function updateActionExecutionStatus(
  db: RuntimeDb,
  input: UpdateActionExecutionInput
): Promise<ActionExecutionRecord | null> {
  const { workspaceId, instanceId, actionExecutionId, status, outputPayload, error, finishedAt } = input;

  const updateData: Partial<ActionExecutionInsert> = { status };

  if (outputPayload !== undefined) {
    updateData.outputPayload = outputPayload;
  }

  if (error !== undefined) {
    updateData.error = error;
  }

  if (finishedAt !== undefined) {
    updateData.finishedAt = finishedAt;
  }

  const [updated] = await db
    .update(actionExecutions)
    .set(updateData)
    .where(
      and(
        eq(actionExecutions.id, actionExecutionId),
        eq(actionExecutions.instanceId, instanceId),
        eq(actionExecutions.workspaceId, workspaceId)
      )
    )
    .returning();

  return updated ? mapActionExecutionRow(updated) : null;
}
