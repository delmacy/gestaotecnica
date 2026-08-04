# F25 — Governance, RBAC & Security

Status: `planned`

## Objetivo

Consolidar roles, permissions, policies, segregation of duties, sessões, auditoria e controles de ações sensíveis por workspace.

## Resultado de produto

Cada ação relevante é autorizada por identidade e contexto de workspace resolvidos no servidor, com políticas verificáveis, trilha de auditoria e controles adicionais para operações críticas.

## Escopo incluído

- hierarquia de roles e matriz de permissões;
- enforcement em routes e server actions;
- audit log e least privilege;
- segregation of duties;
- políticas de aprovação;
- MFA para ações sensíveis;
- gerenciamento de sessões;
- relatórios de compliance.

## Fora de escopo

- segurança federada e suporte remoto;
- observabilidade de infraestrutura que pertence à F21;
- regras de negócio específicas de um tenant no core global;
- autorização baseada apenas em elementos visuais da UI.

## Dependências e gates

- F22 validada;
- inventário de roles, access profiles, permissions e approvals existentes;
- contratos de actor, workspace, resource, action e policy;
- decisão sobre auditoria imutável e retenção.

## Definição de pronto

Testes demonstram ações permitidas e negadas para múltiplos papéis e workspaces, incluindo SoD, sessão revogada e ação sensível com receipt auditável.
