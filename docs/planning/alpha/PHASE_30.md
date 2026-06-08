# Feature Contract — Fase 30

## 1. Identificação
- Fase: 30
- Nome: Gateway Metadata, Correlation ID, Idempotency
- Tipo: Backend
- Dependências: Fase 29
- Fase frontend vinculada: Fase 30B
- Status: Planejada refinada

## 2. Objetivo
Definir contrato de persistência para metadados de requisições de agentes (correlation_id, idempotency_key, receipts).

## 3. Problema que resolve
Rastreabilidade, segurança e prevenção de duplicidade (idempotência) para chamadas automatizadas.

## 4. Domínio / DDD
- Bounded Context: Agent Gateway Context
- Ubiquitous Language:
  - Agent Gateway Submission
  - Gateway Receipt
  - Correlation ID
  - Idempotency Key
  - Sanitized Payload
- Aggregate/Entity principal: AgentGatewaySubmission
- Value Objects:
  - CorrelationId
  - IdempotencyKey
  - GatewaySubmissionStatus
- Invariantes:
  - mesma idempotency_key não gera dois Process Candidates;
  - payload externo deve ser sanitizado antes de persistir;
  - x-agent-key nunca é persistida;
  - agente não controla status do Candidate;
  - agente não publica workflow.
- Domain/Application Events:
  - AgentSubmissionReceived
  - AgentSubmissionAccepted
  - AgentSubmissionFailed
  - AgentSubmissionDuplicated
- Application Use Case:
  - RegisterAgentSubmissionWithIdempotency
- Anti-Corruption Layer:
  - agent-payload.mapper.ts
  - sanitizeAgentPayloadForStorage
- Repository Port:
  - AgentGatewaySubmissionRepositoryPort
- Infrastructure Adapter:
  - DrizzleAgentGatewaySubmissionRepository
- Transaction Boundary:
  - registrar submission + criar candidate + marcar success deve ser consistente.
- Consistency/Idempotency:
  - idempotency_key única.
- Workspace Scope:
  - workspace_id quando payload validado.
- Audit/Trace:
  - receipt retornado na API e submission persistida.

## 5. Escopo permitido
- Schema do Drizzle.
- Repositório e Service do Agent Gateway.

## 6. Fora de escopo
- Interface visual.

## 7. Entidades e contratos
- Nova entidade: `builder.agent_gateway_submissions` (ou genérica `trace_receipts`).
- Campos: `correlation_id`, `idempotency_key`, `request_status`, `candidate_id`, `sanitized_payload`, `source`, `received_at`, `processed_at`, `error_code`.

## 8. Estados e transições
- Status: pending, success, failed.

## 9. Services, repositories e actions esperados
- Função no service que verifica idempotência antes de processar.

## 10. UI esperada
N/A

## 11. Testes obrigatórios
- Integration: Testar que o mesmo idempotency_key não gera dois candidatos.

## 12. Frontend impact
- Gap frontend pendente: A ser coberto na Fase 30B.

## 13. Critérios de aceite
- Tabela criada e endpoint do gateway registrando metadados.

## 14. Regra de parada
Após a migração e os testes do serviço passarem.

## 15. Prompt para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 30 — Gateway Metadata, Correlation ID, Idempotency

Implemente a Fase 30.
- Não implemente uma integração real com Paperclip.
- Crie a entidade AgentGatewaySubmission.
- Crie o use case RegisterAgentSubmissionWithIdempotency.
- Crie repository port e adapter Drizzle (se compatível com padrão).
- Sanitize o payload recebido e não persista chaves como x-agent-key.
- Preserve as invariantes (ex: mesma idempotency_key não gera dois candidatos).
- Crie testes de idempotência.
- Retorne um receipt mínimo.
- Não crie UI.
```

## 16. Prompt para Jules Tester
```text
Fase 30
Execute testes garantindo:
- Invariantes preservadas.
- Idempotência validada.
- Sanitização de payload sem vazamento de segredos.
- Boundary de transação funcional.
- Ausência de chamadas reais a Paperclip/LLM/n8n.
- Ausência de UI correspondente (que ficará na 30B).
- Documentação append-only mantida.
```

## 17. Riscos e decisões
- Entidade específica será usada no Alpha para submissions, facilitando a visualização.
