import { startProcessInstance, transitionProcessInstance } from "../runtime";
import { EmittedEvent } from "@/platform/events";
import { WorkspaceContext } from "@/platform/workspace";

/**
 * The ProcessOrchestrator is responsible for linking domain events to
 * the state machine defined in the Builder.
 */
export class ProcessOrchestrator {
  async handleEvent(event: EmittedEvent, context: WorkspaceContext) {
    // 1. If it's a creation event, check if there's a mapped process to start
    if (event.eventType.endsWith('.created')) {
      const entityType = event.entityType;
      // Map entityType to a processKey. For now, assume processKey == entityType
      try {
        await startProcessInstance({
          workspaceId: context.workspaceId,
          processKey: entityType,
          actorId: context.actor.id,
          payload: event.payload
        });
      } catch (e) {
        // Silently fail if no process definition exists for this entity
        console.log(`[Orchestrator] No process definition found for ${entityType}. Skipping.`);
      }
    }

    // 2. If it's a transition event, handle the state machine move
    if (event.eventType.endsWith('.transitioned')) {
       // Implementation for manual transitions would go here
    }
  }
}
