# Builder Shell Contract

- **surface_id:** UI-SURF-BUILDER-SHELL
- **surface_name:** Builder Shell
- **purpose:** Atuar como a superfície principal e raiz do System Builder, fornecendo a estrutura primária de navegação, contexto de workspace e o container para acesso a todos os módulos operacionais da plataforma.
- **persona:** Platform Admin, Builder Architect, Process Analyst, Capability Architect, UX Architect, Reviewer, Client Viewer
- **route_candidate:** `/builder`
- **scope:** Gerencia o layout global da plataforma builder (topbar, sidebar, indicadores de contexto) e injeta os submódulos correspondentes baseados em roteamento. Não gerencia o conteúdo interno de cada módulo em si, apenas a transição e apresentação de estado global (auth, contexto, alertas de sistema).
- **workspace_or_global:** Global (mas reflete o contexto de workspace ativo selecionado na Topbar).
- **related_capabilities:** `organization` (para seleção de workspace/contexto), global shell.
- **data_inputs:** N/A (Apenas dados de sessão do usuário e metadados de configuração do workspace).
- **data_outputs:** Mudança de rotas e alteração do workspace ativo no estado global da aplicação.
- **commands:**
  - `SelectWorkspace`: Alterar o workspace em contexto.
  - `NavigateToModule`: Ir para um submódulo (ex: Tasker, Capabilities).
  - `ToggleSidebar`: Expandir ou retrair o menu lateral.
  - `OpenGlobalHelp`: Abrir painel de ajuda e documentação central.
- **empty_state:** N/A para o Shell (se nenhum módulo selecionado, exibe tela de "Welcome/Dashboard").
- **loading_state:** Skeleton de navegação na sidebar e indicador global de carregamento na barra superior ou na área principal.
- **error_state:** Fallback de erro global para rotas não encontradas ou falha crítica (ex: "Application Error").
- **success_state:** Exibição suave de transição entre rotas e notificação global do tipo Toast/Snack.
- **permissions:** Acesso restrito a usuários autenticados no domínio System Builder. Não focado em RBAC granular interno do cliente, mas sim no modelo de persona de builder.
- **audit_events:**
  - `USER_LOGIN`
  - `WORKSPACE_CHANGED`
- **evidence_required:** N/A (Não aplica ações de execução processual).
- **frontend_risks:**
  - Alto impacto no First Contentful Paint.
  - Complexidade de gerenciar estados globais (workspace atual) ao longo de re-renderizações das rotas filhas.
- **e2e_test_expectation:** "O Builder Architect faz login, visualiza o menu principal com os módulos do Grupo A habilitados e navega para `/builder/tasker` com sucesso, observando o contexto de dados do ambiente atual."
- **implementation_status:** documented

## Estrutura Visual Mínima

O Shell deve implementar estruturalmente as seguintes regiões:

1. **Top Bar:** Barra superior contendo:
   - Logo/Marca System Builder.
   - Global Search (placeholder inicial).
   - Menu do usuário (Perfil/Sair).
2. **Workspace Context Indicator:** Seletor de contexto (Workspace/Tenant atual). Normalmente na Topbar ou topo da Sidebar.
3. **Environment/Status Indicator:** Badge claro indicando o modo de execução (ex: "Sintético", "Desenvolvimento", "Demo", "Produção - Piloto").
4. **Sidebar / Module Navigation:** Barra lateral principal com acesso aos módulos da plataforma.
5. **Main Content Area:** Container principal que renderiza a rota filha (`children` no Next.js).
6. **Breadcrumb:** Caminho de navegação logo acima da área de conteúdo (ex: `Builder / Tasker / Task-123`).
7. **Module Status Badge:** Badges visuais indicando o status do módulo (ex: `Beta`, `Mock`, `Preview`).
8. **Quick Actions Area:** Acesso rápido para ações comuns independentes de rota (ex: 'Criar Tarefa', 'Notificações').
9. **Documentation/Help Access:** Ícone/Painel para chamar guias rápidos integrados.

