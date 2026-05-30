import { runtimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, desc, and } from "drizzle-orm";

type WorkflowEventRow = typeof events.$inferSelect;

export interface TimelineItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  occurredAt: Date;
  actorId?: string;
  payload: Record<string, unknown>;
}

export class TimelineService {
  async getWorkspaceTimeline(workspaceId: string, limit = 20): Promise<TimelineItem[]> {
    const rawEvents: WorkflowEventRow[] = await runtimeDb
      .select()
      .from(events)
      .where(eq(events.workspaceId, workspaceId))
      .orderBy(desc(events.createdAt))
      .limit(limit);

    return rawEvents.map(event => ({
      id: event.id,
      type: this.mapType(event.eventType),
      title: this.formatTitle(event.eventType),
      occurredAt: event.createdAt,
      actorId: event.actorId ?? undefined,
      payload: event.payload as Record<string, unknown>,
    }));
  }

  async getProcessInstanceTimeline(workspaceId: string, instanceId: string): Promise<TimelineItem[]> {
    const rawEvents: WorkflowEventRow[] = await runtimeDb
      .select()
      .from(events)
      .where(and(eq(events.workspaceId, workspaceId), eq(events.instanceId, instanceId)))
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
