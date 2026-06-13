# DELIVERY ATTEMPT CONTRACT

O registro de `DeliveryAttempt` serve para mapear individualmente cada disparo que o sistema faz a partir de um Outbox Entry, suportando a visualização exata do que aconteceu no transporte.

## Modelo de Entidade

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "outboxEntryId": "uuid",
  "eventId": "uuid",
  "attemptNumber": "integer",
  "destination": "string",
  "protocol": "string",
  "startedAt": "datetime",
  "finishedAt": "datetime",
  "status": "string",
  "responseCode": "string",
  "externalMessageId": "string",
  "errorCode": "string",
  "errorMessage": "string",
  "requestHash": "string",
  "responseHash": "string",
  "responseMetadataSanitized": "Record<string, unknown>"
}
```

## Statuses Permitidos

- `started`: Tentativa iniciada e bloqueada em rede.
- `accepted`: Destino (Broker, Webhook endpoint) aceitou o HTTP 2xx/ACK.
- `rejected`: Destino devolveu HTTP 4xx (Bad Request, Unauthorized, etc).
- `timed_out`: Gateway ou conexão deram timeout.
- `transport_failed`: Erro resolutivo (DNS, SSL, conexão recusada) ou HTTP 5xx contínuo.
- `unknown`: Processador foi abortado ou morreu antes de reportar.

## Invariantes Estritas

1. **Imutabilidade Absoluta:** O registro de tentativa (uma vez concluído com `finishedAt`) é append-only. Repetir transporte resulta em criar uma **nova** `DeliveryAttempt`.
2. **Dependência Hierárquica:** A tentativa não flutua. Pertence unicamente a uma `outboxEntryId`.
3. **Receipt Independente:** A tentativa *NÃO* substitui um `DeliveryReceipt` (embora um "accepted" indique aceitação básica de transporte).
4. **Sem Segredos:** Headers como autorizações (Basic, Bearer, Tokens) jamais devem ser logados neste registro. O `requestHash` poderá atestar segurança opaca.
5. **Sanitização Obrigatória:** Apenas metadados estritamente não PII podem ser serializados em `responseMetadataSanitized`. payloads sensíveis que vazam via erro externo devem ser truncados ou sanitizados (`errorMessage` truncado para evitar injeções).
