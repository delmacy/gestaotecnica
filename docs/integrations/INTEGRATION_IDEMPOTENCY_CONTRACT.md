# Integration Idempotency Contract

- Todas as chamadas inbound que geram Comandos/Eventos devem prover uma `idempotency_key` (ex: header `x-idempotency-key` ou injetado via hash).
- O sistema deve usar at-least-once delivery; logo, deduplicação ocorre do lado de quem consome, usando a chave de idempotência.
