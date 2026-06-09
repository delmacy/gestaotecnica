# Fase 25 — Publish Candidate to Workflow Template

## 1. Identificação

| Campo | Valor |
|---|---|
| Fase | 25 |
| Status | Planejada |
| Tipo | Produto alfa / Blueprint / Módulo |
| Responsável principal | Jules Dev / Jules Documental |
| Revisor | ChatGPT |
| Data de abertura | YYYY-MM-DD |
| Data de aprovação | — |

## 2. Objetivo

Publish Candidate to Workflow Template

## 3. Escopo permitido

- —

## 4. Fora de escopo

- —

## 5. Arquivos planejados

- —

## 6. Critérios de aceite

- —

## 7. Plano aprovado

Referência:
- `docs/planning/alpha/PHASE_25.md`

Resumo:
- —

## 8. Execuções

### Execução 001 — Jules Dev — 2026-06-07

Status: CORRETIVA NECESSÁRIA

Commit base: c364147242a4a58282e906c4a3a8f627bea0b26a

Arquivos criados:
- `src/features/builder/candidates/candidate.publisher.ts`
- `tests/unit/candidate-publisher.test.ts`

Arquivos alterados:
- `src/features/builder/candidates/candidate.errors.ts`

Comandos executados:
- `npm run test:unit`
- `npm test`
- `npm run lint`
- `npm run build`
- `git diff --check`

Resultado do lint:
- Sucesso (0 erros)

Resultado do build:
- Sucesso

Git status:
- Limpo. Todos os testes passam.

Bloqueios:
- **Bloqueio Técnico (Rastreabilidade):** Conforme orientação, não há atualmente um campo canônico apropriado no modelo do `ProcessDefinition` para rastrear o candidate de origem (ex: `sourceId` ou `origin`). Assim, a rastreabilidade foi implementada injetando `sourceCandidateId` na interface `createProcessDefinition` via `createProcessInput`, mas sem modificar o schema. O adapter persistente real exigirá criação de metadata field no schema.
- **Bloqueio Técnico (Atomicidade):** A instrução requer salvar Definition, Version e atualizar Candidate atomicamente. Como operam em repositórios independentes (potencialmente DBs diferentes em tese, mas o mesmo postgres na prática), a interface de injeção expõe `runInTransaction`. A infraestrutura real terá de passar uma transação raw do Drizzle para os múltiplos repositórios.

Observações:
- O Publisher `publishApprovedCandidate` exige injeção da porta de repositório `PublisherRepositoryPort` para operar, não interagindo diretamente com os Drizzle adapters, mas gerenciando toda a política e transições de Candidate.
- Todos os 16 cenários de teste estipulados foram implementados em `tests/unit/candidate-publisher.test.ts`.
- Validação estrita do `proposedDefinition` reutiliza `validateBuilderDraft`.
- Apenas candidatos "approved" podem gerar template; o status é atualizado para "published".

## 9. Revisões

### Revisão 001 — ChatGPT — YYYY-MM-DD

Resultado: Pendente

Observações:
- —

Ressalvas:
- —

Decisão:
- —

## 10. Decisões específicas da fase

- —

## 11. Histórico de correções

- —

### Correção 001 — ChatGPT/Codex — 2026-06-07

Status: Implementada, aguardando nova auditoria do Jules Tester

Motivação:
- Corrigir as descobertas Altas de rastreabilidade não persistida, atomicidade
  não comprovada e proteção concorrente simulada apenas por mocks.

Implementação:
- Adicionado `source_candidate_id` persistente, consultável e único em
  `workflow.process_definitions`. Ele é uma referência externa sem foreign key
  cruzada, respeitando a separação entre os bancos Platform e Runtime.
- Adicionado `created_by_id` para preservar a autoria humana da publicação.
- Criado adapter Drizzle real para publicar Definition, Version e atualizar o
  Candidate dentro da mesma transação.
- A atualização do Candidate exige estado anterior `approved`; falhas ou
  conflitos provocam rollback integral.
- A constraint única de `source_candidate_id` impede publicações concorrentes
  ou repetidas do mesmo Candidate.
- O publisher passou a rejeitar drafts vazios ou estruturalmente incompletos.
- `npm run test:unit` passou a executar todas as suítes unitárias em
  `tests/unit`.

Migration criada, não aplicada:
- `drizzle/0020_phase25_candidate_publication_traceability.sql`

Limite arquitetural:
- O adapter transacional implementado exige que `builder` e `workflow` estejam
  disponíveis na mesma conexão PostgreSQL entregue ao publisher.
- No desenho-alvo com bancos Platform e Runtime separados, a atomicidade total
  permanece bloqueada e exigirá uma estratégia explícita de saga/outbox em fase
  própria. Não há alegação de transação distribuída.
- A integração real tentou usar o `DATABASE_URL` configurado, mas o banco
  apontado não existe no servidor (`3D000`). A migration não foi aplicada.
- Para validar o modo co-localizado, o `DATABASE_URL` de teste deve conter os
  schemas `builder`, `workflow` e `identity`. Para validar bancos separados,
  serão necessárias URLs de teste distintas e uma estratégia de saga/outbox.

Validações:
- `npm run test:unit`
- `npm run build`
- `git diff --check`

### Correção 002 — ChatGPT/Codex — 2026-06-07

Status: Validada com banco real

Configuração:
- Adotado banco unificado `tec_db` para desenvolvimento e testes.
- `DATABASE_URL`, `PLATFORM_DATABASE_URL` e `RUNTIME_DATABASE_URL` locais
  apontam para o mesmo banco.
- Criado preparador idempotente `npm run db:setup:unified-test`.

Banco:
- Criado schema `builder` e tabela `builder.process_candidates`.
- Aplicadas colunas de rastreabilidade/autoria em
  `workflow.process_definitions`.
- Reconciliados os drifts `workspace.workspaces.metadata` e
  `workflow.process_versions.updated_at`.
- Criada migration `0021_unified_tec_db_reconciliation.sql`.

Teste real:
- Criado `tests/integration/candidate-publisher.integration.test.ts`.
- O teste cria workspace, usuário e Candidate isolados; publica usando o
  adapter Drizzle real; valida rastreabilidade, autoria, versão, status e
  idempotência; depois remove todos os dados criados.

Validações:
- `npm run db:setup:unified-test`
- `npm run test:integration` — aprovado contra `tec_db`

### Revisão 002 — Jules Tester — 2026-06-07

Resultado: CORRETIVA NECESSÁRIA

Observações:
- O gate da implementação primária comprovou regras de estado e payload, mas
  não comprovou rastreabilidade, atomicidade ou concorrência no banco real.
- Testes unitários com asserções incorretas foram corrigidos durante a
  auditoria.

Ressalvas:
- Rastreabilidade ainda não persistida na implementação primária.
- Transação e proteção concorrente simuladas somente em memória.

Decisão:
- Abrir corretiva da Fase 25 conforme
  `docs/40-operations/reports/PHASE_25_TEST_GATE_REPORT.md`.

Observação posterior:
- As descobertas desta revisão motivaram as Correções 001 e 002 registradas
  acima, incluindo adapter Drizzle, migrations e teste de integração real.
