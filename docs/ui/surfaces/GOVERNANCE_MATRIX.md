# Governance Matrix View Contract

- **surface_id:** UI-SURF-GOVERNANCE-MATRIX
- **surface_name:** Governance Matrix
- **route_candidate:** /builder/governance-matrix
- **purpose:** Criar uma superfície visual que permita simular e inspecionar contratos de governança da plataforma.
- **persona:** Builder, Platform Admin
- **scope:** global
- **workspace_or_global:** global
- **related_capabilities:** Governance, RBAC
- **data_inputs:** Mock Governance Matrix schemas, Roles, Resources, Actions
- **data_outputs:** Local simulation of permissions and scopes
- **commands:** Select Matrix, Select Role, Select Permission, Filter, Compare Roles, Simulate Effect, Simulate Scope
- **empty_state:** No matrix selected
- **loading_state:** Loading matrix data...
- **error_state:** Error loading matrix
- **success_state:** Matrix loaded successfully
- **permissions:** Not Enforced (Design-only)
- **audit_events:** None (Mock Mode)
- **evidence_required:** Visual clarity on "Design-only", "Mock Mode", "Not Enforced"
- **frontend_risks:** Risco de virar RBAC real; Risco de alterar auth; Não deve aplicar ao banco ou API
- **e2e_test_expectation:** Renderiza corretamente e sinaliza modo mock sem falhas
- **implementation_status:** documented

> **Nota:** Esta superfície é *design-only*, *mock/static*, *not enforced*, e *not persisted*.
