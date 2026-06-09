# Relatório de Execução — Fase 19C

## Objetivo
Injetar disparo no Runtime service.

## Arquivos Alterados / Criados
- `src/features/workflow/runtime/runtime.service.ts`: Alterado `startProcessInstance` para emitir o evento `process.started` após as configurações base da instância, passando via `payload` inicial o que for detectado.
- `src/features/workflow/runtime/runtime-step.service.ts`: Alterado `advanceStep` para emitir `step.completed` logo após o fechamento do Action Execution ativo. Também inseridos os devidos dispatches para `step.started` para a nova execução da fila, bem como `process.completed` em caso de encerramento do Path (seja por reach no EndNode ou esgotamento de edges).

## Validações
Nenhuma alteração de interface pública exposta à UI e os builds/types estão completamente validados. Nenhuma falha de compilação ou interrupção linear percebida. O RuntimeDb compartilha perfeitamente a tipagem de proxy (`db as any` dentro da function safe limit).
