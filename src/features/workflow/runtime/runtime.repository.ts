import { eq, and } from "drizzle-orm";
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
  ProcessInstanceStatus
} from "./runtime.types";

// Minimal DB Type for dependency injection, avoiding deep drizzle type leaks
export type RuntimeDb = {
  insert: any;
  select: any;
  update: any;
  delete: any;
  query?: any;
};

export async function insertProcessInstance(
  db: RuntimeDb,
  data: ProcessInstanceInsert
): Promise<ProcessInstanceRecord> {
  const [instance] = await db
    .insert(processInstances)
    .values(data)
    .returning();

  return instance as ProcessInstanceRecord;
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

  return payload as ProcessPayloadRecord;
}

export async function insertActionExecution(
  db: RuntimeDb,
  data: ActionExecutionInsert
): Promise<ActionExecutionRecord> {
  const [execution] = await db
    .insert(actionExecutions)
    .values(data)
    .returning();

  return execution as ActionExecutionRecord;
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

  return (instance as ProcessInstanceRecord) || null;
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

  return (payload as ProcessPayloadRecord) || null;
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

  return executions as ActionExecutionRecord[];
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

  return (updated as ProcessInstanceRecord) || null;
}
