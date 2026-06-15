# Audit Report: Module Boundary Verification (PKG-MODULE-BOUNDARY-VERIFICATION-001)

## Identificação
- **Package ID:** PKG-MODULE-BOUNDARY-VERIFICATION-001
- **Base SHA:** f1a51d7f914bcb5697d28c7c712f285db918b231
- **Head SHA:** (TBD - Current Branch: test/pkg-module-boundary-verification-001)

## Resumo da Auditoria
Implementação de verificação automatizada de fronteiras entre módulos para garantir o isolamento arquitetural e evitar acoplamento prematuro.

## Matriz Aplicada
Conforme definido em `docs/architecture/MODULE_BOUNDARY_MATRIX.md`.

| Camada | Regra de Isolamento |
|---|---|
| **Shared Contracts** | Proibido importar Runtime, Events, UI, Banco, Next.js. |
| **Events** | Proibido importar Runtime, UI, Banco, Next.js. |
| **Runtime** | Proibido importar Event Services, UI, Banco, Next.js. |
| **Form Builder** | Contratos isolados de Runtime e Banco. Adapters isolados de persistência concreta. |
| **Registry** | Proibido depender de UI, Runtime ou Banco diretamente. |

## Violações Encontradas

Foram detectadas **18 violações críticas** (BLOCKER/HIGH) e múltiplas violações de média severidade (MEDIUM).

### Violações Críticas (Baseline)

As seguintes violações foram identificadas no código atual e registradas como baseline para permitir a continuidade da automação:

| Arquivo | Import | Regra Violada | Severidade |
|---|---|---|---|
| `src/platform/events/event-log-service.ts` | `@/db` | Events boundaries | BLOCKER |
| `src/platform/events/event-log-service.ts` | `@/db/runtime/schema/workflow` | Events boundaries | BLOCKER |
| `src/platform/registry/actions/kernel-actions.ts` | `@/db` | Registry boundaries | HIGH |
| `src/platform/registry/actions/kernel-actions.ts` | `@/db/platform/schema/registry` | Registry boundaries | HIGH |
| `src/platform/registry/application/seed.ts` | `@/db` | Registry boundaries | HIGH |
| `src/platform/registry/application/seed.ts` | `@/db/platform/schema/registry` | Registry boundaries | HIGH |
| `src/platform/registry/infra/registry.queries.ts` | `@/db` | Registry boundaries | HIGH |
| `src/platform/registry/infra/registry.queries.ts` | `@/db/platform/schema/registry` | Registry boundaries | HIGH |
| `src/platform/workflows/application/kernel-actions.ts` | `@/db` | Runtime boundaries | BLOCKER |
| `src/platform/workflows/infra/flow-runner-service.ts` | `@/db` | Runtime boundaries | BLOCKER |
| `src/platform/workflows/infra/flow-runner-service.ts` | `@/db/runtime/schema/workflow` | Runtime boundaries | BLOCKER |
| `src/platform/workflows/runtime.ts` | `@/db` | Runtime boundaries | BLOCKER |

### Violações de Importação Profunda (MEDIUM)
Detectadas centenas de ocorrências onde módulos importam arquivos internos de outros módulos em vez de usar o `index.ts` público.
Exemplo: `src/platform/blueprints/infra/blueprints.queries.ts -> @/db/platform/schema/blueprints`.

## Testes Realizados
- **Unitário:** `npx tsx --test tests/unit/module-boundaries.test.ts`
- **Build:** `npm run build` (verificado que as novas ferramentas de teste não quebram o build).

## Limitações
- A detecção de imports é baseada em Regex, o que pode falhar em casos extremamente complexos de concatenação de strings (embora improvável em imports TS).
- A verificação de "Circular Dependency" é simplificada e foca no acoplamento direto entre módulos proibidos.

## Pacotes Corretivos Recomendados
1. **PKG-ARCH-FIX-EVENTS-DB:** Desacoplar `event-log-service` do banco de dados através de interfaces de repositório.
2. **PKG-ARCH-FIX-RUNTIME-DB:** Implementar persistência do Runtime via ports/adapters para remover dependência direta do `@/db`.
3. **PKG-ARCH-FIX-REGISTRY-DB:** Isolar o Registry da camada de persistência concreta.
4. **PKG-ARCH-CLEANUP-DEEP-IMPORTS:** Refatoração em massa para utilizar os pontos de entrada públicos dos módulos.

## Conclusão
A infraestrutura de teste está operacional e integrada. Novas violações críticas impedirão a passagem dos testes em PRs futuras, garantindo a governança da arquitetura daqui em diante.
