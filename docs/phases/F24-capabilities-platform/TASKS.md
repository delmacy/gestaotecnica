# Tasks — F24 Universal Capabilities Platform

Todas as tasks exigem inventário prévio dos contratos e módulos existentes.

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| SB-CP-01 | Consolidar registry de capabilities | F22, inventário | planned | capability possui ID, manifest, versão, dependências e lifecycle |
| SB-CP-02 | Capability Organization | CP-01 | planned | estrutura organizacional reutilizável e escopada |
| SB-CP-03 | Capability People | CP-01 | planned | perfis, skills, certificações e disponibilidade reutilizáveis |
| SB-CP-04 | Capability Customers | CP-01 | planned | clientes, contratos e interações sem acoplamento a uma adaptação |
| SB-CP-05 | Capability Requests | CP-01, F23 contracts | planned | intake, triagem e roteamento configuráveis |
| SB-CP-06 | Capability Cases | CP-01, F23 contracts | planned | ciclo de caso, evidências, decisão e fechamento |
| SB-CP-07 | Capabilities Tasks & Work Orders | CP-01 | planned | trabalho, despacho e execução reaproveitam módulos existentes |
| SB-CP-08 | Capability Scheduling | CP-01 | planned | agenda, recursos, conflitos e janelas configuráveis |
| SB-CP-09 | Capabilities Inventory & Assets | CP-01 | planned | rastreabilidade, movimentação e reconciliação reutilizáveis |
| SB-CP-10 | Documents, Approvals & Audit | CP-01, F25 contracts | planned | documentos, aprovação e auditoria integrados por manifest |

## Regra de implementação

Cada task deve iniciar com uma matriz:

| Componente existente | Decisão | Motivo | Migração |
|---|---|---|---|
| ... | reuse/extend/replace | ... | ... |

Capability universal não conhece Gestão Técnica, System Trading ou outro cliente. Adaptações instalam e configuram a capability.
