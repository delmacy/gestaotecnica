# Fase 20B — Hardening TypeScript e remoção de `any` crítico

## Objetivo
- remover `any` dos pontos críticos tocados (Fase 12-19);
- não refatorar arquitetura ou mudar o comportamento do negócio.

## Contexto
A pressão de construção MVP costuma introduzir atalhos de inferência TypeScript. Antes do fim, é necessário passar um pente fino, garantindo segurança na evolução futura.

## Arquivos permitidos
- Qualquer código tipado do app (`src/features/**`, `src/db/**`).

## Arquivos proibidos
- Next pages lógicas e alterações no SQL final das Queries. Mudança de regras.

## Regras
- Foque restritamente em Warnings estritos de Type e inferência insegura (`as any`, `any`). Substitua por `unknown` validado no Zod ou Generic type seguro.

## Etapas
1. Rastreie os TODOs de tipagem nas interfaces geradas recentemente.
2. Troque genéricos por declarações sólidas.

## Validações
- Compilador rodando com zero flags the "implicit any".

## Relatório final esperado
Quais features ganharam type compliance completo.

## Regra de parada
Após fechar o PR de typescript lint/cleanup.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/mvp-hardening.md

Fase 20B — Hardening TypeScript e remoção de `any` crítico

Objetivo:
Substituir todas as instâncias de `any` (especialmente gerados entre Fases 12-19 na persistência, definição e runtime) por tipagens genéricas ou contratos seguros (`unknown` com type predicates).

Escopo:
- Arquivos: Global scan em `src/features/**`.

Não alterar:
- Drizzle migrations, SQL bruto, lógica de components.

Regras:
Não mude como os dados transitam, mude apenas as inferências em tempo de compilação.

Etapas:
1. Grep por `: any` ou `as any`.
2. Refatore a anotação para Typescript robusto.

Validações:
Build com Typescript Strict ativado passando (se ativado na conf, mantenha o local check com `npm run typecheck`).

Relatório final:
Número de tipagens corrigidas e arquivos focados.

Regra de parada:
Commit da limpeza, fim da fase.
```