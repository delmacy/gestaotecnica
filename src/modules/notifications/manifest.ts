import type { ModuleManifest } from "@/platform/modules";

export const notificationsManifest: ModuleManifest = {
  key: "notifications",
  name: "Notifications",
  description: "Avisos governados para manter pessoas e sistemas cientes de mudancas relevantes.",
  operational: {
    capability: "Comunicacao operacional",
    process: "Emitir notificacoes a partir de eventos, decisoes ou prazos.",
    result: "Sinal entregue ou registrado sem substituir o evento fonte.",
    tracking: "Evento de notificacao com destinatario, canal, payload e correlacao.",
    evolution: "Pode evoluir para preferencias, canais externos, escalonamento e confirmacao de leitura.",
    integrations: ["events", "automations", "integrations"],
  },
  actions: ["notifications.send"],
  events: ["notification.sent"],
  views: [],
};
