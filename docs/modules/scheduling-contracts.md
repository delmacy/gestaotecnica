# Scheduling Module Architecture and Contracts

## 1. Domain Definition

The Scheduling module provides a universal framework for temporal resource management. It is designed to be domain-agnostic, supporting any operational context that requires binding resources (technicians, teams) to subjects (tasks, orders) over time.

### Core Entities

- **Schedule**: A universal time block for a resource (identified by `resourceId`).
- **Allocation**: Links a resource to a `subjectId` (generic reference, e.g., Service Order) within a schedule.
- **Availability/Unavailability**: Tracks resource state over time.
- **Shift Template**: Patterns for recurring availability.

## 2. Event Matrix

| Event Type | Description |
|------------|-------------|
| `schedule.created` | Emitted when a new resource time block is registered. |
| `schedule.updated` | Emitted on shift adjustments. |
| `conflict.detected` | Emitted when policy violations (overlaps, duration) occur. |
| `allocation.confirmed`| Emitted when a resource is successfully bound to a subject. |

## 3. Workforce Integration

Interaction with the Workforce module is handled through a stable interface:

- **Resource Identification**: Uses `technicianProfileId` as the primary identifier.
- **State Synchronization**: Scheduling provides real-time availability signals to Workforce.

## 4. Universal Policies

Constraints such as maximum shift duration and minimum rest periods are implemented as **Configurable Policies** rather than hard-coded constants. This allows different workspaces to apply distinct operational rules.

## 5. Contract Verification

Contracts are enforced via Zod schemas in `src/modules/schedules/contracts.ts`.
Dynamic validation functions are provided to evaluate shifts against active policies.
