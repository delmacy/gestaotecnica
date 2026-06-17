# Package Report: PKG-UTILITY-APP-CORE-CONTRACT-001

## Summary
Created the canonical core contract for Utility Apps in the System Builder. This package establishes the fundamental domain models for stateless I/O tools, distinct from Process Definitions (workflows) and Capabilities.

## Deliverables
- `src/platform/utility-apps/contracts/utility-app.ts`: Core Zod schemas and types.
- `src/platform/utility-apps/contracts/index.ts`: Internal exports.
- `src/platform/utility-apps/index.ts`: Public API exports.
- `tests/unit/utility-app-core-contract.test.ts`: Comprehensive test suite.
- `docs/utility-apps/UTILITY_APP_CORE_CONTRACT.md`: Conceptual documentation and architectural separation.
- `docs/agent-work/reviews/PKG-UTILITY-APP-CORE-CONTRACT-001_REPORT.md`: This report.

## Common Contracts Reused
- `EntityIdSchema` (from `@/platform/contracts`)
- `WorkspaceIdSchema` (from `@/platform/contracts`)
- `ISODateTimeSchema` (from `@/platform/contracts`)
- `UnknownRecordSchema` (from `@/platform/contracts`)

## Key Decisions
- **UtilityAppKeySchema**: Reuses the technical regex from `ProcessDefinitionKeySchema` (3-100 chars, lowercase, hyphenated) to maintain platform-wide naming conventions, while keeping the type nominal and distinct.
- **Tags Validation**: Implemented a strict unique validation for tags using Zod's `.refine()`.
- **CapabilityKeys**: Modeled as an optional array of strings, representing declarative references to Capabilities that the Utility App implements.
- **Strictness**: All schemas use `.strict()` to reject unknown fields, ensuring contract integrity.

## Verification Results
- **Unit Tests**: 14 tests executed and passed (covering valid/invalid categories, statuses, keys, versions, and schema strictness).
- **Build**: `npm run build` completed successfully.
- **No Runtime/Persistence**: Confirmed absence of execution engines, database schemas, or API implementations.
