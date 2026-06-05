import { processInstances, processPayloads, actionExecutions } from "@/db/runtime/schema/workflow";
import {
  ProcessInstanceRecord,
  ProcessInstanceInsert,
  ProcessPayloadRecord,
  ActionExecutionRecord,
  ActionExecutionInsert,
  ProcessInstanceStatus
} from "./runtime.types";
import { eq, and } from "drizzle-orm";

export type RuntimeDb = {
  insert: any;
  select: any;
  update: any;
};

// Implementations to follow

export async function insertProcessInstance(
  db: RuntimeDb,
  input: ProcessInstanceInsert,
): Promise<ProcessInstanceRecord> {
  const [result] = await db.insert(processInstances).values(input).returning();
  return {
    ...result,
    status: result.status as ProcessInstanceStatus,
  };
}

export async function insertProcessPayload(
  db: RuntimeDb,
  input: {
    instanceId: string;
    workspaceId: string;
    schemaVersion?: string;
    data?: Record<string, unknown>;
  },
): Promise<ProcessPayloadRecord> {
  const payloadData = input.data || {};
  const schemaVersion = input.schemaVersion || "1.0";
  const [result] = await db.insert(processPayloads).values({
    instanceId: input.instanceId,
    workspaceId: input.workspaceId,
    schema_version: schemaVersion,
    data: payloadData,
  }).returning();

  return {
    id: result.id,
    instanceId: result.instanceId,
    workspaceId: result.workspaceId,
    schemaVersion: result.schema_version,
    data: result.data as Record<string, unknown>,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

export async function insertActionExecution(
  db: RuntimeDb,
  input: ActionExecutionInsert,
): Promise<ActionExecutionRecord> {
  const [result] = await db.insert(actionExecutions).values(input).returning();
  return {
    id: result.id,
    workspaceId: result.workspaceId,
    instanceId: result.instanceId,
    actionKey: result.actionKey,
    actorId: result.actorId,
    inputPayload: result.inputPayload as Record<string, unknown>,
    outputPayload: result.outputPayload as Record<string, unknown>,
    status: result.status as import("./runtime.types").ActionExecutionStatus,
    error: result.error,
    startedAt: result.startedAt,
    finishedAt: result.finishedAt,
  };
}

export async function getProcessInstanceById(
  db: RuntimeDb,
  input: {
    workspaceId: string;
    processInstanceId: string;
  },
): Promise<ProcessInstanceRecord | undefined> {
  const [result] = await db
    .select()
    .from(processInstances)
    .where(
      and(
        eq(processInstances.id, input.processInstanceId),
        eq(processInstances.workspaceId, input.workspaceId)
      )
    );

  if (!result) return undefined;

  return {
    ...result,
    status: result.status as ProcessInstanceStatus,
  };
}

export async function listActionExecutionsForInstance(
  db: RuntimeDb,
  input: {
    workspaceId: string;
    processInstanceId: string;
  },
): Promise<ActionExecutionRecord[]> {
  const results = await db
    .select()
    .from(actionExecutions)
    .where(
      and(
        eq(actionExecutions.instanceId, input.processInstanceId),
        eq(actionExecutions.workspaceId, input.workspaceId)
      )
    );

  return results.map((result) => ({
    id: result.id,
    workspaceId: result.workspaceId,
    instanceId: result.instanceId,
    actionKey: result.actionKey,
    actorId: result.actorId,
    inputPayload: result.inputPayload as Record<string, unknown>,
    outputPayload: result.outputPayload as Record<string, unknown>,
    status: result.status as import("./runtime.types").ActionExecutionStatus,
    error: result.error,
    startedAt: result.startedAt,
    finishedAt: result.finishedAt,
  }));
}

export async function getProcessPayloadForInstance(
  db: RuntimeDb,
  input: {
    workspaceId: string;
    processInstanceId: string;
  },
): Promise<ProcessPayloadRecord | undefined> {
  const [result] = await db
    .select()
    .from(processPayloads)
    .where(
      and(
        eq(processPayloads.instanceId, input.processInstanceId),
        eq(processPayloads.workspaceId, input.workspaceId)
      )
    );

  if (!result) return undefined;

  return {
    id: result.id,
    instanceId: result.instanceId,
    workspaceId: result.workspaceId,
    schemaVersion: result.schema_version,
    data: result.data as Record<string, unknown>,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

export async function updateProcessInstanceStatus(
  db: RuntimeDb,
  input: {
    workspaceId: string;
    processInstanceId: string;
    status: ProcessInstanceStatus;
    currentStateId?: string | null;
  },
): Promise<ProcessInstanceRecord | undefined> {
  const [result] = await db
    .update(processInstances)
    .set({
      status: input.status,
      currentStateId: input.currentStateId !== undefined ? input.currentStateId : undefined,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(processInstances.id, input.processInstanceId),
        eq(processInstances.workspaceId, input.workspaceId)
      )
    )
    .returning();

  if (!result) return undefined;

  return {
    ...result,
    status: result.status as ProcessInstanceStatus,
  };
}
