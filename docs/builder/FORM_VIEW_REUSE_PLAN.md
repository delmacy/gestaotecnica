# Plano de Reutilização: Form Builder e View Builder

## 1. Estratégia de Extração de Contratos

Para evitar quebras de compatibilidade e garantir uma transição suave, a extração deve seguir estas diretrizes:
- **Inventário de Dependências**: Antes da movimentação, realizar um mapeamento exaustivo de todos os arquivos que importam os contratos atuais.
- **Adaptadores de Compatibilidade**: Manter re-exports nos caminhos originais (`src/components/builder/...`) apontando para os novos locais na `platform`.
- **Preservação de Escopo**: A extração deve ser puramente estrutural, sem redesenho de schemas na mesma fase.

## 2. Roadmap Sugerido

### PKG-FORM-CONTRACT-EXTRACTION
- **Objetivo**: Mover schemas Zod de formulários para `src/platform/forms/contracts/`.
- **Estratégia**: Implementar re-exports para compatibilidade.

### VIEW-CONTRACT-INVENTORY/EXTRACTION
- **Objetivo**: Mover as interfaces TypeScript de Views para `src/platform/views/contracts/`.
- **Nota**: Preservar a natureza TypeScript das interfaces para garantir comportamento idêntico ao atual.

### VIEW-ZOD-SCHEMA-DESIGN
- **Objetivo**: Criar validadores Zod para blueprints de Views.
- **Nota**: Tratado como fase separada da extração para evitar efeitos colaterais em runtimes que esperam tipos puros.

### PKG-DATA-BINDING-CONTRACT
- **Objetivo**: Unificação dos contratos de binding entre formulários, views e capacidades.

## 3. Avaliação de Runtimes

- **Form Runtime**: O `DynamicFormRenderer` deve ser expandido para cobrir tipos de campo avançados (file, multiselect) e interpretar regras de visibilidade definidas no schema.
- **View Runtime**: Necessita da criação de um `QueryEngine` que interprete o `ViewBlueprint` para buscar dados reais, substituindo a lógica de mock atual do `ViewCanvas`.
