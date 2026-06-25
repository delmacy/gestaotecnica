# Relatório de Baseline Comum das 6 Frentes (System Builder)

**ID:** TASK-SB-P0-BASELINE-COMUM-001
**Frente:** Marco P0 - Baseline comum das 6 frentes System Builder
**Objetivo:** Fotografia operacional reprodutível da main atual antes de expandir o paralelismo em Persistência, Workflow, Segurança, Builder UI, Gestão Técnica e Qualidade/CI.

## 1. Identificação do Baseline
- **Commit-base:** `f5b7e117f937451b7fb3419831a7289d01dd58e7`
- **Branch-base:** `main`

## 2. Inventário e Matriz de Comandos (Local Sandbox)

A matriz a seguir reflete a execução das validações na sandbox no momento do baseline.

| Comando | Executado | Resultado | Duração Aprox. | Evidência/Motivo/Bloqueio Real |
|---------|-----------|-----------|----------------|--------------------------------|
| `npm ci` | Sim | Passou | 23s | Instalou as dependências. |
| `npm run lint` | Sim | Falhou | ~14s | 647 problemas (54 errors, 593 warnings). A maioria são avisos `@typescript-eslint/no-unused-vars` e `@typescript-eslint/no-explicit-any`. |
| `npm run check:architecture` | Sim | Passou | <1s | "Validação de arquitetura aprovada!". |
| `npm run test:unit` | Sim | Falhou (2 testes) | ~13s | Pass: 815, Fail: 2 (tests 817). |
| `npm run test:integration` | Sim | Falhou | ~11s | "Agent Gateway Idempotency Integration Tests" falhou (3 subtests falharam). |
| `npm run build` | Sim | Passou | ~42s | "Compiled successfully in 22.2s. Finished TypeScript in 19.9s" |
| `npm run db:bootstrap` | Sim | Passou | <1s | O bootstrap encerra com "Bootstrap complete." (schemas ignorados pois já existem). |
| `npm run db:validate` | Sim | Passou | <2s | "Nenhuma operação com --force permitida. Migrações validadas e seguras para prosseguir." |
| `npm run test:e2e` | Sim | Falhou (8 testes) | ~5s | Falhas devido a questões de contexto de sessão/autenticação local no Playwright. |

## 3. Contratos Compartilhados Atuais (Domínio System Builder / Runtime)

| Contrato | Arquivo Principal Identificado |
|----------|---------------------------------|
| `WorkspaceContext` | `src/platform/workspace/workspace-context.ts` (e refs em `src/platform/contracts/workspace.ts`) |
| `AuthenticatedActor` | Usado primariamente com as views; não encontrado um contrato base explicitamente exportado como "AuthenticatedActor" nas tipagens isoladas da raíz, apenas refs internas de auth. |
| `ActionDefinition` | `src/platform/actions/action-types.ts` |
| `ActionExecutionResult` | `src/platform/actions/action-types.ts` (e refs em `action-runner.ts`) |
| `DomainEvent` | `src/platform/events/event-log-service.ts` |
| `ProcessDefinition` | `src/platform/workflows/contracts/process-definition.ts` |
| `ProcessInstance` | `src/features/workflow/runtime/runtime.types.ts` (bem como mapper/types em `src/platform/workflows/runtime/types/process-instance.ts`) |
| `CapabilityDefinition` | Referenciado em relatórios em `docs/capabilities/`, mas contrato TypeScript `export interface CapabilityDefinition` explícito não mapeado. |
| `FormDefinition` | `src/platform/forms/contracts/form-definition.ts` |
| `TimelineEntry` | `src/builder/shell/platform-timeline.tsx` |

## 4. Riscos Imediatos, Bloqueios e Dependências CI

1. **Estado do Repositório (Branches & Actions):**
   - Automações estão com comportamentos mistos no ambiente puramente de sandbox local, visto as limitações sem instâncias puras de postgres para testes locais e timeouts.
   - Existem ramificações de frentes avançando em paralelo (ex: TASK-SB-PHASE-2-FRONTEND-PARITY-AUDIT).

2. **Riscos Relacionados ao Paralelismo (6 Frentes):**
   - **Frente Qualidade/CI:** A mais impactada pelos testes falhando. Precisa ser estabilizada para não bloquear outras frentes.
   - **Frente Persistência:** Precisa lidar ativamente com as limitações de BD, N+1 e falta de RLS identificados em `AUDIT_REPORT.md`.
   - **Frente Segurança:** Precisará sanar a falta de RLS nativo do postgres nas queries.
   - **Frentes Workflow/Actions & Builder UI:** Precisarão resolver warnings de lint e estruturar os actions engine em cima das fundações fortes.
   - **Gestão Técnica (App Client):** Altamente dependente do Frontend Parity e contratos.

3. **Bloqueio Operacional de Ferramental GitHub:**
   - O `gh` CLI na sandbox está ausente (`gh: command not found`). Rastreabilidade nas 6 frentes não pôde gerar Issues ou manipular GitHub Projects nativamente por aqui. A atualização de tracking é restrita a arquivos markdown de BOARD/PRs.

## 5. Ordem de Integração Recomendada para o Paralelismo Ampliado

Dada as evidências atuais de falhas de testes e de integrações:

1. **Qualidade/CI:** Fixar lint (ou suprimir), reparar testes unitários/integrados falhos.
2. **Persistência:** Elevar nível dos dados, aplicar migrações e estabilizar schemas.
3. **Segurança:** Implementar Row Level Security.
4. **Workflow/Actions:** Subir a lógica sobre a base segura.
5. **Builder UI:** Utilizando o workflow e actions já tipados e seguros.
6. **Gestão Técnica (Domain Apps):** Sendo os consumidores finais.