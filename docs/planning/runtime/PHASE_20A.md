# Fase 20A — Hardening: Smoke Tests

## Objetivo
Validação do fluxo (Criar -> Instanciar -> Concluir)

## Contexto
Garantir que a espinha dorsal operacional do MVP está executando corretamente de ponta a ponta sem loops infinitos.

## Arquivos permitidos
- `src/features/workflow/runtime/test/runtime-smoke.test.ts` (ou similar/simulação via Server Action isolada)

## Arquivos proibidos
- Alterações de banco estruturais.

## Regras
- Apenas testes de integração puros na camada de serviço. Validar se uma instância é instanciada e passos podem ser concluídos sequencialmente.

## Etapas
1. Criar fluxo de simulação simples em memória ou teste de integração simulando um workspace temporário.
2. Iniciar instância de um Process_Version mock.
3. Executar o avanço de steps.
4. Validar output.

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

Fase 20A — Hardening: Smoke Tests

Objetivo:
Validação do fluxo (Criar -> Instanciar -> Concluir)

Escopo:
- Arquivos permitidos: `src/features/workflow/runtime/test/runtime-smoke.test.ts` (ou similar/simulação via Server Action isolada)

Não alterar:
Alterações de banco estruturais.

Regras:
Apenas testes de integração puros na camada de serviço. Validar se uma instância é instanciada e passos podem ser concluídos sequencialmente.

Etapas:
1. Criar fluxo de simulação simples em memória ou teste de integração simulando um workspace temporário.
2. Iniciar instância de um Process_Version mock.
3. Executar o avanço de steps.
4. Validar output.

Validações:
Hardening test success.

Relatório final:
Apresente evidências de conclusão.

Regra de parada:
Feche a tarefa.
```
