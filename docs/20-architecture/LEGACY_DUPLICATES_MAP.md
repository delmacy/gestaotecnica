# Mapa de Duplicidades entre Legado e Plataforma

## 1. Objetivo

Este documento registra conceitos duplicados entre o schema legado `public` e os novos schemas da plataforma, para evitar refatorações cegas e quebras de integridade.

## 2. Princípio

> Nenhuma tabela legada deve ser removida no MVP. A migração deve ser gradual, explícita e rastreável.

## 3. Duplicidades conhecidas

| Conceito      | Legado atual            | Plataforma alvo                                      | Status                | Decisão MVP                                                                  |
| ------------- | ----------------------- | ---------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------- |
| Workspace     | `public.workspaces`     | `workspace.workspaces`                               | Duplicado             | Manter ambos; novo código da plataforma deve preferir `workspace.workspaces` |
| Organization  | `public.organizations`  | `workspace.organizations`                            | Duplicado             | Manter ambos; evitar FK nova para `public.organizations`                     |
| Event Log     | `public.event_logs`     | `workflow.events`                                    | Duplicado/conflitante | Não refatorar nesta fase; documentar migração futura                         |
| Outbox        | `public.outbox_events`  | `workflow.events` ou futura `workflow.outbox_events` | Em transição          | Não criar outbox nova agora                                                  |
| Flow Run      | `public.flow_runs`      | `workflow.process_instances`                         | Conceito relacionado  | Não migrar agora                                                             |
| Work Item     | `public.work_items`     | domínio runtime futuro                               | Legado operacional    | Manter como legado                                                           |
| Service Order | `public.service_orders` | módulo runtime futuro                                | Legado operacional    | Manter como legado                                                           |

## 4. Regra para novo código

* novo código de plataforma deve evitar dependência direta de `public`;
* se for necessário ler dados legados, criar adaptador explícito;
* não criar FK nova apontando para tabela legada sem justificativa;
* eventos novos da plataforma devem mirar `workflow.events` em fase futura;
* runtime novo deve apontar para schemas próprios.

## 5. Riscos conhecidos

* FK apontando para workspace errado;
* eventos tentando gravar contra `public.workspaces`;
* duplicidade de fonte da verdade;
* migrations gerando tabelas em schema errado;
* Drizzle ignorando schema físico inexistente;
* uso acidental de tabela legada por import incorreto.

## 6. Decisões adiadas

* remoção de `public.workspaces`;
* migração de `public.event_logs`;
* criação de outbox definitiva;
* migração de service orders;
* migração de work items;
* relaxamento de FKs legadas;
* unificação completa de tenant/workspace.

## 7. Critério de aceite

```text
A Fase 02 não resolve as duplicidades.
Ela apenas torna as duplicidades visíveis, documentadas e seguras para as próximas fases.
```
