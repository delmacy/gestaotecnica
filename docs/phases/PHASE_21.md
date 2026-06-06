# Relatório de Execução — Fase 21

## Objetivo
Implementar a fundação da Ontologia de Process Candidates (tipos e schemas).

## Arquivos Alterados / Criados
- `src/features/builder/candidates/candidate.types.ts`: Criada a tipagem do core domain `ProcessCandidateRecord` refletindo origin, status e o campo `evidence` que será usado pelos Agentes.
- `src/features/builder/candidates/candidate.validation.ts`: Criados os validadores baseados nos Enums definidos na documentação de governança (`draft, under_analysis, waiting_review, approved, rejected, published`).
- `src/features/builder/candidates/index.ts`: Exportações limpas da ontologia.

## Validações
O TypeScript compilou sem erros e a estruturação restringe `proposedDefinition` e `evidence` a `Record<string, unknown>`, impedindo vazamento da keyword `any`.
