import { registerEvent } from "./event-registry";

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
    description: "Execucao criada.",
  });
  registerEvent({
    key: "service_order.completed",
    moduleKey: "service-orders",
    description: "Execucao concluída.",
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
    description: "Documento operacional gerado.",
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

