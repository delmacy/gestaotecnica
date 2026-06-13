# Integration As-Is Inventory
Lista os sistemas externos atuais e os pontos de contato antes da plataforma.

## Sistemas Encontrados
- **Gestão Técnica Legacy**: Usa chamadas diretas via Webhooks para instanciar execuções.
- **n8n**: Plataforma de automação atual, conectando chamadas manuais ou sistemas externos para processamento inicial.

## Problemas da Abordagem As-Is
- Não há isolamento entre o "borda" (edge) e a base de dados central.
- Webhooks executam regras de negócio, em vez de atuar como meros gateways.
- Acoplamento estrutural: n8n e Postgres muitas vezes misturam competências.
