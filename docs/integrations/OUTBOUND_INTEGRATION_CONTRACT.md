# Outbound Integration Contract

A plataforma comunica para fora usando Padrão Outbox:
1. O domínio de runtime grava um `Outbox Entry` na mesma transação que a mutação principal.
2. Um Worker/Poller lê o `Outbox Entry`.
3. Constrói um payload de saída genérico e seguro.
4. Entrega ao Edge (n8n/Webhooks/API Gateway) e recebe um status.
5. Grava um `Delivery Attempt` e, dependendo do sucesso/falha final, um `Delivery Receipt`.
