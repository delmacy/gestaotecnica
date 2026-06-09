# Work Board — System Builder

## 1. Estado atual

| Campo                           | Valor                                        |
| ------------------------------- | -------------------------------------------- |
| Fase técnica atual              | AUTH-01 — Authentication and Access Profiles Stabilization |
| Fase documental atual           | Frontend Parity Gate aplicado ao bloco Alpha |
| Última fase técnica implementada| AUTH-01                                      |
| Status da última fase           | READY FOR REVIEW                             |
| Última fase frontend aprovada   | Fase 29B                                     |
| Próxima fase frontend vinculada | Fase 30B                                     |
| Responsável técnico             | Jules Dev                                    |
| Responsável documental          | Jules Documental                             |
| Revisor                         | ChatGPT / Jules Tester                       |
| Dono do projeto                 | Delmacy                                      |

## 2. Trilhas de trabalho

| Trilha                | Responsável      | Status      | Observação                                    |
| --------------------- | ---------------- | ----------- | --------------------------------------------- |
| Documentação/contexto | Jules Documental | Concluída   | Replanejamento Alpha por contratos de feature |
| Implementação         | Jules Dev        | Pendente    | Aguardando merge da Fase 30B                  |
| Revisão               | ChatGPT          | Sob demanda | Revisa merges e coerência                     |
| Decisão de produto    | Delmacy          | Ativo       | Aprova direção e prioridades                  |

## 3. Fila técnica

1. AUTH-01 — Estabilização de Autenticação — Aguardando Review
2. Fase 30B — Gateway Receipts UI — Pausada temporariamente
3. Fase 31 — n8n Signal Inbox Backend — Bloqueada até 30B
3. Fase 31B — Signal Inbox UI — Planejada
5. Fase 32 — Observation Pipeline Backend — Planejada
6. Fase 32B — Observation Review UI — Planejada

## 4. Fila documental

| Ordem | Documento/Ação               | Status    | Responsável      | Objetivo                                                                 |
| ----: | ---------------------------- | --------- | ---------------- | ------------------------------------------------------------------------ |
|     1 | Planejamento MVP (17-20)     | Histórico | Jules Documental | Mantido como referência de evolução anterior.                            |
|     2 | Frontend Parity Gate (28-40) | Concluída | Jules Documental | Replanejado fases Alpha 28-40 para garantir UI para cada backend avanço. |
|     3 | Próximo refinamento          | Pendente  | Jules Documental | Ajustar documentação caso a Fase 28 revele gaps no Agent Gateway.        |

## 5. Bloqueios

A Fase 30B está pausada até a revisão e o merge de AUTH-01.
A Fase 31 está bloqueada até a revisão e o merge da Fase 30B.

## 6. Decisões recentes

| Data  | Decisão                          | Impacto                                                                                                                                                                        |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Atual | Golden E2E aprovado              | A Fase 27B criou seed canônico e teste ponta a ponta do ciclo candidato -> publicação -> instância -> avanço.                                                                  |
| Atual | Layout compatível aprovado       | A Fase 27C criou shell visual sem alterar contratos de backend.                                                                                                                |
| Atual | Fila Alpha com paridade frontend | O bloco alpha foi replanejado com Frontend Parity Gate, incluindo fases B para UIs correspondentes. A Fase 28 está autorizada; fases posteriores aguardam conclusão e revisão. |

## 7. Handoff para Jules Dev

Planejamento futuro disponível (NÃO IMPLEMENTAR AINDA):

- `docs/planning/alpha/PHASE_29.md` até `PHASE_40.md`.

- Registro histórico das fases: `docs/phases/`
- Fase atual deve apontar para seu arquivo histórico correspondente.
- Handoff para Jules Dev deve incluir:
  - planning file;
  - phase record file.

**Atenção Jules Dev:** Antes de começar a implementar ou ler qualquer arquivo, você **deve** atualizar o seu ambiente git local executando um `git pull` na branch correta para garantir que pegou as últimas atualizações geradas pelo Jules Documental.

```text
Próxima fase técnica: Fase 30B — Gateway Receipts UI (após revisão de AUTH-01)

Consulte o documento principal de planejamento de onde deve partir o prompt exato para a sua implementação:

docs/planning/alpha/PHASE_30B.md

Registro:
docs/phases/PHASE_30B.md

NÃO AVANCE PARA FASES FUTURAS AINDA. Aguarde revisão de AUTH-01 e 30B.
```

## 8. Última revisão ChatGPT

| Campo          | Valor                                  |
| -------------- | -------------------------------------- |
| Última revisão | AUTH-01 concluída aguardando review    |
| Resultado      | Aguardando                             |
| Observações    | Fase 30B e 31 bloqueadas até merge.    |

## Eventos Recentes: AUTH-01-T01
- **Status da Tarefa**: AUTH-01-T01 [DONE]
- **Auditoria concluída**:
  - O fluxo atual de login foi analisado. Ele cria sessões na tabela `authSessions` (em `src/db/legacy/schema.ts`) via server action em `src/modules/auth/actions.ts`.
  - Sessões são geradas e um cookie (`gestaotecnica_session`) é atribuído ao usuário.
  - A middleware (`src/proxy.ts`) utiliza o cookie para permissões de rotas.
- **Causa provável do erro detectada**:
  - Exportação de objetos do schema com nomes repetidos. Em `src/db/schema.ts`, a exportação do `users` entra em conflito entre o schema legacy (`src/db/legacy/schema.ts`) e o novo schema `identity` introduzido em `src/db/runtime/schema/identity.ts` (onde `usersTable` é renomeado como `users` na exportação). Isso leva a acessos e joins incorretos em `src/modules/auth/actions.ts` onde a coluna `accessProfile` é necessária (e só existe no schema legacy).
- **Ação sugerida**: Ir para a próxima box (`implementation`) para corrigir a importação/conflitos e adequar as queries ao novo schema consolidado ou isolá-los apropriadamente.
- **Implementação**:
  - A correção foi efetuada modificando as importações em `src/modules/auth/actions.ts` e `src/modules/auth/session.ts` para que extraiam `authAccounts`, `authSessions`, e `users` diretamente de `@/db/legacy/schema`, evitando o namespace confuso.
  - Além disso foi corrigido um Type Error do React em `src/app/auth/login/page.tsx` no payload do `useActionState`, passando de `{ error: null }` para `{ error: "" }`.
