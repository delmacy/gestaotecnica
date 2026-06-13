import { OperatorGuide } from "./operator-guide-types";

export const MOCK_OPERATOR_GUIDES: OperatorGuide[] = [
  {
    id: "og-001",
    title: "Primeiro acesso à plataforma",
    slug: "primeiro-acesso-plataforma",
    description: "Guia para o primeiro acesso à plataforma System Builder.",
    category: "getting_started",
    audiences: ["platform_builder", "platform_admin", "operator"],
    difficulty: "beginner",
    readiness_status: "mock_ready",
    data_source_mode: "static_documentation",
    prerequisites: [
      { id: "pr-1", description: "Ter recebido as credenciais de acesso iniciais." },
      { id: "pr-2", description: "Estar em um ambiente com acesso à rede da plataforma." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar a página de Login",
        description: "Navegue até a página de login da plataforma.",
        related_route: "/auth/login",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Inserir Credenciais",
        description: "Insira seu email e senha nos campos apropriados e clique em 'Entrar'.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Verificar Dashboard",
        description: "Após o login, você deve ser redirecionado para o dashboard do Builder Shell.",
        expected_result: "O Builder Shell é carregado com as opções de menu disponíveis para o seu perfil.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Selecionar Workspace",
        description: "Selecione o workspace correto no menu superior direito, caso tenha acesso a múltiplos workspaces.",
        is_optional: true,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "warning", message: "Nunca compartilhe suas credenciais de acesso." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "Esqueci minha senha.",
        solution_steps: ["Entre em contato com o Platform Admin para redefinir sua senha."]
      }
    ],
    related_surfaces: ["Builder Shell"],
    related_routes: [
      { route_path: "/auth/login", label: "Página de Login", description: "Rota para autenticação no sistema." },
      { route_path: "/builder", label: "Dashboard", description: "Página inicial após o login." }
    ],
    related_docs: ["docs/auth/PLATFORM_ADMIN_ACCESS.md"],
    synthetic: true
  },
  {
    id: "og-002",
    title: "Criar ou redefinir o superusuário Builder",
    slug: "criar-redefinir-superusuario",
    description: "Instruções para a criação ou redefinição do superusuário da plataforma através do script dedicado.",
    category: "platform_access",
    audiences: ["platform_admin"],
    difficulty: "advanced",
    readiness_status: "mock_ready",
    data_source_mode: "static_documentation",
    prerequisites: [
      { id: "pr-1", description: "Acesso ao terminal onde a aplicação está hospedada." },
      { id: "pr-2", description: "Permissão para executar scripts Node.js no ambiente." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Definir Variáveis de Ambiente",
        description: "Defina as variáveis PLATFORM_ADMIN_NAME, PLATFORM_ADMIN_EMAIL e PLATFORM_ADMIN_PASSWORD no seu ambiente.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Executar Script",
        description: "Execute o script de setup utilizando o npx tsx.",
        command_text_placeholder: "npx tsx src/scripts/ensure-platform-admin.ts",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Verificar Logs",
        description: "Verifique os logs no terminal para confirmar que o usuário foi criado ou atualizado com sucesso.",
        expected_result: "Mensagem de sucesso no console indicando a configuração do superusuário.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Realizar Login",
        description: "Acesse a rota de login e teste as novas credenciais.",
        related_route: "/auth/login",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "critical", message: "Este script altera diretamente as credenciais de acesso mais altas do sistema. Execute com extrema cautela." },
      { id: "w-2", level: "info", message: "Não utilize senhas fracas ou previsíveis em ambientes de produção." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "O script falha com erro de conexão ao banco de dados.",
        solution_steps: ["Verifique se as variáveis de ambiente DATABASE_URL estão corretas e se o banco de dados está rodando."]
      }
    ],
    related_surfaces: [],
    related_routes: [
      { route_path: "/auth/setup", label: "Setup Route", description: "Rota web de setup auxiliar (se disponível)." }
    ],
    related_docs: ["docs/auth/PLATFORM_ADMIN_ACCESS.md"],
    synthetic: true
  },
  {
    id: "og-003",
    title: "Navegar pelo Builder Shell",
    slug: "navegar-builder-shell",
    description: "Um guia rápido para entender a interface e as áreas de navegação principais do Builder Shell.",
    category: "navigation",
    audiences: ["platform_builder", "platform_admin", "operator", "process_analyst"],
    difficulty: "beginner",
    readiness_status: "mock_ready",
    data_source_mode: "static_documentation",
    prerequisites: [
      { id: "pr-1", description: "Estar autenticado na plataforma." },
      { id: "pr-2", description: "Estar na página inicial (/builder)." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Conhecer a Sidebar",
        description: "Observe a barra lateral à esquerda. Ela contém todos os módulos ativos do sistema.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Conhecer a Topbar",
        description: "A barra superior exibe o seletor de Workspace atual, status do ambiente (ex: Sintético) e o menu do seu perfil.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Identificar Módulos Bloqueados",
        description: "Alguns módulos na sidebar podem estar cinzas ou inativos. Eles representam features futuras (Grupo C/D).",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Alternar Workspace",
        description: "Clique no nome do Workspace atual na Topbar para visualizar e alterar seu contexto operacional.",
        expected_result: "Os dados da tela principal devem ser atualizados para refletir o novo workspace.",
        is_optional: true,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "info", message: "Certifique-se de estar no workspace correto antes de iniciar qualquer operação." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "A Sidebar desapareceu.",
        solution_steps: ["Verifique se o seu dispositivo tem uma tela muito pequena. A Sidebar pode ter sido recolhida para um menu hambúrguer."]
      }
    ],
    related_surfaces: ["Builder Shell"],
    related_routes: [
      { route_path: "/builder", label: "Dashboard", description: "O Shell em si." }
    ],
    related_docs: ["docs/ui/surfaces/BUILDER_SHELL.md"],
    synthetic: true
  },
  {
    id: "og-004",
    title: "Consultar o Tasker Board",
    slug: "consultar-tasker-board",
    description: "Como utilizar o Tasker Board para visualizar e coordenar as atividades de desenvolvimento da plataforma.",
    category: "navigation",
    audiences: ["platform_builder", "reviewer", "process_analyst"],
    difficulty: "beginner",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Estar autenticado." },
      { id: "pr-2", description: "Possuir papel com permissão de visualização do Tasker." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar o Tasker",
        description: "Clique em 'Tasker' na barra lateral de navegação.",
        related_route: "/builder/tasker",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Visualizar as Colunas",
        description: "Observe as colunas que representam o status das tarefas (Backlog, Ready, In Progress, Review, Done, Blocked).",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Filtrar Tarefas",
        description: "Utilize o campo de busca no topo para encontrar tarefas pelo ID ou título.",
        is_optional: true,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Visualizar Detalhes",
        description: "Clique em um card de tarefa para ver a descrição completa, dependências e status de aprovação.",
        expected_result: "Um painel lateral ou modal se abrirá com as informações da tarefa.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "info", message: "Nesta fase mock, mover os cards não salva o estado no banco de dados." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "As tarefas parecem desatualizadas.",
        solution_steps: ["Recarregue a página (F5), os dados atuais são carregados de um index estático a cada inicialização."]
      }
    ],
    related_surfaces: ["Tasker Board"],
    related_routes: [
      { route_path: "/builder/tasker", label: "Tasker Board", description: "Superfície de gestão de tarefas." }
    ],
    related_docs: ["docs/ui/surfaces/TASKER_BOARD.md"],
    synthetic: true
  },
  {
    id: "og-005",
    title: "Executar Process Mirroring Intake em modo sintético",
    slug: "pm-intake-sintetico",
    description: "Como registrar a coleta de informações de um processo quando operando sem fontes reais.",
    category: "process_mirroring",
    audiences: ["process_analyst", "platform_builder"],
    difficulty: "intermediate",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Compreender o conceito de 'Process Candidate'." },
      { id: "pr-2", description: "Ter os dados sintéticos em mente para input." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar Process Mirroring",
        description: "Navegue para a superfície de Process Mirroring via barra lateral.",
        related_route: "/builder/process-mirroring",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Iniciar Novo Intake",
        description: "Clique no botão de novo registro para abrir o formulário.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Preencher Dados Simulados",
        description: "Insira os dados do processo. Certifique-se de preencher a flag ou campo indicando 'SIMULATED_OBSERVATION' ou marcar o estado como sintético.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Concluir Formulário",
        description: "Revise os dados e simule a submissão.",
        expected_result: "A interface confirmará o recebimento, mas não salvará em banco.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "warning", message: "Processos sintéticos devem ser marcados como 'NEEDS_REAL_SOURCES' para não contaminarem a esteira de validação real." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "O formulário não avança para o próximo passo.",
        solution_steps: ["Verifique se todos os campos obrigatórios (marcados com *) foram preenchidos com dados de mock."]
      }
    ],
    related_surfaces: ["Process Mirroring Intake"],
    related_routes: [
      { route_path: "/builder/process-mirroring", label: "Process Mirroring", description: "Área principal de intake." }
    ],
    related_docs: ["docs/ui/surfaces/PROCESS_MIRRORING_INTAKE.md"],
    synthetic: true
  },
  {
    id: "og-006",
    title: "Revisar Source Intake e Gap Tracker",
    slug: "revisar-source-intake-gaps",
    description: "Procedimento para verificar as fontes do espelhamento de processos e identificar lacunas de informação.",
    category: "process_mirroring",
    audiences: ["process_analyst", "reviewer"],
    difficulty: "intermediate",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Ter um Process Intake já inicializado (mesmo que mockado)." },
      { id: "pr-2", description: "Acesso à rota de Gap Tracker." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar Source Intake",
        description: "Vá para a listagem de inventário de fontes.",
        related_route: "/builder/process-mirroring",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Identificar Fontes Ausentes",
        description: "Procure por fontes documentais ou entrevistas marcadas como 'Pendente'.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Acessar Gap Tracker",
        description: "Abra a visão do Gap Tracker associada ao processo em questão.",
        related_route: "/builder/process-mirroring/gaps",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Registrar Gap de Validação",
        description: "Se não houver fontes reais, crie um item de gap indicando 'NEEDS_REAL_SOURCES'.",
        expected_result: "O Gap Tracker exibirá o novo card de bloqueio na interface.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "warning", message: "Um processo não pode ir para a fase de As-Is Mirror se houver Gaps Críticos abertos." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "Não consigo encontrar a aba Gap Tracker.",
        solution_steps: ["Verifique se o processo principal está selecionado no contexto da tela, a aba pode aparecer apenas após seleção."]
      }
    ],
    related_surfaces: ["Source Intake", "Gap Tracker"],
    related_routes: [
      { route_path: "/builder/process-mirroring", label: "Source Intake", description: "Tabela de fontes." },
      { route_path: "/builder/process-mirroring/gaps", label: "Gap Tracker", description: "Quadro de gestão de lacunas." }
    ],
    related_docs: ["docs/ui/surfaces/GAP_TRACKER.md", "docs/ui/surfaces/SOURCE_INTAKE.md"],
    synthetic: true
  },
  {
    id: "og-007",
    title: "Interpretar o As-Is Mirror",
    slug: "interpretar-as-is-mirror",
    description: "Guia sobre como ler e interpretar o mapeamento visual de um processo 'As-Is'.",
    category: "process_mirroring",
    audiences: ["process_analyst", "platform_builder", "reviewer"],
    difficulty: "intermediate",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "O processo deve estar na fase As-Is no ciclo de mirroring." },
      { id: "pr-2", description: "Compreensão básica de notação de fluxogramas." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar o As-Is Mirror",
        description: "Navegue para a aba As-Is Mirror Board dentro de Process Mirroring.",
        related_route: "/builder/process-mirroring/as-is",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Analisar Swimlanes",
        description: "Observe as raias (swimlanes); elas representam os atores ou departamentos envolvidos no processo atual.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Identificar Gargalos e Handoffs",
        description: "Procure por anotações visuais (geralmente vermelhas ou amarelas) que indicam passagens de bastão ineficientes ou esperas.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Verificar Gaps Críticos",
        description: "Se houver passos marcados como 'desconhecidos', eles devem possuir uma correspondência no Gap Tracker.",
        expected_result: "Compreensão clara de como o processo opera hoje, sem idealizações.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "info", message: "O As-Is Mirror reflete a realidade crua, não tente 'consertar' o processo nesta visualização." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "O diagrama não renderiza.",
        solution_steps: ["Verifique se o processo selecionado já concluiu a fase inicial de Intake. Processos vazios exibirão uma tela em branco."]
      }
    ],
    related_surfaces: ["As-Is Mirror Board"],
    related_routes: [
      { route_path: "/builder/process-mirroring/as-is", label: "As-Is Mirror", description: "Visualização do processo atual." }
    ],
    related_docs: ["docs/ui/surfaces/AS_IS_MIRROR.md"],
    synthetic: true
  },
  {
    id: "og-008",
    title: "Montar um Form Blueprint",
    slug: "montar-form-blueprint",
    description: "Instruções para utilizar a superfície de Form Builder em modo Mock Studio.",
    category: "form_builder",
    audiences: ["platform_builder", "ux_architect"],
    difficulty: "advanced",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Estar familiarizado com a estrutura de schemas estáticos (JSON)." },
      { id: "pr-2", description: "Ter acessado a interface do Form Builder." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar Form Builder",
        description: "No menu lateral, selecione a opção 'Form Builder' (se estiver ativo).",
        related_route: "/builder/form-builder",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Verificar a Interface de Design",
        description: "A interface exibirá uma área de arrastar-e-soltar simulada e um painel de propriedades à direita.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Adicionar Campos Simples",
        description: "Simule a adição de um campo de 'Texto Curto' clicando no ícone correspondente.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Observar Preview Local",
        description: "Visualize a renderização do formulário no painel central. A alteração de propriedades refletirá instantaneamente.",
        expected_result: "Um formulário montado na interface local que não persiste após atualizar a página.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "warning", message: "O Form Builder nesta fase não gera migrations, não altera o banco de dados e não é publicado no Runtime." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "Perdi o formulário após atualizar a tela.",
        solution_steps: ["Este é o comportamento esperado. O estado não é salvo em modo mock/design-only."]
      }
    ],
    related_surfaces: ["Form Builder"],
    related_routes: [
      { route_path: "/builder/form-builder", label: "Form Builder", description: "Interface de design de formulários." }
    ],
    related_docs: ["docs/ui/surfaces/FORM_BUILDER.md"],
    synthetic: true
  },
  {
    id: "og-009",
    title: "Montar um View Blueprint",
    slug: "montar-view-blueprint",
    description: "Como usar o View Builder para prototipar a apresentação de dados (tabelas, cards).",
    category: "view_builder",
    audiences: ["platform_builder", "ux_architect"],
    difficulty: "advanced",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Conceitos de View-Model." },
      { id: "pr-2", description: "Acesso ao View Builder ativo." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar View Builder",
        description: "Navegue para a rota do View Builder.",
        related_route: "/builder/view-builder",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Selecionar Fonte de Dados Simulada",
        description: "Escolha uma entidade mockada (ex: 'WorkOrder') na aba de propriedades da view.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Configurar Colunas da Tabela",
        description: "Adicione colunas que devem ser exibidas, simulando a escolha de propriedades da entidade.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Visualizar Rendering Seguro",
        description: "Observe como o Builder simula a renderização. Verifique a proteção contra parsing dinâmico perigoso.",
        expected_result: "Tabela renderizada com dados estáticos de demonstração.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "info", message: "Semelhante ao Form Builder, o estado é efêmero e não altera visualizações em produção." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "A visualização quebrou ao adicionar um campo complexo JSON.",
        solution_steps: ["No MVP, apenas campos escalares simples (string, number) têm suporte robusto no rendering simulado da view."]
      }
    ],
    related_surfaces: ["View Builder"],
    related_routes: [
      { route_path: "/builder/view-builder", label: "View Builder", description: "Protótipos de visão de dados." }
    ],
    related_docs: ["docs/ui/surfaces/VIEW_BUILDER.md"],
    synthetic: true
  },
  {
    id: "og-010",
    title: "Montar um Workflow Blueprint",
    slug: "montar-workflow-blueprint",
    description: "Guia para utilizar a interface de design estático de workflows.",
    category: "workflow_builder",
    audiences: ["platform_builder"],
    difficulty: "advanced",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Entendimento básico de modelagem de processos (BPMN simples)." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar Workflow Builder",
        description: "Clique em Workflow Builder na barra de navegação.",
        related_route: "/builder/workflow-builder",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Adicionar Passo Inicial (Trigger)",
        description: "Simule a adição de um evento que inicia o fluxo, como 'Processo Recebido'.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Adicionar Passos de Ação e Decisão",
        description: "Adicione passos sequenciais ou condicionais e configure as propriedades fictícias no painel lateral.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Revisar o Diagrama Completo",
        description: "Avalie o fluxo visual resultante.",
        expected_result: "Um diagrama visual lógico que representa o estado 'To-Be' em modo design.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "critical", message: "O Workflow Builder NÃO possui motor de execução. Ele não orquestra tarefas reais nem envia chamadas ao n8n nesta fase." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "A tela mostra que n8n está desconectado.",
        solution_steps: ["Este é o comportamento esperado. O System Builder é soberano; o n8n não é exigido para modelagem e não estará ativado em modo mock."]
      }
    ],
    related_surfaces: ["Workflow Builder"],
    related_routes: [
      { route_path: "/builder/workflow-builder", label: "Workflow Builder", description: "Design visual de regras e fluxos." }
    ],
    related_docs: ["docs/ui/surfaces/WORKFLOW_BUILDER.md"],
    synthetic: true
  },
  {
    id: "og-011",
    title: "Revisar a Governance Matrix",
    slug: "revisar-governance-matrix",
    description: "Como analisar a matriz de papéis e permissões modelada visualmente.",
    category: "governance",
    audiences: ["platform_admin", "process_analyst"],
    difficulty: "advanced",
    readiness_status: "mock_ready",
    data_source_mode: "synthetic",
    prerequisites: [
      { id: "pr-1", description: "Conceitos de RBAC e Segregation of Duties (SoD)." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Acessar Governance Matrix",
        description: "Abra a matriz de governança a partir do menu.",
        related_route: "/builder/governance-matrix",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Interpretar as Células",
        description: "Linhas representam Perfis/Roles; Colunas representam Ações/Capabilities. Marcas indicam permissão concedida.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Verificar Conflitos",
        description: "Utilize filtros ou alertas visuais para identificar riscos de SoD (ex: um papel que pode aprovar e auditar o próprio trabalho).",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-4",
        order: 4,
        title: "Simular Alteração",
        description: "Clique em uma célula para simular a revogação ou concessão de acesso.",
        expected_result: "O estado visual altera localmente sem efetivar no banco de dados.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "warning", message: "A interface de Governança atual não altera o Auth ou RBAC real do banco. Serve apenas para documentação e planejamento To-Be." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "Tentei remover um acesso, mas o usuário ainda acessa o módulo.",
        solution_steps: ["As alterações são apenas visuais (mock). Permissões reais dependem de implementação do Runtime/Auth."]
      }
    ],
    related_surfaces: ["Governance Matrix"],
    related_routes: [
      { route_path: "/builder/governance-matrix", label: "Governance Matrix", description: "Matriz de papéis e permissões." }
    ],
    related_docs: ["docs/ui/surfaces/GOVERNANCE_MATRIX.md"],
    synthetic: true
  },
  {
    id: "og-012",
    title: "Diagnosticar problemas de login e acesso",
    slug: "diagnosticar-login-acesso",
    description: "Procedimento rápido de resolução de problemas comuns ao tentar acessar a plataforma.",
    category: "troubleshooting",
    audiences: ["platform_admin", "operator"],
    difficulty: "beginner",
    readiness_status: "mock_ready",
    data_source_mode: "static_documentation",
    prerequisites: [
      { id: "pr-1", description: "Navegador atualizado e conexão com a internet." },
    ],
    procedures: [
      {
        id: "step-1",
        order: 1,
        title: "Verificar URL",
        description: "Certifique-se de estar acessando a URL correta do ambiente (ex: /auth/login e não /login antigo).",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-2",
        order: 2,
        title: "Verificar Caps Lock e Cache",
        description: "Senhas são case-sensitive. Se o erro persistir, limpe o cache do navegador ou teste em aba anônima.",
        is_optional: false,
        synthetic: false,
      },
      {
        id: "step-3",
        order: 3,
        title: "Contatar o Administrador",
        description: "Se o acesso estiver revogado, apenas um Platform Admin pode restabelecê-lo via script ou painel futuro.",
        is_optional: false,
        synthetic: false,
      }
    ],
    warnings: [
      { id: "w-1", level: "info", message: "Múltiplas tentativas falhas podem bloquear o IP em ambientes de produção." }
    ],
    troubleshooting: [
      {
        id: "t-1",
        problem_statement: "A página de login não carrega (Erro 500).",
        solution_steps: ["Verifique se o banco de dados PostgreSQL está rodando e acessível pelo backend."]
      }
    ],
    related_surfaces: [],
    related_routes: [
      { route_path: "/auth/login", label: "Login", description: "" }
    ],
    related_docs: [],
    synthetic: false
  }
];
