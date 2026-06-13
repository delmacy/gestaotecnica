# Integration Canonical Contract

## Regra de Ouro
**n8n é borda. Postgres é Source of Truth.**

## Princípios de Design
- O runtime não conhece protocolos externos (HTTP, gRPC, etc.).
- O módulo de integração atua estritamente como **Gateway**.
- Recebe, autentica, sanitiza, converte para Canonical Event/Command, e repassa ao domínio.
- Nunca executa regras de negócio.
- O Outbox não conhece os adaptadores específicos para a qual a mensagem é enviada (ex.: n8n, Stripe, etc.), ele lida apenas com `Delivery Attempt` e `Outbox Entry`.
