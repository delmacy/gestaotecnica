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
