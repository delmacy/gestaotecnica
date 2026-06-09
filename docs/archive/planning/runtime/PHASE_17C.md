# Fase 17C — Runtime service de iniciar instância

## Objetivo
- criar regra de negócio para iniciar instância a partir de process version published;
- validar input;
- usar repository;
- não criar server action, UI ou events.

## Contexto
O cérebro do módulo de instanciamento. Aqui definimos as proteções para não deixar criar instância sem um process definition publicado.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.service.ts`
- `src/features/workflow/runtime/runtime.errors.ts` (se útil)

## Arquivos proibidos
- Server actions (`actions.ts`)
- UI / Frontend

## Regras
- Utilizar padronização de Retorno (`{ok: true, data}` vs `{ok: false, error}`).
- Verificar status de 'published' na Process Version referenciada (usar o Service respectivo de Workflow Definitions se necessário).

## Etapas
1. Crie o `startInstance` (ou similar) no service.
2. Adicione regras de checagem.
3. Encapsule o repositório.

## Validações
- Estrutura clara e ausência de chamadas web (requests/headers HTTP acoplados).

## Relatório final esperado
Explicação das verificações (published, validação de payload).

## Regra de parada
Service e Error class.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime.md

Fase 17C — Runtime service de iniciar instância

Objetivo:
Isolar as regras de negócio de alto nível necessárias para criar de forma segura a execução de um workflow, conectando-se ao seu repository já estabelecido.

Escopo:
- Arquivos a criar:
  src/features/workflow/runtime/runtime.service.ts
  src/features/workflow/runtime/runtime.errors.ts

Não alterar:
Não altere Repositories, não crie Server Actions para o NextJS. Sem UI.

Regras:
1. Valide a existência e se a versão do processo origem está marcada como 'published'.
2. Return estrito: `{ ok: true, data: T } | { ok: false, error: ErrorResponse }`.
3. Tratar exceptions em bloco `catch` e não os expor no error payload cruo.

Etapas:
1. Construa o método Service (e.g. `startProcessInstance`).
2. Adicione as dependências lógicas em cima dos repositories.

Validações:
Nenhum log com informações sensíveis em caso de erro, return pattern obedecido.

Relatório final:
Liste a assinatura final do service, justifique exceptions tratadas.

Regra de parada:
Ao criar o Service de instanciar.
```