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

Lifecycle states:
- `draft`: Under construction, not ready for production use.
- `published`: Stable version ready to be consumed.
- `deprecated`: Still available but usage is discouraged.
- `archived`: No longer available for new uses.

### DatasetKind

Categorization of the data nature:
- `reference`: Master data (e.g., list of cities, products).
- `transactional`: Event-based data (e.g., sales, logs).
- `analytical`: Aggregated or processed data for BI.
- `derived`: Data generated from other datasets or processes.

### DatasetRefreshMode

Intended update method:
- `manual`: User triggers the update.
- `on_demand`: System triggers as needed.
- `scheduled`: Time-based updates (logic handled by a separate Scheduler).
- `event_driven`: Updates triggered by external or system events.

### DatasetField

Definition of a single column:
- `key`: snake_case identifier.
- `type`: `string`, `number`, `boolean`, `date`, `datetime`, `object`, `array`.
- `required`: boolean.
- `nullable`: boolean.

## Relation with Utility Apps

- **Consumption:** Utility Apps can use a Dataset as an input source for calculations, lookups, or mapping.
- **Production:** A Utility App can be the engine that produces a new version or materialization of a Dataset.
- **Separation of Concerns:**
    - Dataset contains **no logic**.
    - Dataset **does not** reference handlers or execution code.
    - Utility Apps contain the **execution logic** that interacts with Datasets.

## Implementation Details

The contract is implemented using [Zod](https://zod.dev/) in `src/platform/datasets/contracts/dataset-definition.ts`.

All definitions are **immutable** (enforced via `Object.freeze` in the Zod transform).
