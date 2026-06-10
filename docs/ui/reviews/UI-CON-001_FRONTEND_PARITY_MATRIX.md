# UI-CON-001 Frontend Parity Matrix

Esta matriz demonstra o alinhamento das superfícies UI com o status documental, capacidades operacionais e a real necessidade de dados do processo piloto para prosseguirem. Nenhuma superfície será codificada até que os bloqueios sejam resolvidos e as tarefas de arquitetura/runtime garantam a prontidão do dev (`DEV-READINESS-001`).

| surface | related_task | related_capability | persona | workspace_or_global | data_source_status | permission_dependency | process_mirroring_dependency | status | blocking_gap |
|---------|--------------|--------------------|---------|---------------------|--------------------|-----------------------|------------------------------|--------|--------------|
| `Capability Explorer` | CAP-VAL-001 | organization | Admin | Global / Workspace | Conceptual / Stable | Global RBAC | Nenhuma | documented | Nenhum |
| `Process Mirror Board` | PM-PILOT-003 | documents, audit | Analyst, Validator | Workspace | Synthetic (Needs Real) | Process Analist Role | Nenhuma (É a própria ferramenta) | needs_validation | Fontes e evidências reais para o piloto de PM |
| `Tasker Board` | TASKER-001 | organization | Platform Admin, Agent | Global | Conceptual / Stable | Global RBAC | Nenhuma | documented | Nenhum |
| `Enterprise Map` | EA-PILOT-001 | organization | Enterprise Architect | Workspace | Synthetic (Needs Real) | Workspace RBAC | PM-PILOT finalizado | needs_validation | Piloto sem fontes reais impacta o EA-MAP |
| `Governance Role Matrix` | GOV-PILOT-001 | approvals, people | Security Reviewer | Global / Workspace | Conceptual / Stable | Governance RBAC | Nenhuma | needs_validation | Precisa de validação humana dos conflitos/SoD definidos |
| `Operator Guide` | ENA-PILOT-001 | knowledge, documents | Technician | Workspace | Conceptual / Stable | Operacional | Nenhuma | documented | Nenhum (Mas conteúdo final dependerá do piloto) |
| `Technical Service Intake` | CAP-VAL-002 | requests, work_orders | Requester, Dispatcher | Workspace | Synthetic (Needs Real) | Workspace RBAC | PM-PILOT com Real Sources | needs_validation | Faltam fontes operacionais reais do cliente (DEP-001a) |

## Observações de Paridade

- As superfícies marcadas como **`documented`** possuem um contrato claro e podem ser passadas para design ou planejamento de infraestrutura frontend, mas não para implementação até que `DEV-READINESS-001` mude para pronto.
- As superfícies marcadas como **`needs_validation`** têm forte dependência em descobrir a *realidade* operacional. Como o Process Mirroring atual (PM-PILOT-003) utilizou dados sintéticos/simulados, implementar as interfaces agora resultará em retrabalho garantido. Estas superfícies aguardam dados do mundo real.