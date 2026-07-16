import { PublicationResultEnvelope } from "@/platform/workflows/contracts";
import { ProcessInstance } from "@/platform/workflows/runtime/types/process-instance";
import { TimelineItem } from "@/platform/observability/contracts/timeline-item";
import { randomUUID } from "crypto";

export function instantiateFromPublication(
    publication: PublicationResultEnvelope,
    workspaceId: string,
    actorId?: string
): { instance: ProcessInstance; timeline: TimelineItem } {
    if (!publication.ok) {
        throw new Error("Cannot instantiate from failed publication.");
    }

    const now = new Date().toISOString();
    const instanceId = randomUUID();

    const instance: ProcessInstance = {
        id: instanceId,
        workspaceId,
        processVersionId: publication.data.processVersionId,
        status: "active",
        createdById: actorId || null,
        createdAt: now,
        updatedAt: now,
    };

    const timeline: TimelineItem = {
        id: randomUUID(),
        type: "process_instance_created",
        title: "Process Instance Created",
        occurredAt: new Date(now),
        actorId,
        payload: {
            instanceId,
            processDefinitionId: publication.data.processDefinitionId,
            processVersionId: publication.data.processVersionId,
        },
    };

    return { instance, timeline };
}

import { getRuntimeDb } from "@/db";
import { flowDefinitions } from "@/db/runtime/schema/workflow";
import { runAction } from "@/platform/actions";
import { EmittedEvent } from "@/platform/events";
import { WorkspaceContext } from "@/platform/workspace";
import { and, eq } from "drizzle-orm";

/**
 * The DynamicFlowRunner executes automation flows defined
 * via the FlowBuilder (stored as JSON in the database).
 */
export class DynamicFlowRunner {
  async runForEvent(event: EmittedEvent, context: WorkspaceContext) {
    const db = getRuntimeDb();

    // 1. Find flows triggered by this event type in this workspace
    const flows = await db
      .select()
      .from(flowDefinitions)
      .where(
        and(
          eq(flowDefinitions.workspaceId, context.workspaceId),
          eq(flowDefinitions.status, "published"),
          eq(flowDefinitions.isActive, "true"),
        )
      );

    for (const flow of flows) {
      const definition = flow.definition as { nodes?: { id?: string, data?: { type?: string, label?: string } }[], edges?: { source?: string, target?: string }[] };

      // Check if any node in the flow matches the event
      const triggerNode = definition.nodes?.find(
        (n: unknown) => (n as { data?: { type?: string, label?: string } })?.data?.type === "event" && (n as { data?: { type?: string, label?: string } })?.data?.label === event.eventType
      );

      if (triggerNode) {
        console.log(`[FlowRunner] Executing dynamic flow: ${flow.name}`);
        await this.executeFlowDefinition(flow, event, context);
      }
    }
  }

  private async executeFlowDefinition(flow: { definition: unknown, key: string, id: string, name: string }, triggerEvent: EmittedEvent, context: WorkspaceContext) {
    const definition = flow.definition as { nodes?: { id?: string, data?: { type?: string, label?: string } }[], edges?: { source?: string, target?: string }[] };
    const nodes = definition.nodes || [];
    const edges = definition.edges || [];

    // Find nodes directly connected to the trigger
    const triggerNode = (nodes as { id?: string, data?: { type?: string, label?: string } }[]).find((n) => n.data?.type === "event" && n.data?.label === triggerEvent.eventType);
    const currentNodes = edges
        .filter((e: unknown) => (e as { source?: string })?.source === (triggerNode as { id?: string })?.id)
        .map((e: unknown) => (nodes as { id?: string }[]).find((n) => n.id === (e as { target?: string })?.target))
        .filter(Boolean);

    // Simple sequential execution for MVP
    for (const n of currentNodes) {
        const node = n as { data?: { type?: string, label?: string } };
        if (node.data?.type === 'action') {
            console.log(`[FlowRunner] Triggering action: ${node.data.label}`);
            if (!node.data?.label) continue;
            await runAction(node.data.label, {
                ...triggerEvent.payload,
                triggeredByFlow: flow.key
            }, {
                ...context,
                source: "automation",
                actor: { type: "automation", id: flow.id || "00000000-0000-0000-0000-000000000000", name: flow.name }
            });
        }
    }
  }
}
