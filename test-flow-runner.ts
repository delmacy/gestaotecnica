import { PublicationResultEnvelope } from "./src/platform/workflows/contracts";
import { ProcessInstance } from "./src/platform/workflows/runtime/types/process-instance";
import { TimelineItem } from "./src/platform/observability/contracts/timeline-item";

export function mapPublicationToProcessInstance(pub: PublicationResultEnvelope): ProcessInstance {
  if (!pub.ok) {
    throw new Error("Cannot map failed publication to ProcessInstance");
  }

  // Use a pseudo-random or fixed id since PublicationResultEnvelope doesn't provide an instance ID.
  return {
    id: "00000000-0000-0000-0000-000000000000",
    workspaceId: "00000000-0000-0000-0000-000000000000",
    processVersionId: pub.data.processVersionId,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdById: null,
  };
}

export function mapProcessInstanceToTimelineItem(instance: ProcessInstance): TimelineItem {
  return {
    id: instance.id,
    type: "process_started",
    title: `Process started`,
    occurredAt: new Date(instance.createdAt),
    payload: {
      processVersionId: instance.processVersionId,
      status: instance.status,
    },
  };
}
