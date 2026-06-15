# Capability Composition Rules

This document outlines the rules for relating and composing capabilities into complex systems.

## Composition Principles

1. **Explicit Dependencies**: If Capability A cannot function without Capability B, B must be listed in A's `dependencies`.
2. **Loosely Coupled Relations**: Use `relatedCapabilities` for capabilities that are often used together but are not strictly required for basic functionality.
3. **No Circular Dependencies**: Direct or indirect circular dependencies between capabilities are strictly prohibited.
4. **Versioning Integrity**: A capability version should only depend on compatible versions of other capabilities.
5. **Granularity**: Capabilities should be granular enough to be reusable but substantial enough to provide clear business value.

## Relationship Types

### Dependency (`dependencies`)
A "Hard" link. Indicates that the source capability utilizes the logic, data, or objects of the target capability.
- *Example*: `schedule-resource` depends on `manage-work-request`.

### Relation (`relatedCapabilities`)
A "Soft" link. Indicates a common association in business processes or blueprints.
- *Example*: `manage-customer` is related to `issue-invoice`.

## Blueprint Composition

Capabilities are composed into **Blueprints** to define sector-specific or client-specific solutions.

- **Capability Selection**: Choosing a set of capabilities from the catalog.
- **Contract Fulfillment**: Ensuring all mandatory `dependencies` of selected capabilities are included.
- **Workflow Mapping**: Mapping the `BusinessActions` and `BusinessEvents` to specific process steps.
- **Role Assignment**: Mapping `BusinessRoles` to actual organizational roles.

## Validation Rules

- **Deterministic Catalog**: The catalog must be representable as a Directed Acyclic Graph (DAG) regarding dependencies.
- **Completeness**: Every capability must have at least one `BusinessObject` and one `BusinessAction`.
- **Key Uniqueness**: Keys must be globally unique within the catalog.
