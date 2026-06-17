# Report: Inventário de Reutilização de Form Builder e View Builder

## Identificação
- **Package ID**: PKG-BUILDER-UI-CONTRACT-REUSE-INVENTORY-001
- **Module**: builder-ui
- **Status**: Documentation-only inventory complete
- **Base SHA**: d747fff7398c6be62bf5f347410934d940695368

## Ativos Encontrados

Mapeamos um total de 18 ativos principais entre contratos, componentes e runtimes.

### Quantidade por Classificação
- **CONTRACT**: 8 (Primitivos de campo, Definições de formulário, Blueprints de View)
- **UI_COMPONENT**: 4 (Studios, Palettes, Canvas)
- **RUNTIME**: 3 (DynamicFormRenderer, FormEngine, ViewEngine)
- **MOCK**: 2 (Dados estáticos de demonstração)
- **PREVIEW_ONLY**: 1 (Preview de formulários focado em mock)

## Acoplamentos Identificados

1. **Contratos em Pastas de UI**: Os schemas Zod para formulários estão localizados em `src/components/builder/form-builder/schema`, o que impede sua utilização em ambientes puramente backend ou por Utility Apps sem arrastar dependências de componentes.
2. **Lógica de Mock no Canvas**: O `ViewCanvas.tsx` mistura a visualização estrutural com a geração de dados "falsos" (pulse animation), dificultando a evolução para um renderer real.
3. **Engine Desconectada**: Existe um `DynamicFormRenderer` na `platform`, mas o Form Builder ainda utiliza seu próprio `FormPreviewPanel` baseado em mocks estáticos.

## Riscos

- **Inconsistência de Tipos**: Existem definições de `FormFieldType` ligeiramente diferentes entre o Builder (`form-builder-types.ts`) e o Schema Zod (`field-schema.ts`).
- **Bloqueio de Utility Apps**: Enquanto os contratos de campo não forem movidos para a `platform`, o desenvolvimento de Utility Apps (como calculadoras dinâmicas) ficará redundante ou acoplado à UI.

## Sequência Recomendada

1. **Extração Imediata**: Mover `src/components/builder/form-builder/schema/` para `src/platform/forms/contracts/`.
2. **Zodificação de Views**: Criar schemas Zod para `ViewBlueprint` em `src/platform/views/contracts/`.
3. **Unificação de Renderers**: Migrar o Preview do Builder para utilizar o `DynamicFormRenderer` da plataforma.
4. **Binding Real**: Implementar a camada de `DataSource` que ligue os Blueprints a dados reais do banco/kernel.
