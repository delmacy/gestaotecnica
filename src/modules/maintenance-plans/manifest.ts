import type { ModuleManifest } from "@/platform/modules";

export const maintenancePlansManifest: ModuleManifest = {
  key: "maintenance-plans",
  name: "Maintenance Plans",
  description: "Planejamento recorrente ou preventivo de cuidado sobre ativos e capacidades.",
  operational: {
    capability: "Planejamento de manutencao",
    process: "Definir plano, periodo, criticidade e gerar execucoes controladas quando aplicavel.",
    result: "Plano rastreavel que pode originar ordens, recursos e evidencias.",
    tracking: "Eventos de criacao do plano e geracao de ordem vinculados ao ativo e workspace.",
    evolution: "Pode incorporar recorrencia, janelas, criticidade, checklists e previsao de recursos.",
    integrations: ["assets", "service-orders", "resource-needs", "events"],
  },
  actions: ["maintenance_plans.create", "maintenance_plans.generate_order"],
  events: ["maintenance_plan.created", "maintenance_plan.order_generated"],
  views: ["maintenance_plans.list"],
};
