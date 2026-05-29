import type { ModuleManifest } from "@/platform/modules";

export const shiftsManifest: ModuleManifest = {
  key: "shifts",
  name: "Shifts",
  description: "Continuidade operacional por turnos, ocorrencias e passagem de servico.",
  operational: {
    capability: "Continuidade de operacao",
    process: "Abrir turno, registrar ocorrencias, acompanhar pendencias e fechar passagem.",
    result: "Livro de turno auditavel que preserva contexto para a proxima execucao.",
    tracking: "Eventos de abertura, entrada e fechamento com ator, horario e entidade vinculada.",
    evolution: "Pode incorporar checklists, revisao, geracao de demandas e assinaturas de passagem.",
    integrations: ["work-items", "schedules", "documents", "events"],
  },
  actions: ["shift_logs.add_entry", "shifts.open", "shifts.close"],
  events: ["shift_log.entry_added", "shift.opened", "shift.closed"],
  views: ["shifts.list", "shifts.detail"],
};
