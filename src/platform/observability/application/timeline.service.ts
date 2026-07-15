import { runtimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { flowRuns, flowActionRuns } from "@/db/schema";
import { eq, desc, and, or } from "drizzle-orm";

import { TimelineItem } from "../contracts/timeline-item";

type WorkflowEventRow = typeof events.$inferSelect;

export class TimelineService {
  async getWorkspaceTimeline(workspaceId: string, limit = 20): Promise<TimelineItem[]> {
    const rawEvents: WorkflowEventRow[] = await runtimeDb
      .select()
      .from(events)
      .where(eq(events.workspaceId, workspaceId))
      .orderBy(desc(events.createdAt))
      .limit(limit);

    const fRuns = await runtimeDb
      .select()
      .from(flowRuns)
      .where(eq(flowRuns.workspaceId, workspaceId))
      .orderBy(desc(flowRuns.startedAt))
      .limit(limit);

    const timelineItems: TimelineItem[] = rawEvents.map((event) => ({
      id: event.id,
      type: this.mapType(event.eventType),
      title: this.formatTitle(event.eventType),
      occurredAt: event.createdAt,
      actorId: event.actorId ?? undefined,
      payload: event.payload as Record<string, unknown>,
    }));

    timelineItems.push(
      ...fRuns.map((run: typeof flowRuns.$inferSelect) => ({
        id: run.id,
        type: "event",
        title: `Flow Run: ${run.flowName || run.flowKey}`,
        occurredAt: run.startedAt,
        payload: {
          status: run.status,
        eventType: run.triggerEventType,
        duration: run.durationMs ? `${run.durationMs}ms` : 'running',
        error: run.errorPayload
      }
    })));

    return timelineItems.sort((a, b) => (b.occurredAt?.getTime() || 0) - (a.occurredAt?.getTime() || 0)).slice(0, limit);
  }

  async getProcessInstanceTimeline(workspaceId: string, instanceId: string): Promise<TimelineItem[]> {
    const rawEvents: WorkflowEventRow[] = await runtimeDb
      .select()
      .from(events)
      .where(and(eq(events.workspaceId, workspaceId), eq(events.causationId, instanceId)))
      .orderBy(desc(events.createdAt));

    return rawEvents.map(event => ({
      id: event.id,
      type: this.mapType(event.eventType),
      title: this.formatTitle(event.eventType),
      occurredAt: event.createdAt,
      actorId: event.actorId ?? undefined,
      payload: event.payload as Record<string, unknown>,
    }));
  }

  private mapType(type: string): string {
    if (type.includes("CREATED") || type.includes("UPDATED")) return "audit";
    if (type.includes("ACTION")) return "action";
    return "system";
  }

  private formatTitle(type: string): string {
    switch (type) {
      case "PROCESS_INSTANCE_CREATED": return "Processo Iniciado";
      case "PAYLOAD_UPDATED": return "Dados Atualizados";
      case "ACTION_EXECUTED": return "Ação Executada";
      case "DOCUMENT_LINKED": return "Documento Anexado";
      case "NOTIFICATION_SENT": return "Notificação Enviada";
      case "DOCUMENT_TRACE_RECEIPT_CREATED": return "Canhoto de Rastreabilidade Gerado";
      default: return type;
    }
  }
}
