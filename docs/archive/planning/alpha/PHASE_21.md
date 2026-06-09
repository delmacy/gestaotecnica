# Fase 21 — Process Candidate Ontology

## Objetivo
Definir os tipos de dados fundamentais (Typescript/Zod) e o modelo de domínio do Process Candidate.

## Contexto
Antes de criar o banco de dados, precisamos dos contratos Zod e TypeScript que estabelecem o conceito de Process Candidate no código do System Builder.

## Arquivos permitidos
- `src/features/builder/candidates/candidate.types.ts`
- `src/features/builder/candidates/candidate.validation.ts`

## Arquivos proibidos
- UI e Server Actions.
- Modificação do schema do banco de dados (Drizzle).

## Regras
- Usar apenas `Record<string, unknown>` para atributos dinâmicos.
- Incluir status canônicos (draft, under_analysis, waiting_review, approved, rejected, published).

## Etapas
1. Criar `candidate.types.ts` definindo `ProcessCandidate`, `CandidateState`, etc.
2. Criar `candidate.validation.ts` com os schemas Zod correspondentes.

## Validações
- Compilação TypeScript 100% livre de erros (`tsc --noEmit`).

## Relatório final esperado
- Tipos exportados e validados.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 21 — Process Candidate Ontology

Objetivo:
Definir os tipos de dados fundamentais (Typescript/Zod) e o modelo de domínio do Process Candidate.

Escopo:
Permitido apenas a pasta `src/features/builder/candidates/`.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Elabore os contratos em TypeScript.
2. Construa a validação Zod estrita.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Process Candidate Ontology. Pare e solicite review.
```
