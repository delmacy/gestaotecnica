# Integration Retry & Reconciliation Contract

- Mensagens na Outbox terão configuração de retries (backoff exponencial).
- Falhas persistentes mudam o `Outbox Entry` para `dead_letter` ou `failed_terminal`.
- A reconciliação pode ser feita re-enviando manualmente ou acionando scripts dedicados para repassar mensagens falhas.
