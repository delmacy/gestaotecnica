# Fase 22 — Process Candidate UI

## Objetivo
Implementar a tela prioritária de visualização e lista de Process Candidates no Control Plane.

## Contexto
O arquiteto humano precisa visualizar as propostas geradas (seja manualmente ou por agentes) para poder revisá-las.

## Arquivos permitidos
- `src/app/(builder)/candidates/page.tsx`
- `src/components/builder/candidates/**`

## Arquivos proibidos
- Back-end persistente e chamadas diretas ao banco de dados.

## Regras
- A UI deve possuir lista densa, status badges e filtros visuais (tudo mockado inicialmente se o servidor não existir).

## Etapas
1. Criar a página de listagem de candidatos.
2. Desenvolver os badges de status e fontes (e.g., origin: agent vs manual).
3. Criar painel lateral ou sub-página de detalhe estático.

## Validações
- Verificar ausência de erros de hidratação React.

## Relatório final esperado
- Componentes visuais criados em conformidade com o Control Plane.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 22 — Process Candidate UI

Objetivo:
Implementar a tela prioritária de visualização e lista de Process Candidates no Control Plane.

Escopo:
Permitido criar páginas estáticas e componentes de listagem para Candidates.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Construa a tabela/grid de listagem de Process Candidates.
2. Construa o visualizador de detalhes (inspector).

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Process Candidate UI. Pare e solicite review.
```
