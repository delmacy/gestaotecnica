import type { ModuleManifest } from "@/platform/modules";

export const serviceOrdersManifest: ModuleManifest = {
  key: "service-orders",
  name: "Service Orders",
  description: "Execucao autorizada de trabalho com responsaveis, tempo, evidencias e aceite.",
  operational: {
    capability: "Execucao controlada de trabalho",
    process: "Autorizar, atribuir, executar, evidenciar, revisar e concluir uma operacao.",
    result: "Trabalho executado com status, responsaveis, evidencias e historico verificavel.",
    tracking: "Eventos de criacao, conclusao, revisao e mudanca de estado por instancia.",
    evolution: "Pode especializar protocolos, SLAs, checklists, formularios e aprovadores por capacidade.",
    integrations: ["work-items", "assets", "documents", "evidences", "workflow-engine", "events"],
  },
  actions: ["service_orders.create", "service_orders.complete"],
  events: ["service_order.created", "service_order.completed"],
  views: ["service_orders.list", "service_orders.detail"],
  dependencies: ["work-items", "assets"],
};
