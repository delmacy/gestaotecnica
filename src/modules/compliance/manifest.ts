import type { ModuleManifest } from "@/platform/modules";

export const complianceManifest: ModuleManifest = {
  key: "compliance",
  name: "Compliance",
  description: "Auditorias, achados, riscos e acoes corretivas rastreaveis.",
  operational: {
    capability: "Governanca de conformidade",
    process: "Planejar auditorias, registrar achados, atribuir acoes e acompanhar mitigacao.",
    result: "Evidencia de conformidade com responsaveis, prazos, severidade e historico.",
    tracking: "Eventos de auditoria e achados vinculados ao workspace e entidades relacionadas.",
    evolution: "Pode evoluir para controles, requisitos normativos, planos de acao e trilhas de evidencia.",
    integrations: ["documents", "evidences", "workforce", "events"],
  },
  actions: ["compliance.create_audit"],
  events: ["compliance.audit_created"],
  views: ["compliance.audits", "compliance.findings"],
};
