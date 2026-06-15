# Capability Meta Model

This document defines the conceptual model for "Capabilities" within the System Builder.

## Conceptual Model

A **Capability** represents an abstract and reusable business capacity. It is a building block that describes *what* a business can do, regardless of *how* it is implemented or in which sector it is applied.

### Core Components

- **Capability**: The top-level entity representing a business capacity.
- **CapabilityDomain**: A logical grouping of related capabilities (e.g., Financial, Health).
- **CapabilityGroup**: A categorization based on the nature of the capability (e.g., Operational, Strategic).
- **BusinessObject**: Entities or artifacts managed or affected by the capability.
- **BusinessAction**: Operations or functions provided by the capability.
- **BusinessEvent**: Meaningful occurrences or state changes emitted by the capability.
- **BusinessRule**: Constraints, policies, or logic that govern the capability's behavior.
- **BusinessRole**: Responsibilities or personas required to interact with or execute the capability.
- **DataRequirement**: Formal definition of inputs and outputs required by the capability.
- **IntegrationRequirement**: External systems or interfaces needed for the capability to function.
- **ComplianceRequirement**: Regulatory or standard compliance needs associated with the capability.
- **ProcessTemplateReference**: Reference to standardized process flows that implement the capability.

## Capability Structure

Every capability in the catalog must follow this structure:

| Field | Description |
|---|---|
| `id` | Unique internal identifier (UUID or stable ID). |
| `key` | Unique kebab-case string for reference (e.g., `manage-work-request`). |
| `name` | Human-readable name of the capability. |
| `description` | Detailed explanation of what the capability provides. |
| `domain` | The domain it belongs to. |
| `group` | The group it belongs to. |
| `version` | Semantic version of the capability definition. |
| `status` | Lifecycle status (draft, active, deprecated, retired). |
| `businessObjects` | List of core entities involved. |
| `businessActions` | List of operations provided. |
| `businessEvents` | List of events emitted. |
| `businessRules` | List of rules and constraints. |
| `roles` | Required roles. |
| `inputs` | Data requirements for input. |
| `outputs` | Data requirements for output. |
| `dependencies` | Other capabilities required by this one. |
| `relatedCapabilities` | Other capabilities that are often used together. |
| `applicableSectors` | Tags indicating sectors where this is commonly applied. |
| `metadata` | Flexible key-value pair for additional information. |

## Modeling Principles

1. **Abstraction**: Capability is NOT a specific implementation, workflow, or UI screen.
2. **Reusability**: Designed to be applicable across different sectors.
3. **Composability**: Capabilities are the building blocks for higher-level Blueprints.
4. **Explicitness**: All dependencies and requirements must be clearly defined.
5. **Declarative**: Focus on *what* is done, not *how* it is coded.
