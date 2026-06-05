# Fase 17D — Server action de iniciar instância

## Objetivo
- expor server action para iniciar instância;
- usar service da 17C;
- retornar ok/error;
- não criar UI, não criar events.

## Contexto
Temos regras de negócio (Service) perfeitas e transacionais. Para utilizá-las dentro da infraestrutura do Next.js App Router (Client Components / Forms), precisamos de uma boundary clara e assíncrona: a Server Action.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.actions.ts`
- `src/features/workflow/runtime/runtime.server.ts` (se útil, como adapter de payload HTTP->Service)

## Arquivos proibidos
- Components (`src/components/**`, `.tsx`)
- App pages (`src/app/**`)

## Regras
- Todas as funções expostas em `actions.ts` **devem** ter a string diretiva `"use server"`.
- Não deve conter lógica do negócio, devendo repassar chamadas e lidar apenas com o Request Data, Autenticação de Sessão e Authz mock.

## Etapas
1. Crie o Server Action exportado repassando e formatando entradas do cliente pro formato requerido do Runtime Service.

## Validações
- Diretiva `'use server'` explícita, parseamento final com try/catch pro cliente.

## Relatório final esperado
Endpoints/actions expostas documentadas.

## Regra de parada
Após fechar o wrapper da action, não avance para as interfaces visuais do React.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime.md

Fase 17D — Server action de iniciar instância

Objetivo:
Implementar a Action boundary (Server Action do NextJS) que consome o Service de Runtime criado na Fase 17C.

Escopo:
- Arquivos a criar:
  src/features/workflow/runtime/runtime.actions.ts

Não alterar:
Services, Repositories, ou Schemas. Não altere páginas React (UI).

Regras:
1. Comece com `"use server"`.
2. Encapsule captura de context (AuthMock, Workspace Mock se exigido ou o Real se presente).
3. Capture erros do Service e traduza caso haja falhas extremas para não crachar a action de server side limitando rastreio no client.

Etapas:
1. Construa o endpoint `startProcessInstanceAction`.

Validações:
Tipos devem ser compatíveis com formulários e serializáveis com Zod/React actions nativas.

Relatório final:
Informe a assinatura exposta.

Regra de parada:
Server action criado, pare.
```