export const contextualPacks = [
  {
    key: "operacoes-tecnicas",
    name: "Operações de Campo e Atendimento",
    department: "Operação / Atendimento / Campo",
    requiredModules: ["work-items", "service-orders", "assets", "workforce", "schedules", "shifts"],
    optionalModules: ["evidences", "comments", "events", "reports", "workflow-engine"],
    description: "Pack para demanda, execução, ativos, equipe, escalas, turnos e rastreabilidade operacional.",
  },
  {
    key: "planejamento-recursos",
    name: "Planejamento e Recursos",
    department: "Planejamento / Recursos / Capacidade",
    requiredModules: ["maintenance-plans", "technical-projects", "acquisitions", "resource-needs"],
    optionalModules: ["suppliers", "inventory", "reports", "documents", "workflow-engine"],
    description: "Pack para planejamento preventivo, projetos, necessidades, compras e recursos.",
  },
  {
    key: "governanca-documental",
    name: "Governança Documental",
    department: "Qualidade / Secretaria Operacional / Conformidade",
    requiredModules: ["documents", "reports", "approvals", "legacy"],
    optionalModules: ["evidences", "compliance", "automations", "events"],
    description: "Pack para documentos, relatórios, aprovações, sistema oficial e auditoria.",
  },
  {
    key: "integracoes-automacoes",
    name: "Integrações e Automações",
    department: "TI / Integrações",
    requiredModules: ["automations", "legacy", "events"],
    optionalModules: ["reports", "documents", "workflow-engine", "workspace-config"],
    description: "Pack para webhooks, API gateway, plugins externos, n8n, RPA e sincronizações.",
  },
] as const;
