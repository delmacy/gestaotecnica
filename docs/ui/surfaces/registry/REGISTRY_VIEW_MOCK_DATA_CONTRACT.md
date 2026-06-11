# Registry View Mock Data Contract

## Tipos Conceituais

- `RegistryItem`: O objeto principal representando um item no registry.
- `RegistryItemType`: Enum/String Literal para o tipo de item (capability, dependency_rule, capability_model, entity_model, process_model, document_contract, decision, view_contract).
- `RegistryItemStatus`: Enum/String Literal para o status (documented, needs_review, ready_for_design, future, blocked).
- `RegistryDependency`: Objeto ou string representando uma dependência (id ou slug).
- `RegistryDocumentLink`: Objeto com url e label para links documentais.
- `RegistryRisk`: Enum/String Literal para nível de risco (low, medium, high, critical).
- `RegistryRuleReference`: Objeto ou string para regras.

## Campos Mínimos de RegistryItem

- `id`: string
- `name`: string
- `slug`: string
- `type`: RegistryItemType
- `description`: string
- `status`: RegistryItemStatus
- `source_document`: string (opcional)
- `related_capability`: string (opcional)
- `depends_on`: array de strings (slugs)
- `used_by`: array de strings (slugs)
- `rules`: array de strings (referências)
- `document_links`: array de RegistryDocumentLink
- `risk_level`: RegistryRisk
- `notes`: string (opcional)
- `synthetic`: boolean (indicador se é dado mockado/sintético)
