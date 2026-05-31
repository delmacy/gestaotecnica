# Relatório de Auditoria do System Builder

Este documento apresenta uma auditoria técnica profunda do projeto System Builder, avaliando sua segurança, arquitetura, banco de dados, performance, preparação para produção, qualidade de código e escalabilidade. O relatório baseia-se na premissa de uso comercial por múltiplos clientes em produção.

---

## Resumo Executivo

**Notas Gerais (0 a 10):**
- **Arquitetura:** 6.0/10 (Boas intenções de modularização e separação Core/Adaptations, porém a implementação atual mistura responsabilidades nos mesmos diretórios, e possui alta acoplamento através de Actions acionadas via Next.js Server Actions e dependências legadas).
- **Segurança:** 4.0/10 (Faltam validações rigorosas e centralizadas de multi-tenancy a nível de banco de dados; dependência de `workspaceId` sem RLS; hardcoded API keys no Gateway; Cookies auth básicos sem proteção JWT validada strict).
- **Escalabilidade:** 3.5/10 (O design de processamento sincrono no workflow outbox trará grandes gargalos rapidamente. Drizzle query construction gerando múltiplos `leftJoin` repetitivos e mapeamentos `Promise.all` resultando em N+1 no nível do banco e de aplicação. Single-database pooling).
- **Qualidade de Código:** 5.0/10 (Arquivos extremamente longos (ex: `service-orders/actions.ts` com ~900 linhas), esquema Drizzle legado enorme (~1500 linhas), `any` espalhados e inconsistências de tipagem).
- **Produção:** 3.0/10 (Ausência completa de testes automatizados unitários/E2E/integração. Faltam observabilidade robusta (Sentry/Datadog), rate limiting, e CI/CD actions definidas no repositório. Uso intenso de `revalidatePath("/")` que purga caches agressivamente).

---

## 1. Auditoria de Segurança Multi-Tenant

**Status Atual:**
A aplicação adota um modelo "Pool Misto" usando um schema relacional onde a separação lógica de clientes se dá por uma coluna `workspaceId`.

**Riscos Identificados:**
1. **Quebra de Isolamento (Alto):** Consultas em vários arquivos (`src/modules/*/queries.ts`) não asseguram que a query seja escopada exclusivamente com `where(eq(table.workspaceId, context.workspaceId))`, confiando primariamente em server actions e middlewares superficiais, correndo o risco de vazar dados entre clientes se um parâmetro no UI falhar.
2. **PostgreSQL RLS Ausente (Crítico):** A falta de *Row-Level Security* nativa do PostgreSQL exige que toda query contenha a cláusula `.where(eq(workspaceId))`. O esquecimento em um único ponto (ex: relatórios) resultará no vazamento total dos dados entre as empresas.
3. **Hardcoded API Keys (Alto):** A integração com Gateway checa as chaves através de um `process.env.GESTAOTECNICA_API_KEY` único na plataforma (`src/platform/integrations/auth.ts`). A exposição global de credenciais permite que qualquer tenant faça bypass via API calls.
4. **Proteções Básicas Ausentes (Médio):** Ausência de *Rate Limiting* nas APIs ou ações do servidor, permitindo ataques de DoS de manipulação de DB (via Server Actions) e esgotamento das pools de conexões (`max: 10`).

---

## 2. Auditoria Arquitetural

**Status Atual:**
O sistema está estruturado de forma a abstrair o "Platform" (System Builder) do "Blueprint" (Módulos/Gestão Técnica). No entanto, o `src/platform/kernel.ts` revela um forte acoplamento (carregando todos os módulos e blueprints simultaneamente).

**Riscos e Débitos Técnicos:**
1. **Acoplamento Core-Modules:** O Core (`src/platform`) faz importações diretamente de `src/modules` e de fluxos "hardcoded" (`src/adaptations/secao-tecnica`). O Registry deveria ser dinâmico ou injetado, mas é estático.
2. **Processamento de Eventos (Event-driven) Síncrono:** Em `src/platform/events/event-log-service.ts`, a função `emitEvent` insere na tabela e logo em seguida invoca sincronicamente o outbox (`processFlowOutboxEvent`), travando a execução da thread e do request HTTP para aguardar integrações.
3. **Inconsistência de Estado no Timeline/Logs:** A imutabilidade do `event_logs` tenta conviver com `outbox_events` reprocessáveis. Se ocorrer uma falha entre o salvar da API e o Event Bus (que roda bloqueando a request atual), as tabelas perdem a atomicidade.

