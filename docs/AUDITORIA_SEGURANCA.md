# AUDITORIA DE SEGURANÇA - SYSTEM BUILDER

## Segurança Multi-tenant

*   **Vazamento entre Tenants:**
    *   `FlowRunner` e `WorkflowEngineService` recebem `workspaceId`, mas a validação de que o usuário/ator pertence a esse workspace precisa ser reforçada em todas as kernel actions.
    *   As queries atuais no `flow-runner.ts` filtram corretamente por `workspaceId`.
*   **Isolamento de Schema:** O uso de schemas PostgreSQL separados (`workspace`, `workflow`, `registry`) é uma barreira de segurança sólida.

## Integridade de Dados

*   **Fluxos e Processos Órfãos:**
    *   Exclusão de um Workspace não remove em cascata as definições de flows e processos (Falta implementação de Cleanup).
    *   Transições e Ações no `WorkflowRepository` podem ficar órfãs se a `processVersion` for removida (Falta ON DELETE CASCADE nas referências).
*   **Consistência Multi-schema:** Atualmente, a integridade referencial entre o schema `workflow` e `workspace` é mantida por FKs, o que é positivo.

## Autorização

*   **Kernel Actions:** O campo `callableBy` é verificado no `action-runner.ts`, mas a granularidade por Role (ex: `Admin` vs `Manager`) dentro do builder ainda é manual/hardcoded na UI.

## Gaps Técnicos

*   **Campos sem Validação:** Os inputs do builder para salvar definições aceitam qualquer JSON, o que pode levar a ataques de injeção de configuração se o runtime não for sanitizado.
