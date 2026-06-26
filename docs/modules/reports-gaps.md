# Relatório de Gaps: Módulo de Reporting

Este documento registra contratos, dados ou comportamentos ausentes identificados durante a consolidação do módulo de Reporting.

## 1. Isolamento de Workspace em Tabelas Legadas
**Impacto:** Segurança e Multitenancy.
**Descrição:** As tabelas a seguir, utilizadas pelo módulo de Reporting, não possuem a coluna `workspace_id` para isolamento de dados:
- `reports`
- `work_items`
- `assets`
- `service_orders`
- `shift_log_entries`
- `time_entries`

**Gap:** Atualmente, as consultas de reporting em `src/modules/reports/queries.ts` e as ações em `src/modules/reports/actions.ts` **bloqueiam** o retorno de dados destas tabelas para evitar vazamento entre tenants (cross-tenant leaks). O Reporting retornará 0 ou listas vazias até que a coluna `workspace_id` seja adicionada e populada nestas entidades.

## 2. Prevenção de N+1 em Agregações
**Impacto:** Performance.
**Descrição:** Embora as consultas tenham sido otimizadas para usar `groupBy` e `count` em uma única chamada, consultas mais complexas que cruzem dados dinâmicos de diferentes workspaces podem exigir padrões de Data Loader ou Views materializadas.

## 3. UI de Filtros Avançados
**Impacto:** Experiência do Usuário (UX).
**Descrição:** O filtro implementado é básico (por modelo). Filtros por período (data de início/fim) estão implementados no contrato da query, mas a UI ainda não expõe seletores de data para o usuário final.

## 4. Dependência de Contratos de Outros Módulos
**Impacto:** Acoplamento.
**Descrição:** O Reporting consome diretamente tabelas de `service-orders`, `work-items` e `assets`. Mudanças nesses módulos produtores podem quebrar o Reporting se não houver uma camada de abstração de dados (ex: Data Lake interno ou Views).
