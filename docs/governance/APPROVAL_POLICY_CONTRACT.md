# Approval Policy Contract (PKG-APPROVAL-POLICY-CONTRACT-001)

## Overview

The `ApprovalPolicy` contract defines the requirements and scope for asset version approvals within the platform's governance module. It specifies which operations on which assets require approval and what the criteria for such approval are.

## Contract Structure

### ApprovalPolicy

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `EntityId` | Unique identifier for the policy. |
| `workspaceId` | `WorkspaceId` | UUID of the workspace this policy belongs to. |
| `key` | `string` | Kebab-case unique key for referencing the policy. |
| `name` | `string` | Human-readable name. |
| `description` | `string?` | Optional detailed description. |
| `status` | `Enum` | `draft`, `active`, `archived`. |
| `scope` | `Object` | Defines `subjectTypes` and `operations`. |
| `requirement` | `Object` | Defines `mode`, `minimumApprovals`, and `approverRoles`. |
| `createdAt` | `ISODateTime` | Creation timestamp. |
| `updatedAt` | `ISODateTime` | Last update timestamp. |
| `metadata` | `Record?` | Optional additional metadata. |

### Requirement Modes

- **none**: No approval required. `minimumApprovals` must be absent.
- **single**: Exactly one approval required. `minimumApprovals` can be 1 or absent.
- **quorum**: A specific number of approvals required. `minimumApprovals` is mandatory and must be >= 1.
- **unanimous**: All designated roles must approve. `minimumApprovals` must be absent.

### Relationship with ApprovalDecision

- **ApprovalPolicy**: Defines the **requirement** (the "rule").
- **ApprovalDecision**: Records an **instance** of a decision (the "fact").
- A policy does not contain decisions.
- An `ApprovalDecision` may reference a `policyId` to indicate which requirement it was intended to satisfy.
- Satisfaction of a policy requirement must be evaluated by a separate policy evaluator.

## Governed Operations

- `publish`
- `archive`

## Governed Subject Types

- `process_version`
- `form_definition`
- `utility_app_definition`
