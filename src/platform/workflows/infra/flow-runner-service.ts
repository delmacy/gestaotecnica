import { getRuntimeDb } from "@/db";
import { flowDefinitions, events } from "@/db/runtime/schema/workflow";
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
          eq(flowDefinitions.isActive, "true")
        )
      );

    for (const flow of flows) {
      const definition = flow.definition as any;

      // Check if any node in the flow matches the event
      const triggerNode = definition.nodes?.find(
        (n: any) => n.data?.type === 'event' && n.data?.label === event.eventType
      );

      if (triggerNode) {
        console.log(`[FlowRunner] Executing dynamic flow: ${flow.name}`);
        await this.executeFlowDefinition(flow, event, context);
      }
    }
  }

  private async executeFlowDefinition(flow: any, triggerEvent: EmittedEvent, context: WorkspaceContext) {
    const definition = flow.definition as any;
    const nodes = definition.nodes || [];
    const edges = definition.edges || [];

    // Find nodes directly connected to the trigger
    const triggerNode = nodes.find((n: any) => n.data?.type === 'event' && n.data?.label === triggerEvent.eventType);
    let currentNodes = edges
        .filter((e: any) => e.source === triggerNode.id)
        .map((e: any) => nodes.find((n: any) => n.id === e.target))
        .filter(Boolean);

    // Simple sequential execution for MVP
    for (const node of currentNodes) {
        if (node.data?.type === 'action') {
            console.log(`[FlowRunner] Triggering action: ${node.data.label}`);
            await runAction(node.data.label, {
                ...triggerEvent.payload,
                triggeredByFlow: flow.key
            }, {
                ...context,
                source: "automation",
                actor: { type: "automation", id: flow.id, name: flow.name }
            });
        }
    }
  }
}
