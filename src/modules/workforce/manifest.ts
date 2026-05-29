import type { ModuleManifest } from "@/platform/modules";

export const workforceManifest: ModuleManifest = {
  key: "workforce",
  name: "Workforce",
  description: "Pessoas, equipes, papeis e competencias que sustentam capacidades organizacionais.",
  operational: {
    capability: "Gestao de responsaveis e capacidade humana",
    process: "Cadastrar equipes, perfis, papeis, disponibilidade e competencias.",
    result: "Responsaveis rastreaveis para atribuicao, aprovacao e continuidade dos processos.",
    tracking: "Eventos de criacao e alteracao de perfis/equipes conectados ao workspace.",
    evolution: "Pode evoluir para matriz de competencias, alocacao, treinamento e autoridade por processo.",
    integrations: ["schedules", "service-orders", "approvals", "events"],
  },
  actions: ["workforce.create_technician", "workforce.create_team"],
  events: ["workforce.technician_created", "workforce.team_created"],
  views: ["workforce.list", "workforce.teams"],
};
