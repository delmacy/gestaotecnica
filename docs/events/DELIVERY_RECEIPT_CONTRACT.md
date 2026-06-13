# DELIVERY RECEIPT CONTRACT

Enquanto o `DeliveryAttempt` mapeia o esforço que o nosso sistema fez, o `DeliveryReceipt` mapeia a comprovação oficial atestada pela outra ponta (assíncrona ou síncrona), devolvida para o System Builder.

## Modelo Conceitual (DeliveryReceipt)

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "eventId": "uuid",
  "outboxEntryId": "uuid",
  "deliveryAttemptId": "uuid",
  "destination": "string",
  "receiptType": "string",
  "status": "string",
  "externalReceiptId": "string",
  "receivedAt": "datetime",
  "correlationId": "string",
  "payloadHash": "string",
  "responseMetadataSanitized": "Record<string, unknown>",
  "signatureReference": "string",
  "notes": "string"
}
```

## Receipt Types

- `transport_acceptance`: Receptor (e.g. AWS SQS ou Webhook endpoint) diz "Recebi a mensagem 100%".
- `transport_rejection`: Receptor diz "Erro estrutural/quota na mensagem".
- `destination_acknowledgement`: O destino final diz "Salvei no meu banco".
- `destination_processing_success`: O destino final concluiu processamento do business e avisou com sucesso.
- `destination_processing_failure`: Destino rejeitou falha de regras de negócio.
- `manual_reconciliation`: Um operador atestou o recebimento manualmente (útil em espelhamentos ou falhas de infra).

## Statuses

- `accepted`
- `rejected`
- `acknowledged`
- `processed`
- `processing_failed`
- `expired`
- `unknown`

## Invariantes Estritas

1. **Append-Only Immutable:** O Receipt é irreversível; inserido no registro contábil e não editável.
2. **Separação de Eventos:** O Receipt *não* altera o histórico de vida de um Evento de Domínio (`workflow_events`).
3. **Projeções Futuras:** A inserção do receipt poderá futuramente derivar/atualizar projeções (status) em read models da interface, mas não reescreve a fonte da verdade do passado.
4. **Deduplicação de Recebimentos:** Recebimentos assíncronos duplicados (`externalReceiptId` igual e/ou hash idêntico do mesmo webhook/broker) devem ser absorvidos e deduplicáveis sem causar side effects secundários.
5. **Autenticidade e Signature:** O recibo originado externamente deve ter sua integridade (HMAC, signatureReference) validada pela camada de API externa.
6. **Escopo Analítico:** Obter o Delivery Receipt confirmando recebimento não prova que o workflow inteiro acabou. A comprovação de conclusão sistêmica será mapeada através do canhoto de rastreabilidade final (Traceability Receipt).