---

## 3. Auditoria de Banco de Dados

**Status Atual:**
Utiliza Drizzle ORM sobre PostgresSQL, com uma migração transicional em curso (`legacy/schema.ts` vs `runtime/schema/`).

**Riscos e Melhorias:**
1. **Falta de Índices Básicos:** As novas entidades no Drizzle em `src/db/runtime/schema/` não possuem indexação definida sobre o `workspaceId` (Diferente da versão `legacy`). A falta de `index()` nestes modelos irá destruir o performance em full-table scans.
2. **Falta de Restrição Foreign Key em Ambientes Múltiplos:** `idempotencyKey` da tabela IntegrationCommands e eventos tem falhas com logs de eventos interconectados de outros workspaces.
3. **Cascatas Ausentes:** Sem RLS e sem cascatas (ON DELETE CASCADE), se um tenant (Workspace) for deletado, a deleção falhará por quebra de restrições de chaves, ou os dados deixarão tabelas órfãs para sempre.

---

## 4. Auditoria de Performance

**Status Atual:**
A performance geral sofrerá severamente a partir das centenas de clientes. Múltiplos N+1 foram encontrados.

**Gargalos Identificados:**
1. **N+1 no Mapeamento de Arrays (`Promise.all` em Maps):** Em `src/app/admin/lab/workflow/page.tsx`, um `rawInstances.map` executa `timelineService.getProcessInstanceTimeline` para cada instância do array. Se a página retornar 50 instâncias, serão 50 queries sequenciais e pesadas.
2. **Queries em Joins Excessivos:** Consultas (como em `evidences/queries.ts` e `reports/actions.ts`) fazem `.leftJoin()` com tabelas volumosas e frequentemente adicionam uma contagem com múltiplos `.select({ value: count() })` executados paralelamente (`Promise.all`), afogando a connection pool de limite de `10`.
3. **Falta de Paginação Universal:** Consultas possuem hard limits (`.limit(80)` ou `.limit(100)`), não possuindo offset dinâmico ou cursor-based pagination nas tabelas do front-end, o que trará problemas à interface.

---

## 5. Auditoria de Produção (Production Readiness)

**Status Atual:**
O sistema não parece preparado para receber alta carga comercial no estado atual. O `middleware.ts` checa apenas a presença de um cookie, sem assinar ou revalidar via JWT, ou lidar com tokens expirados localmente de forma resiliente.

**Riscos Críticos:**
1. Falta de logs de erro centralizados e rastreamento APM. Apenas `console.log()` pontuais no código de Flow.
2. Faltam backups automatizados integrados ou descrições no schema sobre migrações transacionais (`drizzle-kit push --force` sendo usado em run scripts é extremamente perigoso na PRD).
3. O CACHE da Vercel (Next.js App Router) é purgado usando `revalidatePath("/")` agressivo em centenas de arquivos (ex: `documents/actions.ts`), o que invalida absolutamente todo o servidor e obriga a reconstrução de páginas parciais.

---

## 6. Auditoria de Código

**Débitos e Bugs:**
1. A estrutura de Actions (`src/modules/*/actions.ts` misturado com `kernel-actions.ts`) está confusa e exibe repetições. O arquivo `service-orders/actions.ts` tem 882 linhas misturando Form Data parsing manual, DB calls brutas e orquestração.
2. Múltiplos blocos `TODO` ignorados (ex: validação de escopos em `route.ts`).

---

## 7. Auditoria de Testes

**Cobertura: 0%.**
Nenhum arquivo `*.test.ts`, `*.spec.ts` ou pasta de cypress/playwright no core source code. O arquivo `scripts/verify-integrity.ts` existe, mas atua como um sanity check rodando em CLI contra banco local com dados reais, em vez de atuar através de testes estritos transacionados ou mockados.

---

## 8. Auditoria de Escalabilidade

**Projeções:**
- **10 clientes:** Funcionará bem na infra atual.
- **100 clientes:** Connection pools limitadas (max 10 conexões em Prisma/PostgresJS com múltiplos Joins simultâneos por page view) causarão "Too many connections" errors; Vercel Timeouts no Server Action de `processFlowOutboxEvent`.
- **1.000 clientes:** A tabela `event_logs` sem indexes de workspace será o gargalo (Slow queries de 2s+). O Banco unificado precisará ser sharded.
- **10.000 clientes:** O sistema precisa adotar PostgreSQL com Database Separation (DB per tenant ou Schema per Tenant dinâmico em nível DB) e processamento async (Kafka, BullMQ ou SQS) para Events e Flows, o outbox precisará virar um worker separado.

