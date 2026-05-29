import type { ModuleManifest } from "@/platform/modules";

export const reportsManifest: ModuleManifest = {
  key: "reports",
  name: "Reports",
  description: "Relatorios derivados de processos e eventos para analise operacional.",
  operational: {
    capability: "Analise e prestacao de contas",
    process: "Gerar leituras formais sobre execucao, volume, pendencias e historico.",
    result: "Relatorio rastreavel que apoia medicao, melhoria e governanca.",
    tracking: "Evento de geracao com parametros, ator e periodo consultado.",
    evolution: "Pode receber templates por blueprint, exportacao, assinatura e BI externo.",
    integrations: ["events", "documents", "dashboard"],
  },
  actions: ["reports.generate_operational"],
  events: ["report.generated"],
  views: ["reports.list"],
};
