# Boundaries: Case Management Module

## Propósito
Gerenciar casos genéricos (solicitações, incidentes, problemas) de forma universal, permitindo rastreabilidade, atribuição de responsáveis e gestão de ciclo de vida, sem se limitar a tickets específicos de Gestão Técnica.

## Escopo Autorizado
- Gestão de casos (Case).
- Título, descrição, origem, categoria, prioridade, status.
- Atribuição de responsável (assignedTo).
- Comentários e histórico de eventos.
- Listagem, detalhamento, edição e alteração de status.
- UI isolada do módulo.
- Filtros básicos de listagem.

## Proibições e Limites
- **Core Platform:** Não altera `src/platform/kernel.ts` diretamente.
- **Runtime Engine:** Não executa workflows complexos; utiliza transições de estado controladas.
- **Auth:** Não altera permissões, perfis de acesso ou autenticação global.
- **AppShell:** Não altera o layout global ou navegação principal (AppShell).
- **Work Intake:** Não altera o funcionamento do módulo de triagem inicial.
- **Migrations:** Não cria tabelas novas; utiliza `builder.process_candidates` como camada de persistência genérica para este estágio.

## Isolamento e Segurança
- O módulo reside inteiramente em `src/modules/case-management/`.
- **Tenant Isolation:** Toda leitura e escrita DEVE filtrar por `workspaceId`.
- Utiliza contratos Zod estritos (.strict()) para todas as entradas e saídas.
- Depende de `src/platform/` para registro de ações e eventos.
