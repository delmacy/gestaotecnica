# Frontend Parity Gate

Este documento estabelece a política obrigatória de Frontend Parity Gate para o desenvolvimento do System Builder.

## Princípio Fundamental

Nenhuma fase que altere backend, banco de dados, domínio, workflow, capability, form, rule, aprovação, integração ou governança deve ser marcada como completa sem:
1. UI correspondente;
2. Ou fase frontend imediatamente vinculada no roadmap;
3. Ou um gap frontend explícito e justificado (temporário).

## Estratégias de Organização de Fases
Para garantir esse princípio, o roadmap adota três abordagens:
1. **Backend sprint seguido de frontend sprint:** (Ex: 28 e 28B)
2. **Backend + frontend na mesma fase:** Para escopos pequenos.
3. **Bloco backend consolidação -> Frontend consolidação:** Múltiplas fases de backend (ex: 31, 32) seguidas por uma fase de UI (ex: 32B).

## Direção de Produto
* A plataforma (Global) administra tenants (workspaces), usuários, capabilities globais e governança.
* Gestão Técnica é operacional e feita por workspace (Tenant). Processos, dashboards e dados operacionais são estritamente isolados por workspace.
* Toda a operação e construção do System Builder deve rodar dentro de área autenticada, exceto rotas de `/auth/*`.
