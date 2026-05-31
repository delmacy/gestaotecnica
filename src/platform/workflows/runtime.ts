import { and, desc, eq } from "drizzle-orm";
import { getDb, getRuntimeDb } from "@/db";
import {
  processDefinitions,
  processVersions,
  processInstances,
  events,
} from "@/db/runtime/schema/workflow";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

export async function getActiveProcessVersionForTarget(workspaceId: string, processKey: string) {
  const db = getRuntimeDb();

  const [definition] = await db
    .select()
    .from(processDefinitions)
    .where(
      and(
        eq(processDefinitions.workspaceId, workspaceId),
        eq(processDefinitions.key, processKey),
        eq(processDefinitions.isActive, "true"),
      ),
    )
    .limit(1);

  if (!definition) return null;

  const [version] = await db
    .select()
    .from(processVersions)
    .where(eq(processVersions.processDefinitionId, definition.id))
    .orderBy(desc(processVersions.version))
    .limit(1);

  return version ?? null;
}

export async function startProcessInstance({
  workspaceId,
  processKey,
  actorId,
  payload,
}: {
  workspaceId: string;
  processKey: string;
  actorId?: string | null;
  payload?: any;
}) {
  const db = getRuntimeDb();

  const version = await getActiveProcessVersionForTarget(workspaceId, processKey);
  if (!version) throw new Error(`Processo [${processKey}] não encontrado ou sem versão ativa.`);

  const definition = version.definition as any;
  const initialNode = definition.nodes?.find((n: any) => n.data?.type === 'start')
                   || definition.nodes?.[0];

  const [instance] = await db
    .insert(processInstances)
    .values({
      workspaceId,
      processVersionId: version.id,
      currentStateId: initialNode?.id,
      status: "active",
      createdById: actorId ?? undefined,
    })
    .returning();

  await db.insert(events).values({
    workspaceId,
    instanceId: instance.id,
    eventType: "PROCESS_INSTANCE_CREATED",
    actorId: actorId ?? undefined,
    payload: {
        processKey,
        version: version.version,
        initialState: initialNode?.data?.label,
        data: payload
    },
  });

  return instance;
}

export async function transitionProcessInstance({
  instanceId,
  targetStateId,
  actorId,
  payload,
}: {
  instanceId: string;
  targetStateId: string;
  actorId?: string | null;
  payload?: any;
}) {
  const db = getRuntimeDb();

  const [instance] = await db
    .select()
    .from(processInstances)
    .where(eq(processInstances.id, instanceId))
    .limit(1);

  if (!instance) throw new Error("Instancia de processo não encontrada.");
  if (instance.status !== "active") throw new Error("Processo não está ativo.");

  const [version] = await db
    .select()
    .from(processVersions)
    .where(eq(processVersions.id, instance.processVersionId))
    .limit(1);

  const definition = version?.definition as any;
  const targetNode = definition.nodes?.find((n: any) => n.id === targetStateId);

  if (!targetNode) throw new Error("Estado de destino inválido para este processo.");

  const isFinal = targetNode.data?.type === 'end';
  const status = isFinal ? "completed" : "active";

  const [updated] = await db
    .update(processInstances)
    .set({
      currentStateId: targetStateId,
      status,
      updatedAt: new Date(),
    })
    .where(eq(processInstances.id, instance.id))
    .returning();

  await db.insert(events).values({
    workspaceId: instance.workspaceId,
    instanceId: instance.id,
    eventType: "ACTION_EXECUTED",
    actorId: actorId ?? undefined,
    payload: {
      fromStateId: instance.currentStateId,
      toStateId: targetStateId,
      toStateLabel: targetNode.data?.label,
      data: payload,
    },
  });

  return updated;
}

// Compatibility exports for legacy modules
export const startWorkflowInstanceForTarget = startProcessInstance as any;
export const transitionWorkflowInstance = transitionProcessInstance as any;
