# Feature Contract — Fase 31
## 1. Identificação
- Fase: 31
- Nome: n8n Signal Inbox Backend
- Tipo: Backend
- Dependências: Fase 37
- Fase frontend vinculada: Fase 31B
- Status: Planejada refinada

## 2. Objetivo
Endpoint seguro e schema para recepção de sinais do n8n (Signal Inbox).

## 3. Problema que resolve
Permite receber requisições de sistemas externos como n8n via webhook para avaliação.

## 4. Escopo permitido
- `src/app/api/webhooks/n8n/route.ts`
- Novo schema e repository para `signal_inbox`.

## 5. Fora de escopo
- Processamento automático.
- UI visual.

## 6. Entidades e contratos
- Entidade: `signal_inbox`
- Schema/Campos: `id`, `workspace_id`, `source`, `external_event_id`, `idempotency_key`, `status` (pending | processed | ignored | failed), `raw_payload`, `received_at`, `processed_at`, `error_code`, `correlation_id`.
- workspace_id: Obrigatório.

## 7. Estados e transições
- pending -> processed | ignored | failed

## 8. Services, repositories e actions esperados
- Repository: para `signal_inbox`.
- Endpoint `/api/webhooks/n8n` retorna HTTP 202.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- E2E webhook.
- Unit testes.

## 11. Frontend impact
- Gap frontend pendente: Fase 31B vai cobrir a exibição.

## 12. Critérios de aceite
- Retorna 202; isolado por workspace; valida assinatura; usa idempotency_key.

## 13. Regra de parada
Após o webhook registrar com sucesso no banco de dados.

## 14. Prompt para Jules Dev
`Criar endpoint e tabela para o n8n Signal Inbox (Fase 31), com suporte a idempotency_key.`

## 15. Prompt para Jules Tester
`Mandar payload mock para o webhook do n8n e checar o banco.`

## 16. Riscos e decisões
- Decisão: n8n não executa processo automaticamente.