### Módulos do Menu Inicial (Grupo A)
Os seguintes módulos estarão visíveis e ativos inicialmente:
- Dashboard / Home
- Tasker
- Capabilities
- Registry
- Process Mirroring
- Docs
- UI Contracts
- Settings / Workspace

### Módulos Futuros (Disabled / Placeholder)
Os seguintes módulos constam no roadmap, mas devem aparecer desabilitados (estado `coming soon` ou `blocked`):
- Workflow Builder
- Form Builder
- View Builder
- Runtime
- Integrations
- Enterprise Architecture
- Governance
- Enablement

## Rotas Candidatas

O Shell estrutura a fundação para as seguintes rotas base:
- `/builder` (Raiz / Dashboard)
- `/builder/tasker`
- `/builder/capabilities`
- `/builder/registry`
- `/builder/process-mirroring`
- `/builder/docs`
- `/builder/ui-contracts`
- `/builder/settings`

## Personas e Contextos

O Shell reconhece as seguintes personas, ainda que um controle RBAC técnico avançado não seja implementado nesta fase inicial:

- **Platform Admin:** Vê e aciona tudo. Pode gerenciar workspaces globais. Risco de permissão: alterar configurações sensíveis do core.
- **Builder Architect:** Focado no design estrutural. Acesso total a Capabilities, UI Contracts e Workflow Builder (futuro).
- **Process Analyst:** Focado em processos. Acesso a Process Mirroring, Docs e Tasker.
- **Capability Architect:** Foco estreito em desenhar e visualizar Capabilities e Registry.
- **UX Architect:** Focado no módulo de UI Contracts e View Builder (futuro).
- **Reviewer:** Acesso de leitura e aprovação no Tasker e Docs. Acesso limitado de escrita.
- **Client Viewer:** Acesso estritamente read-only, com foco na visualização de outputs de Process Mirroring e Docs em "modo demo/sintético".

## Estados do Shell

A UI do Builder Shell deve gerenciar os seguintes estados que impactam a visualização dos módulos:

- `empty_state`: Não aplicável como um todo, mas as áreas internas lidam com conteúdo vazio.
- `loading_state`: Indicadores globais durante transição ou load de dados do backend.
- `error_state`: Boundary de erro da aplicação (Erro 500 global ou falha de rede).
- `success_state`: Confirmações transientes globais.
- `no_workspace_selected`: Módulos dependentes de workspace são bloqueados e o usuário é forçado a selecionar um contexto.
- `workspace_selected`: Funcionamento normal, menus contextuais disponíveis.
- `module_disabled`: Menu item em estado desabilitado (ex: Runtime).
- `module_blocked`: Acesso negado por permissão ou status documental da capability.
- `module_ready`: Módulo acessível.
- `synthetic_data_mode`: Um alerta fixo no shell indicando que o Builder está operando sob "Dados Sintéticos/Simulados". O indicador deve ser visualmente inconfundível.
- `real_data_required`: Um estado ativado (geralmente nos módulos do Grupo D) onde o Shell informa que a visualização não pode renderizar devido à falta de fontes reais.

## Integração com Módulos do Grupo A

O Builder Shell atua como o integrador principal das seguintes superfícies, cada qual possuirá/possui seu respectivo contrato:

- **Tasker Board:** `docs/ui/surfaces/TASKER_BOARD.md`
- **Capability Explorer:** `docs/ui/surfaces/CAPABILITY_EXPLORER.md`
- **Registry View:** a definir (contrato futuro)
- **Docs Viewer:** a definir (contrato futuro)
- **Process Mirror Board:** `docs/ui/surfaces/PROCESS_MIRROR_BOARD.md`
- **Source Intake:** a definir (contrato futuro)
- **Gap Tracker:** a definir (contrato futuro)
- **As-Is Mirror Board:** a definir (contrato futuro)
- **UI Contracts Viewer:** a definir (contrato futuro)
