import type { ModuleManifest } from "@/platform/modules";

export const schedulesManifest: ModuleManifest = {
  key: "schedules",
  name: "Schedules",
  description: "Disponibilidade planejada de pessoas, turnos e janelas de capacidade.",
  operational: {
    capability: "Planejamento de capacidade temporal",
    process: "Registrar escalas, ausencias, sobreavisos e disponibilidade operacional.",
    result: "Capacidade planejada para alimentar atribuicoes, filas e continuidade.",
    tracking: "Eventos de criacao e alteracao de escala vinculados a workspace e responsavel.",
    evolution: "Pode incorporar regras de cobertura, conflitos, recorrencia e integracao com calendario.",
    integrations: ["workforce", "shifts", "service-orders", "events"],
  },
  actions: ["schedules.create"],
  events: ["schedule.created"],
  views: ["schedules.calendar"],
};
