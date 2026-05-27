# Outbox

O outbox inicial persiste cada evento em `outbox_events` antes de disparar os
flows.

Fluxo atual:

1. `event_logs`
2. `outbox_events`
3. `processFlowOutboxEvent`
4. `flow_runner`
5. `flow_runs` e `flow_action_runs`

Nesta fase o processamento ainda ocorre no mesmo request para preservar a
experiencia simples de desenvolvimento. A proxima evolucao natural e mover
`processFlowOutboxEvent` para um worker com retries, backoff e entregas externas.
