# Inventário de Reutilização: Form Builder e View Builder

Este documento mapeia os ativos atuais do Form Builder e View Builder, classificando sua maturidade, dependências e potencial de reutilização.

## 1. Ativos do Form Builder

| Ativo | Classificação | Caminho | Símbolo | Dependências | Maturidade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FormFieldTypeSchema** | CONTRACT | `src/components/builder/form-builder/schema/field-schema.ts` | `FormFieldTypeSchema` | Zod | Alta |
| **FieldDefinitionSchema** | CONTRACT | `src/components/builder/form-builder/schema/field-schema.ts` | `FieldDefinitionSchema` | Zod, `FormFieldTypeSchema`, `ValidationRuleSchema` | Alta |
| **ValidationRuleSchema** | CONTRACT | `src/components/builder/form-builder/schema/field-schema.ts` | `ValidationRuleSchema` | Zod | Alta |
| **FormDefinitionSchema** | CONTRACT | `src/components/builder/form-builder/schema/form-schema.ts` | `FormDefinitionSchema` | Zod, `FieldDefinitionSchema`, `FormLayoutSchema` | Alta |
| **FormBuilderStudio** | UI_COMPONENT | `src/components/builder/form-builder/FormBuilderStudio.tsx` | `FormBuilderStudio` | React, Lucide, Tailwind, UI Components | Experimental (MVP) |
| **FormCanvas** | UI_COMPONENT | `src/components/builder/form-builder/FormCanvas.tsx` | `FormCanvas` | React | Preview-focused |
| **FormPreviewPanel** | PREVIEW_ONLY | `src/components/builder/form-builder/FormPreviewPanel.tsx` | `FormPreviewPanel` | React | Mock-focused |
| **DynamicFormRenderer** | RUNTIME | `src/platform/forms/components/DynamicFormRenderer.tsx` | `DynamicFormRenderer` | React, react-hook-form | Inicial |
| **Form Engine** | RUNTIME | `src/features/builder/forms/form.engine.ts` | `validateFormDefinition` | Zod, `form.types.ts` | Estável (Lógica Pura) |
| **MOCK_FORM_BUILDER_DATA** | MOCK | `src/components/builder/form-builder/form-builder-data.ts` | `MOCK_FORM_BUILDER_DATA` | Nenhum | Estático |

## 2. Ativos do View Builder

| Ativo | Classificação | Caminho | Símbolo | Dependências | Maturidade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ViewType** | CONTRACT | `src/components/builder/view-builder/view-builder-types.ts` | `ViewType` | Nenhum (Typescript) | Média |
| **ViewBlueprint** | CONTRACT | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBlueprint` | `ViewField`, `ViewColumn`, `ViewBinding` | Média |
| **ViewBinding** | CONTRACT | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBinding` | Nenhum (Typescript) | Inicial |
| **DataSourceMode** | CONTRACT | `src/components/builder/view-builder/view-builder-types.ts` | `DataSourceMode` | Nenhum (Typescript) | Média |
| **ViewBuilderStudio** | UI_COMPONENT | `src/components/builder/view-builder/ViewBuilderStudio.tsx` | `ViewBuilderStudio` | React, Lucide, Tailwind | Experimental (MVP) |
| **ViewCanvas** | PREVIEW_ONLY | `src/components/builder/view-builder/ViewCanvas.tsx` | `ViewCanvas` | React | Mock-only |
| **ViewEngine** | RUNTIME | `src/platform/views/view-engine.ts` | `getAvailableActionsForEntity` | Kernel Actions | Inicial |
| **VIEW_BLUEPRINTS** | MOCK | `src/components/builder/view-builder/view-builder-data.ts` | `VIEW_BLUEPRINTS` | Nenhum | Estático |

## 3. Classificações de Dados e Modos

- **Synthetic**: Utilizado em `FormBlueprint.synthetic` e `ViewBlueprint.synthetic`. Indica dados gerados artificialmente para demonstração de interface sem backend real.
- **Mock**: Presente em `DataSourceMode` e `FormReadinessStatus`. Representa estados onde a UI está pronta mas os dados são estáticos.
- **Real_pending**: Estado onde o contrato espera integração real, mas a infraestrutura ainda não está disponível.

