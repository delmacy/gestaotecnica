# Architecture: System Builder Operations Control Plane

## Overview

The `system-builder-operations` repository serves as the centralized engineering governance and CI/CD control plane for the System Builder ecosystem. It decouples governance, policies, and operational workflows from the product's functional code.

## Core Components

- **Reusable Workflows**: Standardized CI/CD processes for both the platform core and client instances.
- **JSON Schemas**: Formal contracts for manifests (Client, Release) and operational records (Receipts, Heartbeats).
- **Policies**: Declarative rules for branches, releases, and deployments.
- **Orchestration**: Tools for managing releases and synchronizing engineering state with GitHub Projects.

## Principles

1. **Governance Separation**: Product code in `delmacy/gestaotecnica` (or similar), operations here.
2. **Contract-Driven**: All inter-system communication relies on versioned JSON schemas.
3. **Traceability**: Every mutation (deploy, release) generates a signed receipt.
4. **Approval Gates**: Production changes require explicit human intervention.
