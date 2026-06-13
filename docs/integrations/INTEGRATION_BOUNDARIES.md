# Integration Boundaries

- **Inbound Boundary:** Onde os sistemas externos (via API Gateway ou webhook/n8n) depositam dados no nosso sistema. Deve resultar puramente na criação de um `Event` normalizado (via gateway receipt).
- **Outbound Boundary:** O sistema produz eventos de mudança de estado, gerando `Outbox Entries`. Um poller/worker lê a Outbox e usa um adaptador (n8n/webhook genérico) para fazer a entrega externa, gerando os devidos `Delivery Receipts`.
