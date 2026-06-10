# DEV-READINESS-BUILDER-SHELL-001 Audit

## 1. Avaliação do Contrato (BUILDER_SHELL.md)

1. **Clareza do objetivo do Shell:** Claro. O Shell atuará como superfície principal, estrutura de navegação e container para os módulos do System Builder.
2. **Escopo incluído:** Topbar, Sidebar, Breadcrumbs, indicadores de contexto/workspace, badges de modo sintético/demo, e áreas de menu.
3. **Fora de escopo:** O Shell não gerencia o conteúdo interno de cada módulo. Não lida com autenticação e RBAC complexo ou persistência de banco de dados neste momento.
4. **Rotas candidatas:** Definidas corretamente (ex: `/builder`, `/builder/tasker`, etc).
5. **Personas:** Definidas.
6. **Estados visuais:** Mapeados (loading_state, error_state, module_disabled, synthetic_data_mode, etc).
7. **Menu inicial:** Definido (Dashboard, Tasker, Capabilities, Registry, Process Mirroring, Docs, UI Contracts, Settings).
8. **Módulos futuros/disabled:** Registrados (Workflow Builder, Form Builder, etc).
9. **Modo sintético/demo:** Declarado. É obrigatório haver um alerta visual claro de que o sistema está em modo sintético.
10. **Dependência de workspace:** O Shell depende de um contexto de workspace (selecionável), mas para esta fase pode ser simulado, não precisando de um workspace persistido real.
11. **Dependência de fontes reais:** Nenhuma. O layout do Shell é agnóstico aos dados reais.
12. **Dependência de banco:** Nenhuma. Pode operar com mock de dados de sessão.
13. **Dependência de runtime:** Nenhuma. O menu de runtime até consta como disabled.
14. **Dependência de autenticação/RBAC:** Nenhuma exigência real para a estrutura inicial.
15. **Riscos de frontend:** Alto impacto no First Contentful Paint; Complexidade de gerenciamento de estado global.
16. **Critérios de teste E2E:** Bem definido. Foco na navegação e visualização do menu do Grupo A.
17. **Gaps antes do Dev:** Não há gaps documentais para iniciar a implementação visual do layout base do Shell. Faltam contratos para os módulos internos.

## 2. Decisão Final

**READY_FOR_DEV_WITH_LIMITS**

O contrato do Builder Shell é robusto o suficiente para permitir o desenvolvimento de sua estrutura visual e navegação fundamental. No entanto, por ser a fundação de uma plataforma ainda em construção e sem dependências prontas, o desenvolvimento deve ocorrer com restrições estritas.

## 3. Limites Estabelecidos para Jules Dev

O desenvolvimento está restrito à construção da "casca" (Shell).

**Pode implementar:**
- Layout shell visual;
- Top bar;
- Sidebar;
- Área principal;
- Breadcrumbs;
- Indicadores de modo sintético/demo;
- Menu estático do Grupo A;
- Módulos futuros como disabled;
- Rotas candidatas básicas (se permitido pela stack atual e configurando layouts aninhados);
- Dados mockados ou constantes locais (ex: dados de usuário simulados, lista de workspaces hardcoded).

**Não pode implementar:**
- Autenticação real;
- RBAC real;
- Banco de dados (tabelas, conexões, queries completas de schema);
- Runtime engine;
- API Gateway;
- Integração n8n;
- Workspace persistido real no DB (use mock e guarde no estado local);
- Processo de Gestão Técnica real;
- Captura de fontes reais;
- Permissões definitivas.