## 4. Perguntas Obrigatórias

1. **Quais schemas são independentes de React?**
   - Os schemas Zod em `src/components/builder/form-builder/schema/` (`field-schema.ts`, `form-schema.ts`, `layout-schema.ts`) e os tipos em `view-builder-types.ts`. A engine em `src/features/builder/forms/form.engine.ts` também é independente.

2. **Quais tipos estão acoplados à UI?**
   - Tipos de componentes props (ex: `FormCanvasProps`), tipos de estado de UI em `studio-state.ts` e tipos que incluem referências a ícones do Lucide ou componentes React (embora a maioria dos contratos de dados esteja limpa).

3. **Existe renderer real de formulários?**
   - Sim, `src/platform/forms/components/DynamicFormRenderer.tsx`. Ele utiliza `react-hook-form` e é capaz de renderizar campos dinamicamente com base em definições de campo.

4. **Existe renderer real de views?**
   - Não. O `ViewCanvas.tsx` é um mock visual que renderiza tabelas e kanbans "pulsantes" (animate-pulse) com dados sintéticos. Não existe um `DynamicViewRenderer` funcional.

5. **Existe binding real com dados?**
   - No Form Builder, existe o conceito de `FormBinding` nos contratos, mas a implementação no `FormBuilderStudio` é apenas visual. No View Builder, `ViewBinding` está definido mas não funcional.

6. **Quais partes usam dados sintéticos?**
   - O `FormCanvas`, `FormPreviewPanel` e `ViewCanvas` utilizam predominantemente `MOCK_FORM_BUILDER_DATA` e `VIEW_BLUEPRINTS`.

7. **Existe persistência de blueprint?**
   - Existe uma porta de persistência experimental: `src/components/builder/form-builder/persistence/form-persistence-port.ts`, com uma implementação `in-memory`. Não há persistência em banco de dados SQL implementada para blueprints de builder ainda.

8. **Utility Apps poderiar reutilizar quais contratos?**
   - `FieldDefinitionSchema`, `ValidationRuleSchema` e `FormFieldTypeSchema`. Utility Apps (como calculadoras) precisam de definições de entrada/saída que são idênticas às de formulários.

9. **Quais contratos precisam migrar de components para platform?**
   - Todos os arquivos de `src/components/builder/form-builder/schema/` e os tipos base de `src/components/builder/view-builder/view-builder-types.ts`. Eles são contratos de domínio, não componentes de UI.

10. **Quais mudanças quebrariam compatibilidade?**
    - Mudar o `id` ou `key` dos campos nos Blueprints existentes. Alterar a estrutura de `ValidationRuleSchema` sem prover migração para os dados JSONB armazenados (caso existissem).

## 5. Detalhamento de Ativos Críticos

### FieldDefinitionSchema
- **Caminho**: `src/components/builder/form-builder/schema/field-schema.ts`
- **Símbolo**: `FieldDefinitionSchema`
- **Entrada**: Objeto JSON puro.
- **Saída**: Objeto validado pelo Zod.
- **Consumidores**: `FormDefinitionSchema`, `FormBuilderStudio`, `DynamicFormRenderer` (futuro).
- **Maturidade**: Alta.
- **Limitações**: Focado em tipos primitivos, referências complexas ainda são "placeholders".

### ViewBlueprint
- **Caminho**: `src/components/builder/view-builder/view-builder-types.ts`
- **Símbolo**: `ViewBlueprint`
- **Entrada**: Interface TypeScript.
- **Saída**: N/A (Tipo apenas).
- **Consumidores**: `ViewBuilderStudio`, `ViewCanvas`, `VIEW_BLUEPRINTS`.
- **Maturidade**: Média (Falta validação Zod).
- **Limitações**: Muito acoplado a conceitos visuais (colunas, ordenação) sem uma engine de query correspondente no runtime.
