# Tasks — F21 Platform Hardening

Estados refletem o repositório observado em 2026-08-04. `merged` ainda exige validação contra o contrato da task.

## A — Segurança crítica

| ID | Título | Dependência | Estado | PR |
|---|---|---|---|---|
| SB-CR-01 | Remover cópia `pr903-fix` do versionamento | — | merged | — |
| SB-CR-02 | Escopar `getWorkItems` por workspace | CR-01 | merged | — |
| SB-CR-03 | Escopar `getWorkItemById` por workspace | CR-02 | merged | — |
| SB-CR-04 | Escopar `getWorkItemSummary` por workspace | CR-02 | merged | — |
| SB-CR-05 | Escopar `getWorkItemEvents` por workspace | CR-02 | merged | — |
| SB-CR-06 | Tornar workspace obrigatório no contrato de work-items | CR-02..05 | merged | — |
| SB-CR-07 | Autenticar gateway com JWT e claims de workspace | CR-06 | merged | — |
| SB-CR-08 | Auditar queries dos módulos por `workspaceId` | CR-02..07 | merged | — |
| SB-CR-09 | Implementar proteção no banco para tabelas críticas | CR-08 | ready | — |
| SB-CR-10 | Remover API key global e aplicar auth por tenant | CR-07 | merged | — |

## B — Performance e escalabilidade

| ID | Título | Dependência | Estado | PR |
|---|---|---|---|---|
| SB-PF-01 | Invalidar cache por workspace em service-orders | grupo A | review | #996 |
| SB-PF-02 | Invalidar cache por workspace em workforce | PF-01 | review | #997 |
| SB-PF-03 | Invalidar cache por workspace em strategy | PF-02 | planned | — |
| SB-PF-04 | Aplicar invalidação por workspace nos módulos restantes | PF-01..03 | planned | — |
| SB-PF-05 | Remover N+1 da página de workflow lab | grupo A | planned | — |
| SB-PF-06 | Remover N+1 de evidências | grupo A | planned | — |
| SB-PF-07 | Remover N+1 de relatórios | grupo A | planned | — |
| SB-PF-08 | Adicionar paginação por cursor em queries extensas | grupo A | planned | — |
| SB-PF-09 | Indexar `workspaceId` nas tabelas runtime | CR-08 | planned | — |
| SB-PF-10 | Tornar processamento de outbox assíncrono | CR-08 | planned | — |

## C — Build, CI e tooling

| ID | Título | Dependência | Estado | PR |
|---|---|---|---|---|
| SB-BI-01 | Adicionar comando de typecheck | CR-01 | merged | — |
| SB-BI-02 | Resolver timeout do lint | CR-01 | planned | — |
| SB-BI-03 | Resolver timeout do TypeScript | BI-01 | planned | — |
| SB-BI-04 | Reconciliar versão do `drizzle-kit` | — | planned | — |
| SB-BI-05 | Validar atualização do Next.js | — | merged | — |
| SB-BI-06 | Criar CI com lint, typecheck, test e build | BI-01..05 | planned | — |
| SB-BI-07 | Ignorar logs e estado do orquestrador | — | merged | — |
| SB-BI-08 | Remover `push --force` de fluxos de produção | — | planned | — |
| SB-BI-09 | Excluir cópias e diretórios não-projeto do ESLint | CR-01 | merged | — |
| SB-BI-10 | Criar comando `validate:all` | BI-01..09 | review | #995 |

## D — Qualidade e testes

| ID | Título | Dependência | Estado | PR |
|---|---|---|---|---|
| SB-QT-01 | Refatorar actions de service-orders em comandos/handlers | grupo C | planned | — |
| SB-QT-02 | Refatorar actions de workforce | grupo C | planned | — |
| SB-QT-03 | Refatorar actions de strategy | grupo C | planned | — |
| SB-QT-04 | Eliminar `any` do kernel | grupo C | planned | — |
| SB-QT-05 | Eliminar `any` do schema legado | grupo C | planned | — |
| SB-QT-06 | Testar `runAction` | grupo C | planned | — |
| SB-QT-07 | Testar event log service | grupo C | planned | — |
| SB-QT-08 | Testar pipeline REST de work-items | CR-02..10 | planned | — |
| SB-QT-09 | E2E work-item → service-order | QT-08 | planned | — |
| SB-QT-10 | Resolver validações pendentes nas APIs | grupo A | planned | — |

## E — Observabilidade e infraestrutura

| ID | Título | Dependência | Estado | PR |
|---|---|---|---|---|
| SB-OI-01 | Integrar APM/logs de erro centralizados | grupo C | planned | — |
| SB-OI-02 | Padronizar logger estruturado | grupo C | planned | — |
| SB-OI-03 | Implementar rate limiting | grupo A | planned | — |
| SB-OI-04 | Dimensionar pool de conexões | PF-05..10 | planned | — |
| SB-OI-05 | Adotar pooling de conexões | OI-04 | planned | — |
| SB-OI-06 | Revisar cascatas e órfãos de FKs | grupo A | planned | — |
| SB-OI-07 | Automatizar backup e restore verificável | grupo C | planned | — |
| SB-OI-08 | Criar health/readiness de DB e filas | grupo C | planned | — |
| SB-OI-09 | Corrigir PATH do Node/npm no orquestrador | — | planned | — |
| SB-OI-10 | Resolver trabalho pendente da REST API de work-items | QT-08 | planned | — |

## Observações de reconciliação

- `SB-CR-06` precisa de revisão específica: o planejamento fala em contrato obrigatório de queries, enquanto commits recentes mencionam também mudança de coluna. A validação deve provar schema, assinaturas e callers.
- PRs #995–#997 estão empilhados. Devem declarar dependência e ser retargetados para a `main` após a integração da base.
- Nenhuma task `merged` deve ser promovida diretamente a `validated` sem evidência independente.
