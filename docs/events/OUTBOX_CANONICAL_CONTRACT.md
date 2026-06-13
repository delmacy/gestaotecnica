# OUTBOX CANONICAL CONTRACT

Define os limites e o estado futuro do Transactional Outbox pattern dentro do sistema.

## Entidade Conceitual (OutboxEntry)

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "eventId": "uuid",
  "topic": "string",
  "destinationKey": "string",
  "payload": "Record<string, unknown>",
  "headers": "Record<string, string>",
  "status": "string",
  "attempts": "integer",
  "maxAttempts": "integer",
  "nextAttemptAt": "datetime",
  "lockedAt": "datetime",
  "lockOwner": "string",
  "lastErrorCode": "string",
  "lastErrorMessage": "string",
  "createdAt": "datetime",
  "processedAt": "datetime",
  "deadLetteredAt": "datetime"
}
```

## Statuses Permitidos

- `pending`: Aguardando processamento inicial.
- `processing`: Atualmente bloqueado e processando (via lockOwner).
- `delivered`: Entregue com sucesso ao destino ou message broker (transporte).
- `failed`: Falha transitória (será feito retry).
- `retry_scheduled`: Programado explicitamente para um próximo slot de retry.
- `dead_lettered`: Falhas máximas excedidas ou falha não recuperável de transporte.
- `cancelled`: Envio manualmente forçado para ser cancelado antes de despachar.

## Invariantes Estritas

1. **Transaction Boundary:** O registro `OutboxEntry` **DEVE** ser persistido na *mesma* transação de banco de dados do evento de domínio (`Persisted Event Record`) que o gerou.
2. **Separação de Entidade:** Uma outbox entry *não* é o evento original. Ela representa o 'intent de dispatch'.
3. **Payload Duplicado:** Outboxes mantêm cópias congeladas do payload, sujeitas a desvios (drift) caso sejam modificadas externamente ao invés de reenviadas, portanto uma estratégia contra drift ou references strictas (onde possível e seguro) deve ser considerada caso o payload seja extremamente largo.
4. **Referência Direta:** Toda entrada outbox precisa obrigatoriamente referenciar o `eventId` que a causou.
5. **Idempotência do Dispatcher:** O futuro Dispatcher (worker cron/pull/push) deverá ser tolerante a dispatch duplicado (at-least-once) se o próprio outbox falhar na etapa de commit pós envio.
6. **Concurrency Claim:** O processador deve utilizar `lockedAt` e `lockOwner` (e.g. `SELECT FOR UPDATE SKIP LOCKED` ou similar) garantindo que claims sejam concorrentes, atômicos e seguros.
7. **Falhas Permantes:** Extrapolar `maxAttempts` transforma a mensagem num dead letter lógico (gravando `deadLetteredAt`), sem deletar fisicamente o registro.
8. **Validação de Entrega:** Nenhuma mensagem deve ser considerada como concluída em todo o sistema simplesmente porque obteve status `"processedAt"` no Outbox; a validação ocorre apenas via Receipts.
9. **No Implementation:** O Outbox Processor, workers, dispatchers e a modificação de migration destas tabelas não são implementadas nesta fase.
