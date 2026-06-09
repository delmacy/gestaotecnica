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

## 4. Domínio / DDD
- Bounded Context: Integration Boundary Context
- Ubiquitous Language:
  - Signal Inbox
  - External Signal
  - Idempotency Key
  - Raw Payload
- Aggregate/Entity principal: SignalInbox
- Value Objects:
  - SignalStatus
- Invariantes:
  - N8n não cria Candidates de forma autônoma.
  - Sinais são mantidos em estado bruto (raw_payload) até avaliação.
  - Recebimento de sinais deve ser idempotente.
- Domain/Application Events:
  - Retorna HTTP 202 com recibo de entrega.
- Application Use Case:
  - ReceiveExternalSignalWithIdempotency
- Anti-Corruption Layer:
  - Validação de assinatura/schema básico de entrada.
- Repository Port:
  - SignalInboxRepositoryPort
- Infrastructure Adapter:
  - DrizzleSignalInboxRepository
- Transaction Boundary:
  - Registro do sinal.
- Consistency/Idempotency:
  - idempotency_key única por external_event_id.
- Workspace Scope:
  - workspace_id obrigatório para isolamento.
- Audit/Trace:
  - external_event_id e correlation_id associados.

## 5. Escopo permitido
- `src/app/api/webhooks/n8n/route.ts`
- Novo schema e repository para `signal_inbox`.

## 6. Fora de escopo
- Processamento automático.
- UI visual.

## 7. Entidades e contratos
- Entidade: `signal_inbox`
- Schema/Campos: `id`, `workspace_id`, `source`, `external_event_id`, `idempotency_key`, `status` (pending | processed | ignored | failed), `raw_payload`, `received_at`, `processed_at`, `error_code`, `correlation_id`.
- workspace_id: Obrigatório.

## 8. Estados e transições
- pending -> processed | ignored | failed

## 9. Services, repositories e actions esperados
- Repository: para `signal_inbox`.
- Endpoint `/api/webhooks/n8n` retorna HTTP 202.

## 10. UI esperada
N/A

## 11. Testes obrigatórios
- E2E webhook.
- Unit testes.

## 12. Frontend impact
- Gap frontend pendente: Fase 31B vai cobrir a exibição.

## 13. Critérios de aceite
- Retorna 202; isolado por workspace; valida assinatura; usa idempotency_key.

## 14. Regra de parada
Após o webhook registrar com sucesso no banco de dados.

## 15. Prompt para Jules Dev
`Criar endpoint e tabela para o n8n Signal Inbox (Fase 31), com suporte a idempotency_key.`

## 16. Prompt para Jules Tester
`Mandar payload mock para o webhook do n8n e checar o banco.`

## 17. Riscos e decisões
- Decisão: n8n não executa processo automaticamente.
