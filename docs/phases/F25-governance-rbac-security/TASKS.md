# Tasks — F25 Governance, RBAC & Security

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| SB-GV-01 | Hierarquia de roles | F22, inventário | planned | roles versionadas, escopadas e sem herança ambígua |
| SB-GV-02 | Matriz resource/action/role | GV-01 | planned | UI e contrato representam a mesma política persistida |
| SB-GV-03 | Enforcement em APIs e server actions | GV-01..02 | planned | toda operação sensível resolve actor e workspace no servidor |
| SB-GV-04 | Visualizador de audit log | GV-03 | planned | busca e exportação preservam integridade e escopo |
| SB-GV-05 | Verificação de least privilege | GV-03..04 | planned | permissões excessivas geram recomendação auditável, não revogação automática |
| SB-GV-06 | Segregation of Duties | GV-01..03 | planned | passos conflitantes são bloqueados e explicados |
| SB-GV-07 | Políticas de aprovação | GV-01..03, F23 contracts | planned | política versionada, simulável e auditável |
| SB-GV-08 | MFA para ações sensíveis | GV-03 | planned | desafio adicional somente em operações configuradas |
| SB-GV-09 | Gestão e revogação de sessões | F22 identity | planned | revogação efetiva e registrada |
| SB-GV-10 | Relatório de compliance | GV-04..09 | planned | relatório reproduzível com período, escopo e proveniência |

## Reconciliações obrigatórias

- mapear `access_profile`, roles, permissions, approvals e auth existentes;
- distinguir role de plataforma, membership role e policy contextual;
- não confiar em role enviada pelo cliente;
- UI de permissionamento nunca substitui enforcement no servidor;
- relatórios não devem expor dados de outro workspace.
