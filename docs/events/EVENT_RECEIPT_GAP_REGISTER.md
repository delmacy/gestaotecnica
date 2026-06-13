# EVENT RECEIPT GAP REGISTER

Inventário das deficiências (Gaps) mapeadas na auditoria do atual mecanismo de eventos (`workflow.events`) e persistência. Classificados obrigatoriamente e designados para plano de ação futuro.

| Gap ID | Descrição do Gap | Classificação | Ação Requerida |
|---|---|---|---|
| GAP-EV-001 | Somente quatro event types atuais (faltam as demais taxonomias). | medium | must_fix_before_external_integration |
| GAP-EV-002 | `source` opcional no log. | high | must_fix_before_event_dispatch |
| GAP-EV-003 | `correlationId` opcional no log. | high | must_fix_before_event_dispatch |
| GAP-EV-004 | `causationId` opcional no log. | medium | may_fix_after_contracts |
| GAP-EV-005 | Ausência de event schema version. | medium | must_fix_before_external_integration |
| GAP-EV-006 | Ausência de event subject. | low | may_fix_after_contracts |
| GAP-EV-007 | Ausência de data content type. | low | may_fix_after_contracts |
| GAP-EV-008 | Ausência de data schema explícito. | low | may_fix_after_contracts |
| GAP-EV-009 | Ausência de sensitivity classification para payload. | high | must_fix_before_external_integration |
| GAP-EV-010 | Ausência de redaction policy. | high | must_fix_before_external_integration |
| GAP-EV-011 | Ausência de event sequence por aggregate/instância. | medium | future |
| GAP-EV-012 | EventDb baseado fortemente em schema `any`. | critical | must_fix_before_runtime_execution |
| GAP-EV-013 | Casts `as any` dentro do events repository. | critical | must_fix_before_runtime_execution |
| GAP-EV-014 | Evento e outbox gerados *fora* da transação da mudança de domínio. | critical | must_fix_before_runtime_execution |
| GAP-EV-015 | Outbox payload potencialmente duplicado na base (drift risk). | medium | may_fix_after_contracts |
| GAP-EV-016 | Ausência de destination key explícito no Outbox. | high | must_fix_before_event_dispatch |
| GAP-EV-017 | Ausência do campo `nextAttemptAt` no Outbox. | high | must_fix_before_event_dispatch |
| GAP-EV-018 | Ausência de strategy locks concorrentes (`lockedAt`, `lockOwner`). | critical | must_fix_before_event_dispatch |
| GAP-EV-019 | Ausência de controle com `maxAttempts` na modelagem outbox. | high | must_fix_before_event_dispatch |
| GAP-EV-020 | Ausência de `deadLetteredAt` e pipeline DLQ. | high | must_fix_before_event_dispatch |
| GAP-EV-021 | Ausência de `DeliveryAttempt` tracking entities persistidas. | medium | must_fix_before_external_integration |
| GAP-EV-022 | Ausência de `DeliveryReceipt` table e API capture. | high | must_fix_before_external_integration |
| GAP-EV-023 | Ausência de `ConsumerReceipt` logic/table. | medium | future |
| GAP-EV-024 | Ausência total de Inbox model & deduplication strategy local. | medium | future |
| GAP-EV-025 | Ausência de Dispatcher component/worker em background. | critical | must_fix_before_runtime_execution |
| GAP-EV-026 | Ausência de Worker system genérico para puxar a fila. | critical | must_fix_before_runtime_execution |
| GAP-EV-027 | Ausência de mecanismo/código retry and backoff real. | high | must_fix_before_event_dispatch |
| GAP-EV-028 | Ausência de event strict ordering guarantees (depende do createdAt simples atualmente). | medium | future |
| GAP-EV-029 | Ausência de Retention policy implementada na DB de logs. | low | future |
| GAP-EV-030 | Ausência de Payload size cap/policy implementada. | low | future |
| GAP-EV-031 | Ausência de W3C Trace context fields (`traceParent`). | informational | future |
| GAP-EV-032 | Risco alto: Gateway Receipt confundível via naming conventions com Runtime Receipt. | medium | must_fix_before_external_integration |
| GAP-EV-033 | Ausência do canhoto de rastreabilidade (TraceabilityReceipt) de finalidade audível. | high | must_fix_before_external_integration |
| GAP-EV-034 | Ausência completa de Integration Tests cobrindo fluxos de receipts. | high | must_fix_before_runtime_execution |
| GAP-EV-035 | Ausência de Transaction Rollback Test garantindo que logs não orfanam. | critical | must_fix_before_runtime_execution |
| GAP-EV-036 | Ausência de Duplicate Delivery Test simulando repetições. | high | must_fix_before_event_dispatch |
