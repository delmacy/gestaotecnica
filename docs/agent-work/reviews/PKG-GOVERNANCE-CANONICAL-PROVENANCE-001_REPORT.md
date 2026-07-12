# Report: Canonical Provenance Contract Selection

## Executive Summary
This package formalizes the selection of the canonical provenance contract within the platform's governance ecosystem based on the audit of existing inventory and governance concepts.

## Contract Choice
The canonical provenance contract is identified as **`TraceReceipt`** (`TraceReceiptSchema`).

While the `ApprovalDecision` contract captures the "Semantic Act" of an approval decision, the `TraceReceipt` serves as the technical evidence carrier (the provenance) that permanently records the occurrence of the action.

## Canonical Fields of TraceReceipt
- **`id`**: Unique identifier for the receipt.
- **`workspaceId`**: The workspace context for multi-tenant isolation.
- **`subject`**: The target of the action (`type`, `id`, `category`).
- **`actor`**: The initiator of the action (`type`, `id`, `name`).
- **`action`**: The operation performed (`type`, `name`, `description`, `result`).
- **`timestamp`**: ISO 8601 timestamp of when the action occurred.
- **`source`**: The originating system/environment.
- **`artifacts`**: Digital evidence links (URIs, hashes).
- **`hashes`**: Integrity verification blocks (sha256/sha512).
- **`correlationId`**: Groups related events across the system.
- **`previousReceiptId`**: For forming immutable chains.
- **`causationId`**: The trigger event for this action.
