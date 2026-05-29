import type { ModuleManifest } from "@/platform/modules";

export const automationsManifest: ModuleManifest = {
  key: "automations",
  name: "Automations",
  description: "Gatilhos e rotinas governadas que executam actions sem esconder a operacao.",
  operational: {
    capability: "Automacao governada",
    process: "Registrar gatilhos, executar rotinas, armazenar resultado e expor falhas.",
    result: "Automacao observavel com execucao, logs, payloads e correlacao operacional.",
    tracking: "Eventos, runs e logs com origem, duracao, payload de entrada e resposta.",
    evolution: "Pode integrar filas, agendas, provedores externos e politica de aprovacao antes da automacao.",
    integrations: ["events", "integrations", "notifications", "workflow-engine"],
  },
  actions: ["automations.run"],
  events: ["automation_rule.executed"],
  views: ["automations.list"],
  dependencies: ["events"],
};
