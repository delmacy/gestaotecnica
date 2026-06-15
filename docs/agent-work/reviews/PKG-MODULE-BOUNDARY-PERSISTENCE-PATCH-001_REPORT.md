# Implementation Report - PKG-MODULE-BOUNDARY-PERSISTENCE-PATCH-001

## Identificação
- **Package ID:** PKG-MODULE-BOUNDARY-PERSISTENCE-PATCH-001
- **Module:** architecture-governance
- **Type:** post-merge corrective patch
- **Base SHA:** fbc7452dfc660f94235004eb87f55581845bfcb9
- **Head SHA:** (current branch commit)

## Objetivo
Corrigir a regra de fronteira arquitetural da camada de persistência do Form Builder para permitir imports internos legítimos (contracts, schema, view-model) e rejeitar acoplamentos indevidos (db, runtime, events, UI externa).

## Alterações

### Arquitetura e Testes
- **tests/unit/module-boundaries.test.ts**:
    - Refinada a regra "Form Builder Persistence boundaries" para remover a proibição genérica de `src/components`.
    - Adicionadas proibições específicas para `src/db`, `src/platform/events`, `next`, `react` e componentes de UI/outros builders.
    - Removidas 3 entradas do `baseline` que eram falsos positivos.
    - Adicionados novos testes de unidade focados para validar permissões e proibições da camada de persistência, incluindo testes explícitos para rejeição de Runtime, Events, App, Next.js e React.
- **docs/architecture/MODULE_BOUNDARY_MATRIX.md**:
    - Atualizada a matriz para refletir que a persistência pode depender de `Form Builder Contracts, Schema, View-Model`.

## Verificação
- **Contagem do Baseline:**
    - Antes: 26 entradas
    - Depois: 23 entradas
    - Redução líquida: 3 entradas (somente as falsas violações do Form Builder foram removidas).
- **Testes de Unidade:** `npx tsx --test tests/unit/module-boundaries.test.ts` -> 15 pass, 0 fail.
- **Build:** `npm run build` -> Sucesso.

## Relação com a evidência original
Este patch corrige a regressão introduzida no PR #189, onde a regra de isolamento da persistência era excessivamente restritiva, impedindo a comunicação com contratos e modelos do próprio módulo.
