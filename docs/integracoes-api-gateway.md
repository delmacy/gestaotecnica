# API Gateway e Plugins de Integracao

## Objetivo

A plataforma expoe os modulos por um gateway de API para permitir uso externo por plugins, automacoes, sistemas oficiais, conectores n8n, RPA, frontends alternativos e providers especializados.

## Autenticacao

Defina `GESTAOTECNICA_API_KEY` no ambiente.

Clientes externos devem enviar:

```http
x-gestaotecnica-api-key: <token>
```

ou:

```http
authorization: Bearer <token>
```

Se a variavel nao estiver configurada, o gateway permite chamadas para facilitar desenvolvimento local.

## Endpoints

### Listar modulos expostos

`GET /api/gateway/modules`

### Ler dados de um modulo

`GET /api/gateway/modules/:moduleKey`

Exemplos:

- `/api/gateway/modules/work-items`
- `/api/gateway/modules/service-orders`
- `/api/gateway/modules/assets`
- `/api/gateway/modules/workforce`
- `/api/gateway/modules/reports`
- `/api/gateway/modules/legacy`
- `/api/gateway/modules/automations`

### Packs contextuais

`GET /api/gateway/packs`

### Webhook inbound

`POST /api/gateway/webhooks`

```json
{
  "pluginKey": "n8n-cliente",
  "eventType": "external.ticket.created",
  "targetModule": "work-items",
  "source": "n8n",
  "payload": {}
}
```

### Gateway PDF

`POST /api/gateway/pdf`

```json
{
  "provider": "external-pdf-service",
  "templateKey": "service_order_summary",
  "reportId": "uuid-opcional",
  "title": "Resumo de OS",
  "callbackUrl": "https://cliente.exemplo/callback",
  "payload": {}
}
```

O PDF interno continua sendo modulo do sistema, mas o contrato permite que o cliente substitua por provider externo, como acontece com legado/sistema oficial.

## Principio

Todo modulo deve poder virar uma capacidade consumida por API. A UI e apenas um consumidor nativo; plugins externos devem conseguir ler eventos, pedir geracao, sincronizar dados e executar extensoes governadas.
