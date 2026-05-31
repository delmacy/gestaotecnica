# AUDITORIA TÉCNICA COMPLETA DO SYSTEM BUILDER

## Resumo Executivo
Esta auditoria avaliou o estado real do System Builder, diferenciando o que existe funcionalmente e com persistência de dados do que é apenas interface gráfica e/ou mock no código. O objetivo principal foi verificar o ciclo `UI -> Persistência -> Registro -> Runtime -> Efeito real` das principais funcionalidades.

### Tabela de Status

| Área | Status | Detalhes |
|--------|--------|----------|
| Organizations | PARCIAL / NÃO FUNCIONA | O Kernel Action e os schemas existem. Porém, na versão atual do DB, `drizzle-kit push` ignora a criação de tabelas em múltiplos schemas (como `workspace`). Manualmente funciona, porém o runtime out-of-the-box via CLI falha por falta das tabelas. |
| Workspaces | PARCIAL / NÃO FUNCIONA | Sofre do mesmo problema estrutural e de migração das Organizations. |
| Capability Registry | FUNCIONA | O registry está populado no código via bootstrap e a action de listagem (`listCapabilitiesKernelAction`) mapeia com o array fixo ou banco de dados legado. A instalação `workspaces.install_capability` também tem kernel action mas depende das tabelas. |
| Module Registry | FUNCIONA | O `platform/modules/module-registry.ts` efetivamente registra (manifest), detecta dependências e é invocado para aprovar a execução de Actions pelo Contexto (se módulo e escopos existirem). |
| Action Registry | FUNCIONA | Actions são carregadas corretamente e executadas se invocadas (`runAction`), validando entrada e gerando as saídas e emitindo Eventos correspondentes no Array de resultado. |
| Event Registry | PARCIAL | Eventos emitidos chamam o `outbox-service` e são salvos na tabela legado `event_logs`. Porém há divergência entre a tabela `event_logs` legado e o `workspaceId` que passou a ser um UUID com referência à tabela não-criada de Workspace, gerando FK Constraint Violations. |
| Process Builder | APENAS INTERFACE | Embora as Actions e esquemas de Banco (workflow.process_definitions, process_versions, etc) e a UI em ReactFlow (`ProcessBuilder`) existam, o `ProcessOrchestrator` em si está `mockado` (Possui um `try/catch` que loga e engole `[Orchestrator] No process definition found for work_item. Skipping.` ignorando a execução state-machine real, falhando na pesquisa da definição). |
| Flow Builder | FUNCIONA (Com ressalvas DB) | A interface ReactFlow existe. Salva na base de dados (`workflow.flow_definitions`) o JSON da estrutura se o DB estiver criado. |
| Flow Runtime | FUNCIONA (Básico MVP) | `DynamicFlowRunner` implementa varredura no nó de Gatilho e execução sequencial da Ação linkada (`nodes`, `edges`). Foi validada em runtime real chamando Actions aninhadas (Ex: work_item.created dispara notification.send). |
| View Builder | APENAS INTERFACE / MOCK | A UI (`ViewBuilder`) existe visualmente com templates mockados. A persistência tenta salvar no banco na tabela errônea `forms` proxy. Não há um "View Engine" real gerando interface dinâmica consumida pelo cliente final. |
| Runtime Engine | PARCIAL | `runAction` comanda verificações completas. Mas OutboxService e FlowRunner têm limitações com concorrência ou falhas silenciosas da orquestração. |
| End-to-End | NÃO FUNCIONA | O teste ponta a ponta (Org -> Workspace -> Instalar -> Flow -> Trigger -> Action) aborta múltiplas vezes nas criações de tabela, e ao disparar eventos falha pela constraint legado vs novo schema. |

### Funcionalidades Prontas e Operacionais
- Action Registry, Module Manifesting e Validações de Escopo (RBAC Inicial).
- Dynamic Flow Execution (Ações Sequenciais do Evento via `DynamicFlowRunner`).

### Funcionalidades Parcialmente Prontas
- Criação e Persistência de Workspaces e Organizações (Esquemas separados do PostgreSQL não foram aplicados pelo Drizzle adequadamente sem intervenção manual).
- Registro e Disparo de Eventos no Outbox (Quebra por chaves estrangeiras com tabela legada).

### Funcionalidades Fake (UI sem runtime / Somente Desenho)
- Process Builder (State machine visual sem Runtime funcional real, embora tabela exista).
- View Builder (Mock visual completo, sem engine renderizador genérico e persistindo em tabelas proxies de formulário).
- Organization Builder, Form Builder, Capability Builder e Dashboard no Canvas são estáticos / limitados.

### Funcionalidades Ausentes
- Execução complexa de fluxos (branches reais de Condition Node, loops).
- Views Dinâmicas para Web Components.
- Conexão e Isolamento perfeito de Tenants (Organization/Workspace) em todas as tabelas (ainda dependem fortemente de `system` fallback ou `public.workspaces` vs `workspace.workspaces`).

### Principais Bloqueadores (Próximas Implementações Prioritárias)
1. **Unificação e Fixação das Migrations (Drizzle-Kit):** A estratégia atual dividida de schemas (`workspace`, `workflow`) não é suportada diretamente pelo CLI sem scripts manuais. Isso impede instalação do ambiente e testes do Kernel Actions. Deve-se resolver o setup Drizzle-Multi-Schema.
2. **Refatoração do EventLog para Modelos Novos:** Atualmente os eventos salvam em `public.event_logs` forçando FK em `public.workspaces`, invalidando criação de Workspaces na engine nova (`workspace.workspaces`).
3. **Implementação do ProcessOrchestrator:** Transformar os modelos `ProcessDefinition` e `Transitions` em uma máquina de estado real que trave Actions ou exija Actions sequenciais, abandonando o Mock atual.
4. **Criação do ViewEngine:** Ligar as definições estruturais do `ViewBuilder` a uma engine `DynamicComponent` que construa Tabelas e Formulários consumindo de `kernel actions` em tela de modo reativo.
