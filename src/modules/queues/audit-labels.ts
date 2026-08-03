import { QueueAuditEventTypes } from "./contracts/queue-audit";

const EVENT_LABELS: Record<string, string> = {
  "queue_item.created": "Item adicionado a fila",
  "queue_item.updated": "Item atualizado na fila",
  "queue_item.recovered": "Rascunho recuperado",
  "queue_item.deleted": "Item descartado",
  "sla_policy.upserted": "Politica de SLA salva",
};

export function getQueueAuditEventLabel(eventType: string) {
  return EVENT_LABELS[eventType] ?? "Evento registrado";
}

export function getQueueAuditEventTypeList() {
  return [...QueueAuditEventTypes];
}
