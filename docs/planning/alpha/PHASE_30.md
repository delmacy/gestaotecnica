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

## 4. Escopo permitido
- Schema do Drizzle.
- Repositório e Service do Agent Gateway.

## 5. Fora de escopo
- Interface visual.

## 6. Entidades e contratos
- Nova entidade: `builder.agent_gateway_submissions` (ou genérica `trace_receipts`).
- Campos: `correlation_id`, `idempotency_key`, `request_status`, `candidate_id`, `sanitized_payload`, `source`, `received_at`, `processed_at`, `error_code`.

## 7. Estados e transições
- Status: pending, success, failed.

## 8. Services, repositories e actions esperados
- Função no service que verifica idempotência antes de processar.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Integration: Testar que o mesmo idempotency_key não gera dois candidatos.

## 11. Frontend impact
- Gap frontend pendente: A ser coberto na Fase 30B.

## 12. Critérios de aceite
- Tabela criada e endpoint do gateway registrando metadados.

## 13. Regra de parada
Após a migração e os testes do serviço passarem.

## 14. Prompt para Jules Dev
`Implementar a Fase 30. Criar a entidade para guardar metadados do Gateway (idempotency, correlation) e implementar a lógica no Agent Gateway Service. Siga docs/planning/alpha/PHASE_30.md.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Entidade específica será usada no Alpha para submissions, facilitando a visualização.
