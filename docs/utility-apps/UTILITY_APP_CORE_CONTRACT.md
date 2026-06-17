# Utility App Core Contract

This document defines the canonical contract for Utility Apps within the System Builder.

## Conceptual Definitions

To ensure a clear architectural separation, the following definitions are established:

### Utility App Definition
Defines an executable tool focused on I/O (Input/Output). Utility Apps are specialized tools designed to perform specific operations like calculations, lookups, or decision tables. While they may consume persisted datasets, maintain versions, and record execution history, they are characterized by their execution semantics rather than temporal flow management.

### Capability
Defines a business ability or skill (e.g., "Credit Scoring", "Identity Verification") that can be implemented by one or more tools, processes, or modules. A Utility App may declare that it implements certain capabilities via `capabilityKeys`, but the Utility App itself is not a Capability.

### Process Definition
Defines a temporal flow, including states, nodes, and transitions. Unlike Utility Apps, Process Definitions manage the lifecycle and execution path of a workflow over time.

### Action
Defines a technical executable unit. Actions are the building blocks used within Process Definitions or potentially invoked by Utility Apps.

### View
Defines a visual representation or user interface component. While a Utility App might be used to back a View, the View itself is a separate concern.

## Canonical Categories

Utility Apps must belong to one of the following canonical categories:

- **lookup**: Data retrieval based on keys.
- **calculation**: Mathematical or logical computations.
- **decision_table**: Rule-based logic evaluation.
- **mapping**: Transformation of data from one schema to another.
- **reference_catalog**: Static or dynamic list of reference data.
- **diagnostic**: Problem identification based on inputs.
- **checklist**: Verification of requirements or steps.
- **comparison**: Evaluation of differences between inputs.

## Status Lifecycle

- **draft**: Initial state, under definition.
- **published**: Available for use in the system.
- **archived**: Deprecated and no longer recommended for new uses.

## Key Rules

Utility App keys must follow these strict normalization rules:
- 3 to 100 characters.
- Starts with a lowercase letter.
- Contains only lowercase letters (`a-z`), numbers (`0-9`), and hyphens (`-`).
- No trailing hyphens.
- No consecutive hyphens.
