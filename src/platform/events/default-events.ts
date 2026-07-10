import { registerEvent } from "./event-registry";
import { CanonicalEvent } from "./canonical-contract";

export const DEFAULT_EVENT_FIXTURES: CanonicalEvent[] = [
  {
    id: "e1a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    workspaceId: "w1a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    eventType: "work_item.created",
    entityType: "work_item",
    entityId: "123e4567-e89b-12d3-a456-426614174000",
    actorId: "a1a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    occurredAt: new Date("2024-01-01T12:00:00Z").toISOString(),
    schemaVersion: "1.0.0",
    correlationId: "corr-123",
    idempotencyKey: "idem-123",
    payload: { title: "New Work Item" },
  },
  {
    id: "e2a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    workspaceId: "w1a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    eventType: "service_order.completed",
    entityType: "service_order",
    entityId: "123e4567-e89b-12d3-a456-426614174001",
    actorId: "a1a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    occurredAt: new Date("2024-01-02T12:00:00Z").toISOString(),
    schemaVersion: "1.0.0",
    correlationId: "corr-124",
    idempotencyKey: "idem-124",
    payload: { status: "completed" },
  },
  {
    id: "e3a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    workspaceId: "w1a9b1c0-3d4a-4e5b-9f6c-8a9b0c1d2e3f",
    eventType: "notification.sent",
    entityType: "notification",
    entityId: "123e4567-e89b-12d3-a456-426614174002",
    actorId: "system",
    occurredAt: new Date("2024-01-03T12:00:00Z").toISOString(),
    schemaVersion: "1.0.0",
    correlationId: "corr-125",
    idempotencyKey: "idem-125",
    payload: { to: "user@example.com" },
  }
];

export function registerDefaultEvents() {
  registerEvent({
    key: "work_item.created",
    moduleKey: "work-items",
    description: "Demanda criada.",
  });
  registerEvent({
    key: "work_item.transitioned",
    moduleKey: "work-items",
    description: "Demanda transicionada.",
  });
  registerEvent({
    key: "service_order.created",
    moduleKey: "service-orders",
    description: "Ordem de serviço criada.",
  });
  registerEvent({
    key: "service_order.completed",
    moduleKey: "service-orders",
    description: "Ordem de serviço concluída.",
  });
  registerEvent({
    key: "notification.sent",
    moduleKey: "notifications",
    description: "Notificacao enviada.",
  });
  registerEvent({
    key: "asset.created",
    moduleKey: "assets",
    description: "Ativo criado.",
  });
  registerEvent({
    key: "report.generated",
    moduleKey: "reports",
    description: "Relatorio gerado.",
  });
  registerEvent({
    key: "automation_rule.executed",
    moduleKey: "automations",
    description: "Regra de automação executada.",
  });
  registerEvent({
    key: "document.generated",
    moduleKey: "documents",
    description: "Documento técnico gerado.",
  });
  registerEvent({
    key: "legacy_record.created",
    moduleKey: "legacy",
    description: "Registro de legado criado.",
  });
  registerEvent({
    key: "shift_log.entry_added",
    moduleKey: "shifts",
    description: "Entrada adicionada ao livro de turno.",
  });
  registerEvent({
    key: "evidence.attached",
    moduleKey: "evidences",
    description: "Evidencia anexada.",
  });
  registerEvent({
    key: "approval.requested",
    moduleKey: "approvals",
    description: "Aprovacao solicitada.",
  });
}