---

## 9. Documentação Técnica para Onboarding

**1. Visão Geral:** Next.js (App Router), TS, Tailwind, Drizzle (PostgreSQL).
**2. Arquitetura:**
 - **Core/Platform (`src/platform`):** Engines, Workflows, Metadata.
 - **Modules (`src/modules`):** Capabilities e Adapters.
 - **Shell/Builder:** UX Dinâmica.
**3. Banco de Dados:** Múltiplos schemas lógicos Drizzle num DB central, `workspaceId` para controle de Tenants.
**4. Fluxos e Eventos:** Todas as requisições fluem por "Kernel Actions" (`runAction()`) -> disparam Eventos (`emitEvent`) -> Salva no Event Log -> Processamento pelo Outbox Engine de automações.

---

## Top 10 Riscos Mais Graves

| Problema | Impacto | Severidade | Recomendação |
| :--- | :--- | :--- | :--- |
| 1. Vazamento de dados em Queries | Clientes visualizam O.S. ou ativos de outros workspaces | Crítica | Habilitar RLS no PostgreSQL via Drizzle. Aplicar Policies globais p/ tenant. |
| 2. Eventos/Outbox Síncronos | Timeouts em Vercel, requests paralisadas no cliente | Crítica | Mover processamento de flow outbox para worker externo ou pub/sub na Edge. |
| 3. Falta de Indexação (`workspaceId`) | Lerdeza massiva no banco com escalabilidade rápida | Crítica | Adicionar `.index()` em todas as tabelas no `schema/runtime`. |
| 4. N+1 Queries no Painel/Relatórios | Sobrecarga de Pool de Conexões e Crash da API | Alta | Refatorar consultas usando funções JSON/aggregation no Drizzle, sem Maps. |
| 5. Zero Cobertura de Testes Unitários/E2E | Regressões acidentais não detectáveis | Alta | Implementar Vitest/Jest (Unidade) e Playwright (E2E) imediatamente. |
| 6. Hardcoded Master Keys e Auth Fraco | Vulnerabilidade a intrusão externa (Bypass gateway) | Alta | Mudar para JWT assinado / Auth Server seguro, remover `expectedKey`. |
| 7. Arquivos Monolíticos de Actions | Impossível dar manutenção, alto risco de erro humano | Média | Dividir `actions.ts` em CQRS (Commands e Handlers) claros. |
| 8. `revalidatePath("/")` constante | Excesso de sobrecarga no CDN, caches não reutilizados | Média | Adicionar tag-based caching `revalidateTag(workspaceId)` em vez de path raiz. |
| 9. Cascatas de Banco Ausentes | Corrupção de referências caso tenentes sejam deletados | Média | Adicionar restrições nas tabelas para `onDelete('cascade')`. |
| 10. Connection Pooling Limitado | Banco rejeita requisições ao escalar `max:10` | Média | Adicionar PgBouncer/Supabase Pooling e aumentar threshold. |

---

## Plano de Ação

### Correções Imediatas (0-15 dias):
1. Garantir restrição global por tenant nas Queries cruciais onde vazamento foi detectado. Adicionar Indexing no `workspaceId` para `src/db/runtime/schema/*.ts`.
2. Trocar processamento estático Síncrono no `outbox-service.ts` para ser agendado em Background ou usar res.waitUntil() nativo do Next.js.
3. Substituir o Hardcoded Gateway Key por Auth decente.

### Correções Curto Prazo (30 dias):
1. Iniciar pacote de testes básicos Vitest em `kernel-actions`.
2. Implementar Dataloaders ou reescrever queries com `.leftJoin` para resolver gargalos de contagem massiva (`Promise.all([...count_queries])`).
3. Alterar `revalidatePath("/")` para revalidações locais `revalidatePath("/path/do/recurso")`.

### Correções Médio Prazo (60 dias):
1. Configurar RLS no PostgreSQL, blindando a persistência completamente no nível do motor relacional.
2. Substituir `drizzle-kit push --force` por sistema rastreável de migrations para CI/CD produtivo.
3. Configuração de logs avançados e observabilidade APM (ex: Sentry).

### Melhorias Futuras:
1. Arquitetura Serverless real de background workers (SQS/RabbitMQ/Kafka) para desmembrar a Platform.
2. Refatorar Kernel importando modulos dinamicamente sob demanda por adaptação.
3. Separar o Banco System Builder do Runtime em clusters físicos distintos.
