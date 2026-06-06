# Fase 26 — Forms as Informality Standardization

## Objetivo
Definir a engine de tradução de sinais informais (mensagens) em formulários estruturados no Builder.

## Contexto
Formulários padronizam informalidades. Sinais capturados de chats precisam ter campos estruturados para gerar transições em workflow.

## Arquivos permitidos
- `src/features/builder/forms/form.engine.ts`
- `src/features/builder/forms/form.types.ts`

## Arquivos proibidos
- Integrações diretas de webhooks ou UI de usuários finais.

## Regras
- Um form no System Builder deve possuir referências claras de tipagem (texto, dropdown, origin).

## Etapas
1. Modelar a abstração de Formulários (FormDefinition) acoplados ao candidato.
2. Definir lógicas de validação dinâmica.

## Validações
- Typos e Zod estritos.

## Relatório final esperado
- Motor e tipos de formulários do Builder.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 26 — Forms as Informality Standardization

Objetivo:
Definir a engine de tradução de sinais informais (mensagens) em formulários estruturados no Builder.

Escopo:
Restrito ao pacote builder/forms.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie as definições de Tipos e Zod para Dynamic Forms baseados em inferência.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Forms as Informality Standardization. Pare e solicite review.
```
