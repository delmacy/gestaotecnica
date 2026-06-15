# POST-MERGE REVIEW: PKG-FORM-BUILDER-CONTRACTS-PERSISTENCE-001

## Identificação
- **Package ID:** PKG-FORM-BUILDER-CONTRACTS-PERSISTENCE-001
- **PR Original:** #175
- **PR Corretivo:** #179
- **Módulo:** form-builder
- **Tipo:** Post-merge correction

## Resumo da Revisão
Esta revisão formaliza a auditoria pós-merge do pacote de contratos e persistência do Form Builder, validando a migração do framework de testes e documentando divergências conhecidas.

## Arquivos Alterados (Total)
### Produção (PR #175)
- `src/components/builder/form-builder/schema/field-schema.ts`
- `src/components/builder/form-builder/schema/layout-schema.ts`
- `src/components/builder/form-builder/schema/form-schema.ts`
- `src/components/builder/form-builder/contracts/form-definition-contract.ts`
- `src/components/builder/form-builder/persistence/form-persistence-port.ts`
- `src/components/builder/form-builder/persistence/in-memory-form-persistence.ts`

### Testes e Documentação (PR #179)
- `tests/unit/form-builder-contracts.test.ts`
- `tests/unit/form-builder-persistence.test.ts`
- `docs/agent-work/reviews/PKG-FORM-BUILDER-CONTRACTS-PERSISTENCE-001_POST_MERGE_REVIEW.md`

## Verificação de Testes
Os testes foram migrados de `vitest` para `node:test` e `node:assert`, garantindo compatibilidade com o padrão do repositório.

### Cobertura Garantida:
- [x] Formulário mínimo válido
- [x] Formulário completo válido
- [x] Rejeição de field key duplicada
- [x] Rejeição de field id duplicado
- [x] Consistência layout -> field
- [x] Consistência visibility rule -> field key
- [x] Compatibilidade de `defaultValue` com o tipo do campo
- [x] Exigência de `options` para campos de seleção
- [x] JSON Round trip (serialização/desserialização)
- [x] Operações CRUD (Save, Load, List, Delete)
- [x] Cópia defensiva (save/load) para evitar mutação externa

## Auditoria de Tenancy (Persistência)
**Status:** GAP IDENTIFICADO
- **Análise:** O adapter `InMemoryFormPersistence` atual não implementa isolamento por `workspace_id`. Embora a interface `FormPersistencePort` ainda não exija explicitamente o `workspace_id` nos métodos de carga e listagem, a ausência de filtragem por contexto de tenant é um gap para produção.
- **Risco:** HIGH (caso a interface prometa isolamento, o que não ocorre explicitamente ainda, mas é esperado pela arquitetura da plataforma).
- **Recomendação:** Criar pacote corretivo separado para injetar `workspace_id` nas operações de persistência e atualizar o adapter.

## Divergência Studio × Contrato Canônico
**Status:** MEDIUM (Documentado)
- **Observação:** O componente `FormBuilderStudio.tsx` permanece como um mock visual e ainda não consome o contrato canônico `FormDefinition`.
- **Impacto:** Não bloqueante para esta fase de contratos.
- **Recomendação:** Obrigatório para o futuro pacote de integração do Studio.

## Decisão Final
**APPROVE_POST_MERGE_WITH_NOTES**

### Notas:
1. Migração para `node:test` concluída com sucesso.
2. Divergência do Studio documentada como item futuro.
3. Gap de isolamento por workspace em memória registrado.
