import { runtimeDb } from "@/db";
import { events } from "@/db/runtime/schema/workflow";
import { eq, desc } from "drizzle-orm";

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
  async getProcessInstanceTimeline(workspaceId: string, instanceId: string): Promise<TimelineItem[]> {
    const rawEvents = await runtimeDb
      .select()
      .from(events)
      .where(eq(events.instanceId, instanceId))
      .orderBy(desc(events.createdAt));

    return rawEvents.map(event => ({
      id: event.id,
      type: event.eventType,
      title: this.formatTitle(event.eventType),
      occurredAt: event.createdAt,
      actorId: event.actorId,
      payload: event.payload as Record<string, unknown>,
    }));
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
