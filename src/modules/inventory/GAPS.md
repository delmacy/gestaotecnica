# Gaps de Implementação - Módulo Inventory

Este documento registra as limitações e decisões tomadas durante a reconstrução limpa do módulo Inventory, priorizando o isolamento de workspaces via `process_candidates`.

## 1. Isolamento de Entidades Legadas (GAPs P0)

As seguintes tabelas no banco de dados legada não possuem a coluna `workspace_id`, o que impede sua consulta segura em um ambiente multi-tenant:

- `suppliers` (Fornecedores)
- `assets` (Ativos)
- `service_orders` (Ordens de Serviço)
- `acquisition_needs` (Necessidades de Aquisição)
- `users` (Usuários)

**Decisão:** Conforme regras de segurança, as consultas que dependem dessas tabelas retornam listas vazias ou valores "N/A" para evitar vazamento de dados entre workspaces.

## 2. Persistência Alternativa

Como a criação de novas migrations está proibida no escopo deste módulo, utilizamos a tabela `builder.process_candidates` como camada de persistência genérica.

- **Filtro:** `origin` definido como `inventory-item` ou `inventory-movement`.
- **Esquema:** Dados armazenados no campo JSONB `proposed_definition`.

## 3. Cálculo de Saldo Consistente

O saldo não é mais persistido em uma coluna `quantity_on_hand` (como na tabela legada que não tinha isolamento). O saldo agora é calculado dinamicamente:
1. Soma-se a `initialQuantity` do item.
2. Agregam-se todas as movimentações (`inventory-movement`) vinculadas ao ID do item dentro do mesmo workspace.

## 4. Histórico Append-Only

Não foi implementada edição ou exclusão de movimentos. Toda alteração de estoque deve ser feita via novo registro de movimento, garantindo trilha de auditoria imutável.
