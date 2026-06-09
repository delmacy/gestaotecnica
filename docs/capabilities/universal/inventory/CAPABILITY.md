# Capability — inventory

| Campo | Valor |
|---|---|
| Capability name | inventory |
| Capability type | resource |
| Primary domain | universal/inventory |
| Core business | Sustentar a capacidade organizacional de inventory sem acoplamento setorial. |
| Main entities | Item, StockLocation, InventoryMovement, Lot |
| Main processes | receive stock; reserve; issue; reconcile |
| Main states | available, reserved, low_stock, expired |
| Main events | receive_stock_completed, reserve_completed, issue_completed, reconcile_completed |
| Depends on | organization, people e governance conforme escopo |
| Used by | blueprints, workspaces e processos adaptados |
| Out of scope | especialização setorial e implementação técnica |
| Acceptance criteria | entidades, processos, regras, UI e eventos revisados |
