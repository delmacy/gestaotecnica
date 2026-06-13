# Governance Matrix Dev Scope

## Arquivos Candidatos

```text
src/app/(builder)/builder/governance-matrix/page.tsx
src/components/builder/governance-matrix/GovernanceMatrixStudio.tsx
src/components/builder/governance-matrix/GovernanceBlueprintList.tsx
src/components/builder/governance-matrix/GovernanceMatrixGrid.tsx
src/components/builder/governance-matrix/GovernanceRoleList.tsx
src/components/builder/governance-matrix/GovernancePermissionCell.tsx
src/components/builder/governance-matrix/GovernancePermissionDetailPanel.tsx
src/components/builder/governance-matrix/GovernanceScopePanel.tsx
src/components/builder/governance-matrix/GovernanceApprovalPanel.tsx
src/components/builder/governance-matrix/GovernanceSegregationPanel.tsx
src/components/builder/governance-matrix/GovernanceConflictsPanel.tsx
src/components/builder/governance-matrix/GovernanceBindingsPanel.tsx
src/components/builder/governance-matrix/GovernanceAuditPanel.tsx
src/components/builder/governance-matrix/governance-matrix-data.ts
src/components/builder/governance-matrix/governance-matrix-types.ts
```

**Restrições:** Estes arquivos devem conter apenas UI (Next.js client/server components isolados) e types/data locais. Nenhuma injeção de dependência do DB é permitida.
