# Plano de Implementação Futura: Utility Apps

Este documento descreve a sequência recomendada de pacotes para a implementação do ecossistema de Utility Apps, baseando-se no inventário de ativos e lacunas identificadas.

## Sequência de Pacotes

| Ordem | Pacote | Objetivo | Dependências | Risco | Paralelismo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **PKG-UTILITY-APP-CORE-CONTRACT-001** | Definir o envelope canônico de Utility Apps e seus metadados básicos. | Nenhuma | Baixo | Sim |
| 2 | **PKG-DATASET-DEFINITION-CONTRACT-001** | Definir o esquema para datasets tabulares e seu versionamento. | Core Contract | Médio | Sim |
| 3 | **PKG-DATASET-ROW-SCHEMA-001** | Contrato para linhas e células, incluindo suporte a tipos complexos. | Dataset Contract | Baixo | Sim |
| 4 | **PKG-FORMULA-DEFINITION-CONTRACT-001** | Padronizar a definição de expressões matemáticas e lógicas isoladas. | Core Contract | Médio | Não |
| 5 | **PKG-LOOKUP-DEFINITION-CONTRACT-001** | Contrato específico para utilitários de busca (Key-Value/Search). | Dataset Contract | Baixo | Sim |
| 6 | **PKG-DECISION-TABLE-CONTRACT-001** | Definir o esquema para tabelas de decisão e matrizes lógicas. | Formula Contract | Médio | Sim |
| 7 | **PKG-UTILITY-VIEW-CONTRACT-001** | Estender `ViewBlueprint` para suportar visualizações técnicas específicas. | View Builder | Baixo | Sim |
| 8 | **PKG-DATASET-IMPORT-PORT-001** | Interface (Port) para ingestão de dados via CSV/Planilha. | Dataset Contract | Alto (Parsers) | Não |
| 9 | **PKG-UTILITY-APP-EXECUTION-PORT-001** | Runner para execução de Utility Apps (Sandbox de lógica). | Action Runner | Alto (Segurança) | Não |
| 10 | **PKG-UTILITY-APP-PROVENANCE-001** | Integração com `Traceability` para registrar origem de regras e aprovações. | Traceability | Baixo | Sim |

---

## Detalhamento dos Pacotes

### 1. PKG-UTILITY-APP-CORE-CONTRACT-001
- **Objetivo:** Criar a estrutura base `UtilityAppDefinition`.
- **Owned Paths:** `src/platform/utility-apps/contracts/`
- **Riscos:** Definir um envelope rígido demais que não comporte todos os tipos de utilitários.

### 2. PKG-DATASET-DEFINITION-CONTRACT-001
- **Objetivo:** Abstrair a persistência de dados de referência (tabelas técnicas).
- **Owned Paths:** `src/platform/datasets/contracts/`
- **Riscos:** Ambiguidade entre Dataset e View.

### 4. PKG-FORMULA-DEFINITION-CONTRACT-001
- **Objetivo:** Definir como as fórmulas são armazenadas e quais motores são aceitos.
- **Owned Paths:** `src/platform/formulas/contracts/`
- **Riscos:** Fragmentação de linguagens de expressão no sistema.

### 8. PKG-DATASET-IMPORT-PORT-001
- **Objetivo:** Criar o mecanismo de conversão de arquivos externos para o formato interno de Dataset.
- **Owned Paths:** `src/platform/datasets/ports/import/`
- **Riscos:** Inconsistência de dados em arquivos CSV mal formados.

### 9. PKG-UTILITY-APP-EXECUTION-PORT-001
- **Objetivo:** Garantir que Utility Apps possam ser invocados programaticamente por outras Capabilities ou Process Nodes.
- **Owned Paths:** `src/platform/utility-apps/execution/`
- **Riscos:** Segurança na execução de `json_logic` ou scripts dinâmicos.

---

## Estratégia de Mitigação de Riscos

1. **Segurança:** Utilizar sandboxes estritas para execução de fórmulas.
2. **Performance:** Implementar mecanismos de indexação para Datasets em JSONB se o volume crescer.
3. **Escalabilidade:** Garantir que o versionamento (Immutable Versions) seja aplicado desde o PKG-001.
