# Fase 37 — Agent/Human Dual Elicitation

## Objetivo
Garantir a co-autoria nas metadados dos Candidates.

## Contexto
O System Builder precisa saber se o candidato foi criado via Agent Gateway ou via Formulário Manual da UI do Builder.

## Arquivos permitidos
- `src/features/builder/candidates/candidate.validation.ts` (modificação)
- `src/features/builder/candidates/candidate.repository.ts`

## Arquivos proibidos
- UI Complexas e Lógicas de autenticação OpenID.

## Regras
- Auditar e salvar a coluna `origin` estritamente.

## Etapas
1. Ajustar o Repository do Candidate para gravar a origem.
2. Adicionar o enum `origin: 'manual' | 'agent'` obrigatório nas inserções.

## Validações
- Repositório e tipos integrados corretamente sem quebras.

## Relatório final esperado
- Camada de persistência ajustada para Elicitação Dupla.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 37 — Agent/Human Dual Elicitation

Objetivo:
Garantir a co-autoria nas metadados dos Candidates.

Escopo:
Repositório de Candidates e suas respectivas tipagens de validação.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Garanta a validação obrigatória da origem da elicitação (manual vs agente) em toda persistência do Candidate.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Agent/Human Dual Elicitation. Pare e solicite review.
```
