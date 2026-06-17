# Dataset Definition Contract

**Package ID:** PKG-DATASET-CORE-CONTRACT-001
**Module:** `datasets`
**Status:** Stable / Canonical

## Overview

A Dataset represents a stable definition of a structured data collection. It is a reusable asset consumed by Utility Apps, forms, views, and processes.

Datasets focus on the **schema** and **metadata** of the data, not on the actual rows, query execution, or physical storage.

## Schema Components

### DatasetKey

A unique identifier for the dataset within a workspace.
- **Regex:** `/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/` (kebab-case)
- **Length:** 3 to 100 characters.

### DatasetStatus

Lifecycle states (consistent with `UtilityAppStatusSchema` and `ProcessDefinitionStatusSchema`):
- `draft`: Under construction, not ready for production use.
- `published`: Stable version ready to be consumed.
- `deprecated`: Still available but usage is discouraged.
- `archived`: No longer available for new uses.

### DatasetKind

Categorization of the data nature.
Initial canonical choices:
- `reference`: Master data.
- `transactional`: Event-based data.

*Note: speculative types like `analytical` or `derived` are reserved for future extensions.*

### DatasetRefreshMode

Intended update method.
Initial canonical choices:
- `manual`: User triggers the update.
- `scheduled`: Time-based updates.

*Note: speculative modes like `on_demand` or `event_driven` are reserved for future extensions.*

### DatasetField

Definition of a single column:
- `key`: snake_case identifier.
- `type`: `string`, `number`, `boolean`, `date`, `datetime`, `object`, `array`.
- `required`: boolean.
- `nullable`: boolean.

### sourceReference

Logical identifier for the data source (e.g., `legacy_crm/clients`, `sql-orders-v1`).
- **Safety:** Constrained to a segment-based logical identifier regex. Rejects traversal segments (`.`, `..`), empty segments, leading/trailing separators, URLs, DSNs, and SQL-like fragments.

### metadata

Generic metadata container.
- **Safety:** Uses canonical `SafeJsonRecordSchema` which recursively validates the structure. Rejects functions, accessors, symbol properties, cycles, and non-JSON built-ins (Date, Map, Set). Shared acyclic references (DAGs) are supported.

## Relation with Utility Apps

- **Consumption:** Utility Apps can use a Dataset as an input source for calculations, lookups, or mapping.
- **Production:** A Utility App can be the engine that produces a new version or materialization of a Dataset.
- **Separation of Concerns:**
    - Dataset contains **no logic**.
    - Dataset **does not** reference handlers or execution code.
    - Utility Apps contain the **execution logic** that interacts with Datasets.

## Implementation Details

The contract is implemented using [Zod](https://zod.dev/) in `src/platform/datasets/contracts/dataset-definition.ts`.

All definitions are **shallowly immutable** (enforced via `Object.freeze` in the Zod transform). The contract guarantees that the input object is not mutated.
JSON safety is enforced via the canonical `SafeJsonRecordSchema`.
