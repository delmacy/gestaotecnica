# Webhook Canonical Contract

## Regras
- Um Webhook é apenas um adaptador de Inbound.
- Nunca altera o banco diretamente (além de gravar Receipts/Eventos Canônicos).
- Falhas de parseamento JSON ou segurança resultam em HTTP 4xx imediato.
- O Webhook deve sempre responder o mais rápido possível e processar a lógica assincronamente via o Runtime Engine.
