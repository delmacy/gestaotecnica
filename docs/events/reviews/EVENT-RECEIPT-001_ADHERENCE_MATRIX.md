# EVENT RECEIPT ADHERENCE MATRIX

Matriz comparando o que o código atual implementa frente ao contrato estabelecido.

| contract_item | schema_evidence | type_evidence | repository_evidence | service_evidence | gateway_evidence | status | severity | required_action | future_task |
|---|---|---|---|---|---|---|---|---|---|
| Occurrence | N/A | N/A | N/A | Implicit in logic | N/A | Non-Compliant | Medium | Explicit isolation | ER-FIX-C |
| Domain Event Envelope | `workflow_events` exists but misses fields | `events.types.ts` is simple and lacks canonical versioning | Append only repository inserts | `logEvent` call | N/A | Non-Compliant | High | Add schema version, trace constraints | ER-FIX-A |
| Persisted Event Record | Maps to `workflow_events` | `EventRecord` | Exists via simple insert | Out of boundary tx | N/A | Non-Compliant | Critical | Must be moved inside unit-of-work tx | ER-FIX-C |
| Outbox Entry | `workflow_outbox_events` exists | `OutboxRecord` | Inserts exist but without lock handling | Enqueues loosely | N/A | Non-Compliant | High | Define attempts, concurrency lock | ER-FIX-D |
| Delivery Attempt | Null | Null | Null | Null | Null | Missing | Medium | Create tracking model | ER-FIX-F |
| Delivery Receipt | Null | Null | Null | Null | Null | Missing | High | Create receipt table | ER-FIX-G |
| Consumer Processing Receipt | Null | Null | Null | Null | Null | Missing | Medium | Create inbox model | ER-FIX-H |
| Traceability Receipt | Null | Null | Null | Null | Null | Missing | High | Create traceability table | ER-FIX-I |
| Gateway Receipt Boundary | N/A | N/A | N/A | N/A | Readonly UI in place | Compliant | Low | Keep independent | N/A |
| Idempotency Deduplication | Null | Null | Null | Null | Preserves IdempotencyKey | Missing | Critical | Add safe retry blocks | ER-FIX-E |
| Security/Sanitization | No fields/policies | `Record<string, any>` unchecked | Dumps all payloads | Dumps all payloads | Filters some data | Non-Compliant | High | Implement deep redaction utility | ER-FIX-J |
| Transactions | Null | Null | Promise.all used | Awaited sequential | Null | Non-Compliant | Critical | Re-architect with `db.transaction()` | ER-FIX-C |
