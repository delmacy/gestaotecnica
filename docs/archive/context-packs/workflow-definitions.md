# Context Pack: Workflow Definitions

## 1. Objetivo do Domínio
Representa os modelos lógicos, tipos formais e a declaração de estrutura dos processos criados na plataforma. As definições ditam "O que o sistema faz", sem ainda entrar na execução (Runtime) que dita "Como e quando a execução ocorreu".

## 2. Arquivos Principais
- `src/db/platform/schema/workflow.ts`
- `src/features/workflow/definitions/process-definition.types.ts`
- `src/features/workflow/definitions/process-definition.server.ts`
- `src/features/workflow/definitions/process-definition.actions.ts`

## 3. Decisões Ativas
- `workflow.process_definitions` armazena a matriz da definição (o processo conceitual).
- `workflow.process_versions` mantém revisões imutáveis (Draft ou Published) armazenadas no formato JSONB da definição Typescript (`BuilderDraft`).
- Server actions se conectam a um Service e Query baseados puramente no Drizzle usando dependency injection do banco.

## 4. Anti-Escopo
- Definições não executam, nem iniciam fluxos de dados reais.
- Não possuem FK com o schema `public` antigo para evitar violações durante transições da arquitetura.

## 5. Próximas Fases Relacionadas
- Uso intensivo de `process_versions` como input canônico para os inicializadores e criadores do Runtime (Fase 17).