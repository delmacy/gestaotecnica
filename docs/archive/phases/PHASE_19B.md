# Relatório de Execução — Fase 19B

## Objetivo
Criar o repository base de registro (append) e leitura para a tabela de events da Engine, garantindo a injeção do banco transacional.

## Arquivos Alterados / Criados
- `src/features/workflow/runtime/events/events.repository.ts`: Criadas funções `logEvent` (insere) e `getEventsByInstanceId` (recupera lista blindada por workspace).
- `src/features/workflow/runtime/events/index.ts`: Adicionado re-export do repositório.

## Validações
O TypeScript e o Drizzle não reclamaram dos tipos. Os `events` estão mapeados fielmente ao Postgres (como strings/uuid/jsonb).
