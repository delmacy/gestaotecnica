# Capability Registry

O Registry é o índice documental oficial. Status documented significa contrato inicial existente; não significa validado em piloto nem pronto para Dev.

| Capability | Categoria | Relações principais | Estado documental | Próximo gate |
|---|---|---|---|---|
| organization | foundation | people, governance | review | validação com piloto/caso real |
| people | foundation | organization, governance, scheduling | review | validação com piloto/caso real |
| customers | relationship | organization, communication | review | validação com piloto/caso real |
| providers | relationship | organization, procurement, contracts | review | validação com piloto/caso real |
| requests | work-management | customers, communication, cases, work_orders | review | validação com piloto/caso real |
| cases | work-management | requests, tasks, documents | review | validação com piloto/caso real |
| tasks | work-management | people, cases, work_orders | review | validação com piloto/caso real |
| work_orders | work-management | requests, tasks, assets, audit | review | validação com piloto/caso real |
| scheduling | resource | people, resources, work_orders | review | validação com piloto/caso real |
| resources | resource | scheduling, work_orders | review | validação com piloto/caso real |
| assets | resource | work_orders, inventory | review | validação com piloto/caso real |
| inventory | resource | work_orders, procurement, audit | review | validação com piloto/caso real |
| documents | information | audit, approvals | review | validação com piloto/caso real |
| communication | information | customers, requests, integrations | review | validação com piloto/caso real |
| approvals | control | people, governance, audit | review | validação com piloto/caso real |
| audit | control | governance, all operational capabilities | review | validação com piloto/caso real |
| analytics | intelligence | audit, enterprise_architecture | review | validação com piloto/caso real |
| knowledge | information | enablement, documents | review | validação com piloto/caso real |
| compliance | control | governance, audit | review | validação com piloto/caso real |
| sales | commercial | customers, contracts, finance | review | validação com piloto/caso real |
| procurement | commercial | providers, approvals, inventory, finance | review | validação com piloto/caso real |
| finance | commercial | sales, procurement, contracts, audit | review | validação com piloto/caso real |
| contracts | legal | customers, providers, approvals, legal | review | validação com piloto/caso real |
| legal | legal | contracts, documents, audit | review | validação com piloto/caso real |
