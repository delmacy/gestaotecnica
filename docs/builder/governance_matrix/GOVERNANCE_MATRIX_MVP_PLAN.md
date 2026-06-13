# Governance Matrix MVP Plan

1. **Objetivo:** Criar uma superfície visual que permita simular e inspecionar contratos de governança da plataforma. A visualização deve ser estritamente design-only, não persistida, e não integrada com RBAC real no backend.
2. **Personas:** Builder, Platform Admin.
3. **Escopo:** Visualizar papéis, permissões, recursos, ações, regras de aprovação, segregação de funções, conflitos e warnings. Tudo em modo mock/client-side.
4. **Fora de escopo:** Integração com backend, aplicação real de autorização, criação real de políticas, manipulação de PII.
5. **Entidades:** GovernanceMatrix, GovernanceRole, GovernanceResource, GovernanceAction, GovernancePermission, GovernanceScope, GovernanceDecision, GovernanceApprovalRule, GovernanceSegregationRule, GovernanceConflict, GovernanceWarning, GovernanceBinding, GovernanceAuditExpectation, GovernanceReadinessStatus, GovernanceVersionDraft.
6. **Telas:** Studio com Grid de Matriz, Painéis laterais de detalhe (Permission, Scope, Approvals, SoD, Conflicts, Bindings, Audit, Warnings).
7. **Fluxo de uso:** O usuário acessa a matriz, seleciona um blueprint, visualiza o grid de permissões, clica em uma célula para ver o detalhe, e interage localmente simulando mudanças (effects/scopes).
8. **Modelos de papel:** platform_superuser, platform_builder, platform_admin, workspace_owner, workspace_admin, manager, supervisor, operator, technician, requester, viewer, etc.
9. **Modelos de permissão:** view, create, edit, delete, approve, assign, audit, etc.
10. **Modelos de escopo:** global, platform, workspace, team, own_records, assigned_records, etc.
11. **Regras de aprovação:** Políticas de aprovação aplicáveis às permissões.
12. **Segregação de funções:** Identificação de funções que não devem ser combinadas.
13. **Conflitos:** Alertas visuais sobre permissões conflitantes.
14. **Warnings:** Avisos gerais de governança.
15. **Relações com Form Builder:** Visualizar ligações com formulários estáticos (Bindings).
16. **Relações com View Builder:** Visualizar ligações com views estáticas (Bindings).
17. **Relações com Workflow Builder:** Visualizar ligações com fluxos estáticos (Bindings).
18. **Critérios de aceite:** Interface renderizada, alertas de "Design Only" visíveis, mocks funcionando, nenhuma chamada de rede disparada para backend.
19. **Próximos passos:** Desenvolvimento da prontidão, criação dos componentes.
