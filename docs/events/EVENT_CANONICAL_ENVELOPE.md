# CANONICAL EVENT ENVELOPE CONTRACT

Define a estrutura canônica para todos os eventos de domínio dentro do System Builder, servindo como base estruturada para publicação e envio de mensagens e inspirado (porém sem dependência direta nesta fase) pelo modelo CloudEvents.

## Envelope Definition

```json
{
  "id": "uuid",
  "specVersion": "string",
  "type": "string",
  "source": "string",
  "subject": "string",
  "time": "datetime",
  "workspaceId": "uuid",
  "instanceId": "uuid",
  "aggregateType": "string",
  "aggregateId": "string",
  "entityType": "string",
  "entityId": "string",
  "actorType": "string",
  "actorId": "string",
  "correlationId": "string",
  "causationId": "string",
  "traceParent": "string",
  "traceState": "string",
  "schemaVersion": "string",
  "dataContentType": "string",
  "dataSchema": "string",
  "data": "Record<string, unknown>",
  "sensitivity": "string",
  "redactionPolicy": "string",
  "sequence": "integer",
  "createdAt": "datetime"
}
```

## Mandatory Contract Rules

1. **Identity & Deduplication:** O campo `id` deve identificar unicamente o evento e a composição `"source" + "id"` formará futuramente a chave principal de deduplicação canônica.
2. **Tenancy:** O campo `workspaceId` é estritamente obrigatório em todos os eventos internos multi-tenant para garantir isolamento seguro.
3. **Typing Strategy:** O `type` deve utilizar taxonomia estruturada e canônica (ver EVENT_TYPE_TAXONOMY.md).
4. **Time Boundaries:**
    - `time` representa o exato milissegundo de *ocorrência* no domínio.
    - `createdAt` representa a *persistência* do evento (geralmente gerado na camada de infra/DB).
5. **Causalidade & Agrupamento:**
    - `correlationId` agrupa toda uma cadeia de eventos (originária do Gateway, comando inicial ou schedule).
    - `causationId` aponta estritamente para o ID do comando ou evento imediatamente anterior causador.
6. **Observability (Futuro):** `traceParent` e `traceState` reservam espaço opcional futuro (W3C Trace Context).
7. **Payload Constraints:**
    - O formato do campo `data` deve ser de propriedades genéricas dinâmicas: `Record<string, unknown>`.
    - Sob hipótese alguma dados de segredos, senhas ou tokens completos poderão ser persistidos ou transmitidos no envelope.
8. **Compliance/Security (Futuro):** Qualquer payload classificado como contendo PII deverá explicitar no campo `redactionPolicy` qual técnica de supressão deve ser usada antes de exportação.
9. **Imutabilidade:** O evento e seu envelope são irreversíveis e imutáveis após a primeira persistência. Atualizações (updates destrutivos) são proibidas.

> Nota Técnica (Anti-Tension): Esta documentação declara o estado de destino (TO-BE). Não implemente `specVersion`, `traceParent` ou instale bibliotecas CloudEvents. Nenhuma alteração real no schema `workflow.ts` está sendo feita nesta fase.
