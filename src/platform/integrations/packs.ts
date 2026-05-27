export const contextualPacks = [
  {
    key: "operacoes-tecnicas",
    name: "Operacoes Tecnicas",
    department: "Operacao / Sala Tecnica",
    requiredModules: ["work-items", "service-orders", "assets", "workforce", "schedules", "shifts"],
    optionalModules: ["evidences", "comments", "events", "reports", "workflow-engine"],
    description: "Pack para demanda, execucao, ativos, equipe, escalas, turnos e rastreabilidade operacional.",
  },
  {
    key: "planejamento-recursos",
    name: "Planejamento e Recursos",
    department: "Planejamento / Gestao Tecnica",
    requiredModules: ["maintenance-plans", "technical-projects", "acquisitions", "resource-needs"],
    optionalModules: ["suppliers", "inventory", "reports", "documents", "workflow-engine"],
    description: "Pack para planejamento preventivo, projetos, necessidades, compras e recursos.",
  },
  {
    key: "governanca-documental",
    name: "Governanca Documental",
    department: "Secretaria Tecnica / Qualidade",
    requiredModules: ["documents", "reports", "approvals", "legacy"],
    optionalModules: ["evidences", "compliance", "automations", "events"],
    description: "Pack para documentos, relatorios, aprovacoes, sistema oficial e auditoria.",
  },
  {
    key: "integracoes-automacoes",
    name: "Integracoes e Automacoes",
    department: "TI / Integracoes",
    requiredModules: ["automations", "legacy", "events"],
    optionalModules: ["reports", "documents", "workflow-engine", "workspace-config"],
    description: "Pack para webhooks, API gateway, plugins externos, n8n, RPA e sincronizacoes.",
  },
] as const;
