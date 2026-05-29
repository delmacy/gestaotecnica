import type { ModuleManifest } from "@/platform/modules";

export const approvalsManifest: ModuleManifest = {
  key: "approvals",
  name: "Approvals",
  description: "Decisoes formais de revisao, aceite, retorno e aprovacao operacional.",
  operational: {
    capability: "Governanca de decisoes",
    process: "Solicitar, avaliar, decidir e registrar aprovacoes sobre execucoes ou documentos.",
    result: "Decisao auditavel que autoriza continuidade, retorno ou fechamento de uma instancia.",
    tracking: "Eventos de solicitacao e decisao com ator, payload e entidade relacionada.",
    evolution: "Pode evoluir para matrizes de autoridade, regras condicionais e assinaturas formais.",
    integrations: ["service-orders", "documents", "workflow-engine", "events"],
  },
  actions: ["approvals.request", "approvals.decide"],
  events: ["approval.requested", "approval.decided"],
  views: ["approvals.list"],
  dependencies: ["service-orders"],
};
