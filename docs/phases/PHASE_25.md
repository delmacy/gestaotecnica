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