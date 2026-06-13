# Integration Security Contract

## Payload Security
- É terminantemente proibido gravar chaves de API, senhas, OAuth tokens, raw JWTs e outros secrets no envelope (`data`) de Eventos, Outbox Entries ou Receipts.
- Módulos de integração devem implementar sanitizadores (ex.: mascarar chaves `authorization` ou `password`) antes da gravação de qualquer log de integração.
