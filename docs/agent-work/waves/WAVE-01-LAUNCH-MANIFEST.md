# Wave 01 Launch Manifest

- Base SHA: `518f74ad722d8871aba0721312d29c0317c60ca0`
- Integration branch: `integration/wave-01`
- Workers: jules-dev-shared-contracts-01, jules-dev-runtime-types-01, jules-dev-events-01, jules-documentator-01
- Packages: PKG-SHARED-CONTRACTS-001, PKG-RUNTIME-TYPES-MAPPERS-001, PKG-EVENT-TYPES-MAPPERS-001, PKG-OPERATION-DOCS-FOUNDATION-001
- Merge order: shared contracts, runtime types, event types, operation docs; tenancy only after runtime types completes
- Review routing: module review always; specialized review only when package metadata requires it
- Bootstrap: `npm run agent-work -- bootstrap --worker <worker-key>`
- Rollback: release claims, then revert packages in reverse merge order
- Stop conditions: invalid lease, SHA divergence, red collision, incomplete dependency, failed test, failed review, or failed build

Workers are not started by this manifest.
