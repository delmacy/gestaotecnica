# Report: Inventário de Reutilização de Form Builder e View Builder

## Identificação
- **Package ID**: PKG-BUILDER-UI-CONTRACT-REUSE-INVENTORY-001
- **Module**: builder-ui
- **Base SHA**: d747fff7398c6be62bf5f347410934d940695368

## Ativos Encontrados (Recalculado)

| Categoria | Quantidade | Descrição |
| :--- | :--- | :--- |
| **CONTRACT** | 7 | Schemas Zod de Form e Interfaces de View |
| **UI_COMPONENT** | 2 | Studios (Autoria) |
| **RUNTIME** | 3 | Renderers parciais e Engines de lógica |
| **MOCK** | 2 | Dados estáticos |
| **PREVIEW_ONLY** | 2 | Visualizadores baseados em mock |
| **EXPERIMENTAL** | 1 | Persistência experimental em memória |
| **Total** | **17** | |

## Observações Críticas de Reuso

1. **Escopo de Utility Apps**: Contratos de formulário são reutilizáveis apenas para inputs humanos. Outputs de Utility Apps requerem modelos de dados específicos (payloads de máquina) que não devem ser forçados para o schema de formulário.
2. **Diferenciação de Engines**: O `ViewEngine` atual provê descoberta de ações, não sendo um motor de renderização ou query.
3. **Maturidade do Renderer**: O `DynamicFormRenderer` suporta apenas tipos primitivos (`text`, `number`, `textarea`), faltando paridade com as capacidades do Builder UI.

## Sequência Recomendada

1. Inventário de dependências e extração de contratos de Form com estratégia de re-export.
2. Extração de interfaces TypeScript de View (Behavior-preserving).
3. Design de schemas Zod para Views (Fase distinta).
4. Expansão do `DynamicFormRenderer` para suporte completo a tipos e visibilidade.
