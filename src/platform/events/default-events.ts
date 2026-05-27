import { registerEvent } from "./event-registry";

export function registerDefaultEvents() {
  registerEvent({
    key: "work_item.created",
    moduleKey: "work-items",
    description: "Demanda criada.",
  });
  registerEvent({
    key: "service_order.completed",
    moduleKey: "service-orders",
    description: "Ordem de servico concluida.",
  });
  registerEvent({
    key: "notification.sent",
    moduleKey: "notifications",
    description: "Notificacao enviada.",
  });
}
