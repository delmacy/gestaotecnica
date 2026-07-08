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

export type RuntimeRepositoryRow = Record<string, unknown> | null | undefined;

// Minimal DB Type for dependency injection, avoiding deep drizzle type leaks
export type RuntimeDb = {
  insert: (table: unknown) => {
    values: (data: unknown) => {
      returning: (fields?: unknown) => Promise<unknown[]>;
    };
  };
  select: (fields?: unknown) => {
    from: (table: unknown) => {
      where: (condition: unknown) => {
        orderBy: (order: unknown) => Promise<unknown[]>;
        limit: (limit: number) => Promise<RuntimeRepositoryRow[]>;
      } & Promise<RuntimeRepositoryRow[]>;
    } & Promise<RuntimeRepositoryRow[]>;
  };
  update: (table: unknown) => {
    set: (values: unknown) => {
      where: (condition: unknown) => {
        returning: () => Promise<RuntimeRepositoryRow[]>;
      };
    };
  };
  delete: (table: unknown) => {
    where: (condition: unknown) => {
      returning: () => Promise<RuntimeRepositoryRow[]>;
    } & Promise<RuntimeRepositoryRow[]>;
  };
  query?: unknown;
};

export function mapProcessInstanceRow(row: null | undefined): null;
export function mapProcessInstanceRow(row: NonNullable<RuntimeRepositoryRow>): ProcessInstanceRecord;
export function mapProcessInstanceRow(row: RuntimeRepositoryRow): ProcessInstanceRecord | null {
  if (!row) return null;
  return {
    id: row.id as string,
    workspaceId: (row.workspaceId ?? row.workspace_id) as string,
    processVersionId: (row.processVersionId ?? row.process_version_id) as string,
    currentStateId: (row.currentStateId ?? row.current_state_id) as string,
    status: row.status as ProcessInstanceStatus,
    createdById: (row.createdById ?? row.created_by_id) as string,
    createdAt: (row.createdAt ?? row.created_at) as Date,
    updatedAt: (row.updatedAt ?? row.updated_at) as Date
  };
}

export function mapProcessPayloadRow(row: null | undefined): null;
export function mapProcessPayloadRow(row: NonNullable<RuntimeRepositoryRow>): ProcessPayloadRecord;
export function mapProcessPayloadRow(row: RuntimeRepositoryRow): ProcessPayloadRecord | null {
  if (!row) return null;
  return {
    id: row.id as string,
    instanceId: (row.instanceId ?? row.instance_id) as string,
    workspaceId: (row.workspaceId ?? row.workspace_id) as string,
    schemaVersion: (row.schemaVersion ?? row.schema_version) as string,
    data: row.data as Record<string, unknown>,
    createdAt: (row.createdAt ?? row.created_at) as Date,
    updatedAt: (row.updatedAt ?? row.updated_at) as Date
  };
}

export function mapActionExecutionRow(row: null | undefined): null;
export function mapActionExecutionRow(row: NonNullable<RuntimeRepositoryRow>): ActionExecutionRecord;
export function mapActionExecutionRow(row: RuntimeRepositoryRow): ActionExecutionRecord | null {
  if (!row) return null;
  return {
    id: row.id as string,
    workspaceId: (row.workspaceId ?? row.workspace_id) as string,
    instanceId: (row.instanceId ?? row.instance_id) as string,
    actionKey: (row.actionKey ?? row.action_key) as string,
    actorId: (row.actorId ?? row.actor_id) as string | null,
    inputPayload: (row.inputPayload ?? row.input_payload) as Record<string, unknown>,
    outputPayload: (row.outputPayload ?? row.output_payload) as Record<string, unknown>,
    status: row.status as ActionExecutionStatus,
    error: row.error as string | null,
    startedAt: (row.startedAt ?? row.started_at) as Date,
    finishedAt: (row.finishedAt ?? row.finished_at) as Date | null
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

  return mapProcessInstanceRow(instance as NonNullable<RuntimeRepositoryRow>)!;
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

  return mapProcessPayloadRow(payload as NonNullable<RuntimeRepositoryRow>)!;
}

export async function insertActionExecution(
  db: RuntimeDb,
  data: ActionExecutionInsert
): Promise<ActionExecutionRecord> {
  const [execution] = await db
    .insert(actionExecutions)
    .values(data)
    .returning();

  return mapActionExecutionRow(execution as NonNullable<RuntimeRepositoryRow>)!;
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

  return instance ? mapProcessInstanceRow(instance as NonNullable<RuntimeRepositoryRow>) : null;
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

  return payload ? mapProcessPayloadRow(payload as NonNullable<RuntimeRepositoryRow>) : null;
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

  return executions.filter((e): e is NonNullable<RuntimeRepositoryRow> => e != null).map(mapActionExecutionRow);
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

  return updated ? mapProcessInstanceRow(updated as NonNullable<RuntimeRepositoryRow>) : null;
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

  return execution ? mapActionExecutionRow(execution as NonNullable<RuntimeRepositoryRow>) : null;
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

  return active ? mapActionExecutionRow(active as NonNullable<RuntimeRepositoryRow>) : null;
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

  return updated ? mapActionExecutionRow(updated as NonNullable<RuntimeRepositoryRow>) : null;
}
