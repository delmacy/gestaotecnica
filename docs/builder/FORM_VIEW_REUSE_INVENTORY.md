# Inventário de Reutilização: Form Builder e View Builder

Este documento mapeia os ativos atuais do Form Builder e View Builder, classificando sua maturidade, dependências e potencial de reutilização.

## 1. Tabela de Ativos

| Ativo | Classificação | Caminho | Símbolo | Dependências | Maturidade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FormFieldTypeSchema** | CONTRACT | `src/components/builder/form-builder/schema/field-schema.ts` | `FormFieldTypeSchema` | Zod | Alta |
| **FieldDefinitionSchema** | CONTRACT | `src/components/builder/form-builder/schema/field-schema.ts` | `FieldDefinitionSchema` | Zod | Alta |
| **ValidationRuleSchema** | CONTRACT | `src/components/builder/form-builder/schema/field-schema.ts` | `ValidationRuleSchema` | Zod | Alta |
| **FormDefinitionSchema** | CONTRACT | `src/components/builder/form-builder/schema/form-schema.ts` | `FormDefinitionSchema` | Zod | Alta |
| **FormLayoutSchema** | CONTRACT | `src/components/builder/form-builder/schema/layout-schema.ts` | `FormLayoutSchema` | Zod | Alta |
| **ViewType** | CONTRACT | `src/components/builder/view-builder/view-builder-types.ts` | `ViewType` | N/A | Média |
| **ViewBlueprint** | CONTRACT | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBlueprint` | TypeScript | Média |
| **FormBuilderStudio** | UI_COMPONENT | `src/components/builder/form-builder/FormBuilderStudio.tsx` | `FormBuilderStudio` | React, Lucide | Experimental |
| **ViewBuilderStudio** | UI_COMPONENT | `src/components/builder/view-builder/ViewBuilderStudio.tsx` | `ViewBuilderStudio` | React, Lucide | Experimental |
| **DynamicFormRenderer** | RUNTIME | `src/platform/forms/components/DynamicFormRenderer.tsx` | `DynamicFormRenderer` | react-hook-form | Parcial |
| **FormEngine** | RUNTIME | `src/features/builder/forms/form.engine.ts` | `validateFormDefinition` | Zod | Estável |
| **ViewEngine** | RUNTIME | `src/platform/views/view-engine.ts` | `getAvailableActionsForEntity` | N/A | Inicial |
| **MOCK_FORM_BUILDER_DATA** | MOCK | `src/components/builder/form-builder/form-builder-data.ts` | `MOCK_FORM_BUILDER_DATA` | N/A | Estático |
| **VIEW_BLUEPRINTS** | MOCK | `src/components/builder/view-builder/view-builder-data.ts` | `VIEW_BLUEPRINTS` | N/A | Estático |
| **FormPreviewPanel** | PREVIEW_ONLY | `src/components/builder/form-builder/FormPreviewPanel.tsx` | `FormPreviewPanel` | React | Mock-only |
| **ViewCanvas** | PREVIEW_ONLY | `src/components/builder/view-builder/ViewCanvas.tsx` | `ViewCanvas` | React | Mock-only |
| **FormPersistence** | EXPERIMENTAL | `src/components/builder/form-builder/persistence/form-persistence-port.ts` | `FormPersistencePort` | N/A | Inicial |

## 2. Detalhamento de Consumo e Reuso

| Ativo | Consumidores Atuais | Reuso PROPOSED |
| :--- | :--- | :--- |
| **FieldDefinitionSchema** | `FormDefinitionSchema` | `DynamicFormRenderer` (runtime completo), Utility Apps (human-facing input) |
| **FormDefinitionSchema** | `studio-adapter.ts` | Server-side form validation, Process Instance execution |
| **ViewBlueprint** | `ViewBuilderStudio.tsx`, `ViewCanvas.tsx`, `ViewBlueprintList.tsx` | `DynamicViewRenderer` (a ser criado), Data Query Engine |

## 3. Perguntas Obrigatórias

1. **Quais schemas são independentes de React?**
   - Todos os schemas Zod em `src/components/builder/form-builder/schema/` e a lógica de engine em `src/features/builder/forms/form.engine.ts`.

2. **Quais tipos estão acoplados à UI?**
   - Tipos de props de componentes e estados internos do Studio (ex: `StudioState` em `src/components/builder/form-builder/view-model/studio-state.ts`).

3. **Existe renderer real de formulários?**
   - O `DynamicFormRenderer.tsx` em `src/platform/forms/components/` é um runtime parcial. Suporta campos de texto, textarea e número com validação Zod e `react-hook-form`. **Não suporta**: upload de arquivos, multi-seleção, regras de visibilidade condicional complexas ou lógica de submissão persistente.

4. **Existe renderer real de views?**
   - Não. O `ViewCanvas` em `src/components/builder/view-builder/ViewCanvas.tsx` é um mock visual. O `ViewEngine` em `src/platform/views/view-engine.ts` implementa apenas descoberta de ações (`getAvailableActionsForEntity`), não sendo um motor de renderização ou consulta de dados.

5. **Existe binding real com dados?**
   - Não. Os contratos de binding existem nos Blueprints, mas não há implementação de runtime que resolva esses caminhos para dados reais de banco.

6. **Quais partes usam dados sintéticos?**
   - `FormCanvas`, `FormPreviewPanel` e `ViewCanvas`.

7. **Existe persistência de blueprint?**
   - Apenas uma implementação experimental `in-memory` em `src/components/builder/form-builder/persistence/`. Não há persistência SQL para definições de builder.

8. **Utility Apps poderiam reutilizar quais contratos?**
   - Form field contracts may be reused for human-facing input schemas where appropriate; they are not the universal Utility App I/O contract. Utility App outputs may be structured objects, collections, diagnostics, comparison diffs or machine-oriented payloads not covered by form schemas.

9. **Quais contratos precisam migrar de components para platform?**
   - Schemas Zod de formulários em `src/components/builder/form-builder/schema/` e definições de blueprint de views em `src/components/builder/view-builder/view-builder-types.ts`.

10. **Quais mudanças quebrariam compatibilidade?**
    - Alteração de chaves obrigatórias nos schemas sem migração de dados legados ou adaptadores de compatibilidade.

## 4. Classificação e Totais de Ativos
- **CONTRACT**: 7
- **UI_COMPONENT**: 2
- **RUNTIME**: 3
- **MOCK**: 2
- **PREVIEW_ONLY**: 2
- **EXPERIMENTAL**: 1
- **PROPOSED**: 0 (Relações de reuso futuro marcadas separadamente)
- **Total**: 17
