import type { ModuleManifest } from "@/platform/modules";

export const dashboardManifest: ModuleManifest = {
  key: "dashboard",
  name: "Dashboard",
  description: "Leitura executiva de indicadores derivados dos processos modelados.",
  operational: {
    capability: "Medicao operacional",
    process: "Consolidar sinais de execucao, filas, prazos e volumes para acompanhamento.",
    result: "Indicadores de capacidade e processo sem substituir a linha do tempo auditavel.",
    tracking: "Consulta dados operacionais e eventos preservando filtros de workspace.",
    evolution: "Pode evoluir para paineis por capacidade, SLAs, gargalos e maturidade de processo.",
    integrations: ["events", "reports", "workflow-engine"],
  },
  actions: ["dashboard.get_summary"],
  views: ["dashboard.main"],
};
