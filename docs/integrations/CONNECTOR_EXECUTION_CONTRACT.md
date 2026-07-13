# Connector Execution Contract

## Overview
A **Connector** in the integration boundary is a logical abstraction representing an execution boundary. At this stage, **no real connector is implemented yet.** The contracts defined simply model how an integration execution is structured, retryable, and logged.

## Execution Boundary
- Connectors process normalized requests.
- They do not hold domain business logic.
- They wrap execution in a predictable boundary (e.g., timeout enforcements via `ConnectorRequest`).

## Retry Semantics
- Connectors are subject to a **Retry Policy** (`ConnectorRetryPolicySchema`).
- They define a maximum number of attempts (`maxAttempts`).
- Backoff mechanisms govern delays between retries.
- Retry attempts are strictly constrained by `retryableErrorClasses`.

## Redaction
- Connectors inherently respect payload privacy.
- Fields containing sensitive data can be declared via `redactedFields`.
- These fields are documented and honored in both `ConnectorRequest` and `ConnectorResultEnvelope`.

## Non-Goals
- Implementing real external drivers (e.g., HTTP clients, Stripe/Salesforce API integrations).
- Orchestrating complex saga workflows within the connector execution.
- Managing database state or migrations directly.
