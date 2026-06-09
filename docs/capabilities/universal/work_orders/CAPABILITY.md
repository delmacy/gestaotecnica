# Capability — work_orders

| Campo | Valor |
|---|---|
| Capability name | work_orders |
| Capability type | work-management |
| Primary domain | universal/work_orders |
| Core business | Sustentar a capacidade organizacional de work_orders sem acoplamento setorial. |
| Main entities | WorkOrder, Execution, Evidence, Validation |
| Main processes | issue work order; execute; validate; close |
| Main states | draft, planned, executing, validation, closed |
| Main events | issue_work_order_completed, execute_completed, validate_completed, close_completed |
| Depends on | organization, people e governance conforme escopo |
| Used by | blueprints, workspaces e processos adaptados |
| Out of scope | especialização setorial e implementação técnica |
| Acceptance criteria | entidades, processos, regras, UI e eventos revisados |
