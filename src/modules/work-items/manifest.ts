import type { ModuleManifest } from "@/platform/modules";

export const workItemsManifest: ModuleManifest = {
  key: "work-items",
  name: "Work Items",
  description: "Envelope universal para entrada, triagem e priorizacao de demandas operacionais.",
  operational: {
    capability: "Gestao de demandas operacionais",
    process: "Capturar, classificar, priorizar e encaminhar necessidades antes da execucao.",
    result: "Demanda estabilizada com contexto suficiente para decisao, planejamento ou execucao.",
    tracking: "Eventos de criacao e transicao vinculados ao workspace e a instancia da demanda.",
    evolution: "Pode receber tipos, filas, formularios e regras de triagem por blueprint ou workspace.",
    integrations: ["workflow-engine", "events", "service-orders", "notifications"],
  },
  actions: ["work_items.create", "work_items.transition"],
  events: ["work_item.created", "work_item.transitioned"],
  views: ["work_items.list", "work_items.detail"],
};
