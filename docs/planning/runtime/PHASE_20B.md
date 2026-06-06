# Fase 20B — Hardening: Any Cleanup

## Objetivo
Remoção de `any` críticos na tipagem

## Contexto
Auditoria de qualidade no Typescript para remoção da palavra reservada `any` no payload.

## Arquivos permitidos
- Todos arquivos `*.ts` dentro de `src/features/workflow/runtime` e repasses para API.

## Arquivos proibidos
- Criação de novas lógicas de negócio.

## Regras
- A tipagem deve forçar `unknown` ou interfaces Zod rigorosas. Refatorar vazamentos de tipo.

## Etapas
1. Realizar busca por `: any` na pasta de runtime.
2. Substituir por validações seguras (`z.unknown()`, `Record<string, unknown>`).

## Validações
- Validação contextual de Hardening.

## Relatório final esperado
- Resumo do Hardening executado.

## Regra de parada
- Declarar o fechamento do bloco.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 20B — Hardening: Any Cleanup

Objetivo:
Remoção de `any` críticos na tipagem

Escopo:
- Arquivos permitidos: Todos arquivos `*.ts` dentro de `src/features/workflow/runtime` e repasses para API.

Não alterar:
Criação de novas lógicas de negócio.

Regras:
A tipagem deve forçar `unknown` ou interfaces Zod rigorosas. Refatorar vazamentos de tipo.

Etapas:
1. Realizar busca por `: any` na pasta de runtime.
2. Substituir por validações seguras (`z.unknown()`, `Record<string, unknown>`).

Validações:
Hardening test success.

Relatório final:
Apresente evidências de conclusão.

Regra de parada:
Feche a tarefa.
```
