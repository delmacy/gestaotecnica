# Report: PKG-UTILITY-APP-AS-IS-INVENTORY-001 (Revised)

## Identificação
- **Package ID:** `PKG-UTILITY-APP-AS-IS-INVENTORY-001`
- **Módulo:** `utility-apps`
- **Status:** Documentation-only inventory (REVISED)

## Resumo das Correções
O inventário foi revisado para garantir rastreabilidade total ao código real, distinguindo claramente entre ativos confirmados, parciais e propostos.

### Ativos Confirmados (Traceable)
- **Builders Schemas:** `FormFieldTypeSchema`, `ValidationRuleSchema`, `FieldDefinitionSchema` (`src/components/builder/form-builder/schema/field-schema.ts`).
- **View Contracts:** `ViewBlueprint`, `ViewType`, `ViewFilter`, `ViewBinding`, `DataSourceMode` (`src/components/builder/view-builder/view-builder-types.ts`).
- **Registry Schema:** `module_versions.config_schema` (`src/db/platform/schema/registry.ts`).

### Ativos Downgraded / Parciais
- **Action Registry/Runner:** Confirmada a existência física dos arquivos (`src/platform/actions/`), mas rotulados como `PARTIAL` por não possuírem persistência em banco ou sandboxing para Utility Apps específicos.
- **View Engine:** Confirmado (`src/platform/views/view-engine.ts`), mas focado em ações de entidade, não utilitários genéricos.
- **Traceability Integration:** O hashing é um primitivo confirmado, mas a governança de regras (Rule Provenance) é `PROPOSED`.

### Ativos Movidos para Propostos (Gaps)
- **Dataset Entities:** Não existem tabelas ou contratos para dados tabulares puros.
- **Formula Engine:** Existe o contrato (`ProcessEdgeConditionSchema`), mas não o executor.
- **CSV/Excel Importer:** Ausência total de implementação.

## Conclusão da Revisão
A arquitetura atual oferece contratos de UI sólidos, mas carece de infraestrutura de persistência e execução de lógica para Utility Apps. O roadmap foi ajustado para priorizar esses novos motores de dados e execução.
