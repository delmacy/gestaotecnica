import { UiContractStaticIndex, UiSurfaceContract, UiContractDevStatus, UiContractGroup } from "./ui-contracts-types";

export const MOCK_UI_CONTRACTS_INDEX: UiContractStaticIndex = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  contracts: [
    {
      id: "contract-1",
      surface_id: "UI-SURF-BUILDER-SHELL",
      surface_name: "Builder Shell",
      slug: "builder-shell",
      group: "group_a_platform_foundation",
      route_candidate: "/builder",
      purpose: "Superfície raiz e principal da plataforma. Atua como o container de navegação.",
      persona: ["Platform Admin", "Builder Architect", "Process Analyst"],
      scope: "Container de navegação global, gerencia layout, Módulos do Menu e status de Autenticação visual.",
      workspace_or_global: "global",
      implementation_status: "approved",
      dev_status: "done",
      related_capabilities: ["organization"],
      data_inputs: ["Navigation clicks", "Workspace selection"],
      data_outputs: ["Route changes"],
      commands: ["Navigate", "Select Workspace"],
      frontend_risks: "Risco de acoplamento excessivo com submódulos se não usar bem os layouts do Nextjs.",
      evidence_required: "Screenshot da topbar e sidebar com os menus do Grupo A.",
      e2e_test_expectation: "O admin vê o dashboard vazio e navega pela sidebar sem recarregar a página.",
      related_reviews: ["DEV-REVIEW-BUILDER-SHELL-001"],
      related_tasks: ["BUILDER-SHELL-001", "DEV-BUILDER-SHELL-001"],
      dependencies: [],
      synthetic: true,
      notes: "Contrato base já implementado no sistema."
    },
    {
      id: "contract-2",
      surface_id: "UI-SURF-TASKER-BOARD",
      surface_name: "Tasker Board",
      slug: "tasker-board",
      group: "group_a_platform_foundation",
      route_candidate: "/builder/tasker",
      purpose: "Superfície de coordenação do desenvolvimento do System Builder.",
      persona: ["Builder Platform Architect", "Builder Dev", "Jules Agent"],
      scope: "Visualização e gestão de tasks de desenvolvimento do próprio Builder.",
      workspace_or_global: "global",
      implementation_status: "approved",
      dev_status: "done",
      related_capabilities: ["work_orders"],
      data_inputs: ["Filtros", "Mudança de status mockada"],
      data_outputs: ["N/A (Estado local por enquanto)"],
      commands: ["Filtrar por Status", "Mover Task"],
      frontend_risks: "Complexidade de arrastar e soltar (drag and drop) sem backend persistente.",
      evidence_required: "Screenshot do Board mostrando tarefas renderizadas em colunas.",
      e2e_test_expectation: "Visualizar tarefas, clicar em uma 'ready' e ver detalhes.",
      related_reviews: ["DEV-REVIEW-TASKER-BOARD-001"],
      related_tasks: ["TASKER-BOARD-001", "DEV-TASKER-BOARD-001"],
      dependencies: [],
      synthetic: true,
      notes: "Usado para gerenciar Jules."
    },
    {
      id: "contract-3",
      surface_id: "UI-SURF-UI-CONTRACTS-VIEWER",
      surface_name: "UI Contracts Viewer",
      slug: "ui-contracts-viewer",
      group: "group_a_platform_foundation",
      route_candidate: "/builder/ui-contracts",
      purpose: "Visualizar contratos de UI da plataforma de forma navegável e estruturada.",
      persona: ["Builder Platform Architect", "Builder Dev", "UX Architect"],
      scope: "Apresentação indexada e pesquisável dos metadados de UI_SURF_*.md em modo read-only.",
      workspace_or_global: "global",
      implementation_status: "ready_for_dev",
      dev_status: "in_progress",
      related_capabilities: ["docs_viewer", "builder_shell"],
      data_inputs: ["Search term", "Group toggle", "Status filters"],
      data_outputs: ["N/A"],
      commands: ["Filter", "Search"],
      frontend_risks: ["Risco de parecer um editor", "Risco de tentar ler fs no client"],
      evidence_required: ["Screenshot da lista", "Screenshot dos painéis de detalhe filtrados"],
      e2e_test_expectation: "Renderiza lista mockada e não oferece botão de salvar.",
      related_reviews: ["DEV-READINESS-UI-CONTRACTS-VIEWER-001"],
      related_tasks: ["UI-CONTRACTS-VIEWER-001", "DEV-UI-CONTRACTS-VIEWER-001"],
      dependencies: [],
      synthetic: true,
      notes: "O próprio componente que estamos desenvolvendo!"
    },
    {
      id: "contract-4",
      surface_id: "UI-SURF-FORM-BUILDER",
      surface_name: "Form Builder",
      slug: "form-builder",
      group: "group_b_builder_design",
      route_candidate: "/builder/forms",
      purpose: "Criar interfaces dinâmicas de coleta de dados baseados em Capabilities.",
      persona: ["UX Architect", "Process Analyst"],
      scope: "Editor visual arrastar-e-soltar para definição de schemas e forms.",
      workspace_or_global: "workspace",
      implementation_status: "future",
      dev_status: "planned",
      related_capabilities: ["form_definition"],
      data_inputs: ["Component properties", "Validation rules"],
      data_outputs: ["Form Schema JSON"],
      commands: ["Add Field", "Save Schema", "Preview Form"],
      frontend_risks: ["Alta complexidade de UI", "Gestão de estado complexo (React Hook Form + DnD)"],
      evidence_required: "Contrato futuro não definido.",
      e2e_test_expectation: "Usuário cria formulário, adiciona campo de texto e salva schema.",
      related_reviews: [],
      related_tasks: ["FORM-BUILDER-001"],
      dependencies: [
        { id: "UI-SURF-UI-CONTRACTS-VIEWER", name: "UI Contracts Viewer", isBlocking: true, reason: "Precisa de contratos primeiro" }
      ],
      synthetic: true,
      notes: "Futuro."
    },
    {
      id: "contract-5",
      surface_id: "UI-SURF-RUNTIME-EXECUTION",
      surface_name: "Runtime Engine View",
      slug: "runtime-execution",
      group: "group_c_runtime_integration",
      route_candidate: "/runtime",
      purpose: "Visualizar e interagir com processos de trabalho em tempo real.",
      persona: ["Operator", "Manager"],
      scope: "Apenas execução de tarefas, sem edição de blueprint.",
      workspace_or_global: "workspace",
      implementation_status: "future",
      dev_status: "not_started",
      related_capabilities: ["work_orders", "scheduling"],
      data_inputs: ["Real operational data", "Form submissions"],
      data_outputs: ["Database mutations", "Events"],
      commands: ["Start Task", "Complete Task", "Block Task"],
      frontend_risks: "Precisa de conexão Websocket/SSE robusta.",
      evidence_required: "Logs operacionais.",
      e2e_test_expectation: "TBD",
      related_reviews: [],
      related_tasks: ["RUNTIME-CONTRACT-001"],
      dependencies: [],
      synthetic: false,
      notes: "Isolado do Builder Shell."
    },
    {
      id: "contract-6",
      surface_id: "UI-SURF-GT-PILOT",
      surface_name: "Gestão Técnica Workspace",
      slug: "gt-pilot",
      group: "group_d_client_real",
      route_candidate: "/workspace/gt",
      purpose: "Workspace real para o piloto de Gestão Técnica.",
      persona: ["GT Admin", "Technician"],
      scope: "TBD - baseado nos processos espelhados reais.",
      workspace_or_global: "workspace",
      implementation_status: "blocked",
      dev_status: "blocked",
      related_capabilities: [],
      data_inputs: ["Fontes Reais", "Ordens de Serviço"],
      data_outputs: ["Eventos em banco de dados real"],
      commands: ["Receber OS", "Finalizar Reparo"],
      frontend_risks: "Vazamento de PII, quebra de contrato operacional.",
      evidence_required: "Fontes anonimizadas no repositório.",
      e2e_test_expectation: "TBD",
      related_reviews: [],
      related_tasks: ["REAL-SRC-002", "GT-PILOT-001"],
      dependencies: [
        { id: "REAL-SRC-002", name: "Fontes Reais", isBlocking: true, reason: "Aguardando anonimização pelo cliente." }
      ],
      synthetic: false,
      notes: "Bloqueado pelo portão D."
    }
  ]
};

export function getUiContractDevStatusSummary(contracts: UiSurfaceContract[]): Record<UiContractDevStatus, number> {
  const summary: Record<UiContractDevStatus, number> = {
    not_started: 0,
    planned: 0,
    ready: 0,
    in_progress: 0,
    done: 0,
    blocked: 0,
    future: 0,
  };

  for (const contract of contracts) {
    if (contract.dev_status in summary) {
      summary[contract.dev_status]++;
    }
  }

  return summary;
}

export function getUiContractGroupSummary(contracts: UiSurfaceContract[]): Record<UiContractGroup, number> {
  const summary: Record<UiContractGroup, number> = {
    group_a_platform_foundation: 0,
    group_b_builder_design: 0,
    group_c_runtime_integration: 0,
    group_d_client_real: 0,
  };

  for (const contract of contracts) {
    if (contract.group in summary) {
      summary[contract.group]++;
    }
  }

  return summary;
}
