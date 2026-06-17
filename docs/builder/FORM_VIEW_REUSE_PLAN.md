# Plano de Reutilização: Form Builder e View Builder

Este plano detalha a estratégia para extração de contratos e desenvolvimento de runtimes para os módulos de Builder UI.

## 1. Proposta de Movimentação de Arquivos

Identificamos que diversos contratos residem atualmente em diretórios de componentes de UI. Propomos a seguinte migração:

### Forms
- **De**: `src/components/builder/form-builder/schema/*.ts`
- **Para**: `src/platform/forms/contracts/*.ts`
- **Justificativa**: Estes schemas definem a estrutura de dados de formulários que devem ser validados no servidor e por runtimes de execução, independentemente da UI do Builder.

### Views
- **De**: `src/components/builder/view-builder/view-builder-types.ts`
- **Para**: `src/platform/views/contracts/view-blueprint.ts`
- **Justificativa**: O blueprint de uma view é o contrato entre a definição visual e a engine de query que recupera os dados.

## 2. Pacotes Recomendados (Roadmap)

### PKG-FORM-CONTRACT-EXTRACTION-001
- **Objetivo**: Mover schemas Zod de formulários para `platform`.
- **Escopo**: `FormFieldTypeSchema`, `FieldDefinitionSchema`, `ValidationRuleSchema`, `FormDefinitionSchema`.
- **Dependências**: Nenhuma.

### PKG-VIEW-CONTRACT-EXTRACTION-001
- **Objetivo**: Converter tipos de View em schemas Zod e mover para `platform`.
- **Escopo**: `ViewBlueprintSchema`, `ViewFieldSchema`, `ViewActionSchema`.
- **Dependências**: Nenhuma.

### PKG-FORM-RUNTIME-RENDERER-001
- **Objetivo**: Estabilizar o `DynamicFormRenderer` e integrá-lo com os novos contratos da `platform`.
- **Escopo**: Implementar suporte completo a todos os `FormFieldType` no renderer.
- **Dependências**: PKG-FORM-CONTRACT-EXTRACTION-001.

### PKG-VIEW-RUNTIME-RENDERER-001
- **Objetivo**: Criar um renderer de views real que substitua o `ViewCanvas` (mock).
- **Escopo**: Criar `DynamicViewRenderer` capaz de interpretar um `ViewBlueprint` e renderizar tabelas/grids reais.
- **Dependências**: PKG-VIEW-CONTRACT-EXTRACTION-001.

### PKG-DATA-BINDING-CONTRACT-001
- **Objetivo**: Formalizar como campos de formulários e colunas de views se ligam a entidades e capacidades.
- **Escopo**: Unificar `FormBinding` e `ViewBinding` em um contrato de plataforma único.
- **Dependências**: PKG-FORM-CONTRACT-EXTRACTION-001, PKG-VIEW-CONTRACT-EXTRACTION-001.

## 3. Avaliação de Acoplamento

- **Acoplamento Adequado**: A separação entre `FormBuilderStudio` (UI) e os schemas em `schema/` (Dados) está bem encaminhada, facilitando a extração.
- **Acoplamento Inadequado**: O `ViewCanvas.tsx` contém lógica de "mock" misturada com o que deveria ser um renderer. A interface `ViewBlueprint` está em um arquivo de "types" dentro da pasta de componentes, dificultando o uso por Utility Apps que não querem importar componentes de UI.

## 4. Reutilização por Utility Apps

Utility Apps podem reutilizar imediatamente:
1. `FieldDefinitionSchema` para definir parâmetros de entrada de calculadoras.
2. `ValidationRuleSchema` para validar inputs de regras de decisão.
3. Futuro: `DynamicFormRenderer` para gerar interfaces de configuração de Utility Apps automaticamente.
