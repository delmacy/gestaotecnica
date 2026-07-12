# Canonical Provenance Contract

Based on the audit of inventory and governance concepts, the canonical provenance contract is the **`TraceReceipt`** (`TraceReceiptSchema`).

The `ApprovalDecision` contract captures the "Semantic Act" of approval (the intent), while the `TraceReceipt` acts as the technical evidence carrier (the provenance).

## Canonical Fields of TraceReceipt:

- `id`: Unique identifier for the receipt.
- `workspaceId`: Workspace context.
- `subject`: The entity the action was performed on (`type`, `id`, `category`).
- `actor`: The entity that performed the action (`type`, `id`, `name`).
- `action`: What was done (`type`, `name`, `description`, `result`).
- `timestamp`: When it occurred.
- `source`: The system/environment originating the action.
- `artifacts`: Any linked digital evidence (URIs, hashes).
- `hashes`: Technical integrity verification (sha256, sha512).
- `correlationId`: For grouping related events.
- `previousReceiptId`: Chain linkage.
- `causationId`: The event that triggered this action.
