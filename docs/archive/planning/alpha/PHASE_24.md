# Fase 24 — Human Review and Governance

## Objetivo
Estabelecer a camada de regras (Service) para transição de status e aprovação humana.

## Contexto
Garantir a regra inviolável: 'Agente propõe, humano aprova'. Apenas um ator humano válido pode alterar o status para 'approved'.

## Arquivos permitidos
- `src/features/builder/candidates/candidate.service.ts`
- `src/features/builder/candidates/candidate.errors.ts`

## Arquivos proibidos
- Formulários UI complexos.

## Regras
- Injetar o DB no Service.
- Lançar erro `UNAUTHORIZED_REVIEWER` se um ator não-humano ou sem permissão tentar aprovar.

## Etapas
1. Implementar `approveCandidate(db, candidateId, reviewerId, justification)`.
2. Implementar `rejectCandidate(db, candidateId, reviewerId, justification)`.
3. Validar mudança de status no DB.

## Validações
- Testes ou validação conceitual na camada de lógica pura.

## Relatório final esperado
- Serviço de aprovação exportando as funções cruciais.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 24 — Human Review and Governance

Objetivo:
Estabelecer a camada de regras (Service) para transição de status e aprovação humana.

Escopo:
Permitido alterar apenas a camada Service dos Candidates.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie a regra de transição de estados de aprovação com exigência de justificativa humana.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Human Review and Governance. Pare e solicite review.
```
