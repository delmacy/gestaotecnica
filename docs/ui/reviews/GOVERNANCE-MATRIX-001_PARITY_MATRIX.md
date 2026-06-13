# Governance Matrix Parity Matrix

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Renderizar matriz de permissões | GOVERNANCE_MATRIX_MVP_PLAN.md | GovernanceMatrixGrid | Sim | mapped | N/A | Implementar UI estática |
| Roles (Papéis) | STATIC_SCHEMA_CONTRACT.md | Linhas/Colunas, GovernanceRoleList | Sim | mapped | N/A | Implementar listas e dados estáticos |
| Resources e Actions | STATIC_SCHEMA_CONTRACT.md | Linhas na matriz | Sim | mapped | N/A | Definir estrutura de recurso/ação mockada |
| Permission effects | STATIC_SCHEMA_CONTRACT.md | Cores/ícones na célula, Detail Panel | Sim | mapped | N/A | Implementar legenda e célula clicável |
| Scopes | STATIC_SCHEMA_CONTRACT.md | Scope Panel | Sim | mapped | N/A | Implementar Scope Panel |
| Approval rules | MVP_PLAN.md | Approval Panel | Sim | mapped | N/A | Implementar Approval Panel |
| Segregation rules (SoD) | MVP_PLAN.md | Segregation Panel | Sim | mapped | N/A | Implementar Segregation Panel |
| Conflicts | MVP_PLAN.md | Conflicts Panel | Sim | mapped | N/A | Implementar Conflicts Panel |
| Warnings | MVP_PLAN.md | Banner/Panel | Sim | mapped | N/A | Implementar Warnings UI |
| Audit expectations | MVP_PLAN.md | Audit Panel | Sim | mapped | N/A | Implementar Audit Panel |
| Bindings (Forms, Views, Workflows)| MVP_PLAN.md | Bindings Panel | Sim | mapped | N/A | Implementar Bindings Panel |
| Perfis builder/admin/operador | BOUNDARIES.md | Referências na lista de papéis | Sim | mapped | N/A | Criar mock de referência sem alterar real auth |
| Design-only / Not enforced | BOUNDARIES.md | Badge permanente na UI | Não | mapped | N/A | Adicionar badge no Header |
| Sem RBAC real | BOUNDARIES.md | Estado client-side apenas | Não | mapped | N/A | Assegurar que nenhuma API/DB seja chamada |
| Grupo D bloqueado | BOUNDARIES.md | Ausência de roteamento real | Não | mapped | N/A | Manter Gestão Técnica fora do escopo funcional |
