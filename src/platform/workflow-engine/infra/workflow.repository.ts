import { runtimeDb } from "@/db";
import {
  processInstances,
  processPayloads,
  events,
  states,
  transitions,
  actions
} from "@/db/runtime/schema/workflow";
import { eq, and } from "drizzle-orm";

type TransitionRow = typeof transitions.$inferSelect;
type ActionRow = typeof actions.$inferSelect;

export class WorkflowRepository {
  async createInstance(data: {
    workspaceId: string;
    processVersionId: string;
    currentStateId?: string;
    createdById?: string;
  }) {
    const [instance] = await runtimeDb.insert(processInstances).values({
      workspaceId: data.workspaceId,
      processVersionId: data.processVersionId,
      currentStateId: data.currentStateId,
      createdById: data.createdById,
    }).returning();

    // Create initial empty payload
    await runtimeDb.insert(processPayloads).values({
      instanceId: instance.id,
      workspaceId: data.workspaceId,
      data: {},
    });

    return instance;
  }

  async getInstance(instanceId: string) {
    const [instance] = await runtimeDb
      .select()
      .from(processInstances)
      .where(eq(processInstances.id, instanceId));
    return instance;
  }

  async getPayload(instanceId: string) {
    const [payload] = await runtimeDb
      .select()
      .from(processPayloads)
      .where(eq(processPayloads.instanceId, instanceId));
    return payload;
  }

  async updatePayload(instanceId: string, data: Record<string, unknown>) {
    await runtimeDb
      .update(processPayloads)
      .set({
        data,
        updatedAt: new Date()
      })
      .where(eq(processPayloads.instanceId, instanceId));

    await runtimeDb
      .update(processInstances)
      .set({ updatedAt: new Date() })
      .where(eq(processInstances.id, instanceId));
  }

  async updateState(instanceId: string, newStateId: string) {
    await runtimeDb
      .update(processInstances)
      .set({
        currentStateId: newStateId,
        updatedAt: new Date()
      })
      .where(eq(processInstances.id, instanceId));
  }

  async appendEvent(data: {
    workspaceId: string;
    instanceId?: string;
    eventType: string;
    actorId?: string;
    payload: Record<string, unknown>;
  }) {
    const [event] = await runtimeDb.insert(events).values({
      workspaceId: data.workspaceId,
      instanceId: data.instanceId,
      eventType: data.eventType,
      actorId: data.actorId,
      payload: data.payload,
    }).returning();
    return event;
  }

  async getAvailableActions(instanceId: string) {
    const instance = await this.getInstance(instanceId);
    if (!instance || !instance.currentStateId) return [];

    // Find transitions from current state
    const availableTransitions: TransitionRow[] = await runtimeDb
      .select()
      .from(transitions)
      .where(
        and(
          eq(transitions.processVersionId, instance.processVersionId),
          eq(transitions.fromStateId, instance.currentStateId)
        )
      );

    if (availableTransitions.length === 0) return [];

    const transitionIds = availableTransitions.map(t => t.id);

    // Get actions for those transitions
    const allActions: ActionRow[] = await runtimeDb
      .select()
      .from(actions)
      .where(eq(actions.processVersionId, instance.processVersionId));

    return allActions.filter(a => a.transitionId && transitionIds.includes(a.transitionId));
  }

  async getInitialState(processVersionId: string) {
    const [state] = await runtimeDb
      .select()
      .from(states)
      .where(
        and(
          eq(states.processVersionId, processVersionId),
          eq(states.isInitial, "true")
        )
      );
    return state;
  }
}
