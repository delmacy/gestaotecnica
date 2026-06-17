# Plano de Implementação Futura: Utility Apps

Este documento descreve a sequência recomendada de pacotes para a implementação do ecossistema de Utility Apps, baseando-se nas lacunas (`PROPOSED`) e ativos parciais identificados no inventário.

## Sequência de Pacotes

| Ordem | Pacote | Objetivo | Dependências | Risco | Paralelismo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **PKG-UTILITY-APP-CORE-CONTRACT-001** | Definir o envelope canônico de Utility Apps. | Nenhuma | Baixo | Sim |
| 2 | **PKG-DATASET-DEFINITION-CONTRACT-001** | Definir o esquema para datasets tabulares e versionamento. | Core Contract | Médio | Sim |
| 3 | **PKG-DATASET-ROW-SCHEMA-001** | Contrato para linhas e células (dados reais). | Dataset Contract | Baixo | Sim |
| 4 | **PKG-FORMULA-DEFINITION-CONTRACT-001** | Padronizar a definição de expressões (isolado de Workflows). | Core Contract | Médio | Não |
| 5 | **PKG-LOOKUP-DEFINITION-CONTRACT-001** | Contrato para utilitários de busca Key-Value. | Dataset Contract | Baixo | Sim |
| 6 | **PKG-DECISION-TABLE-CONTRACT-001** | Esquema para tabelas e matrizes lógicas. | Formula Contract | Médio | Sim |
| 7 | **PKG-UTILITY-VIEW-CONTRACT-001** | Extensões técnicas para o `ViewBlueprint`. | View Builder | Baixo | Sim |
| 8 | **PKG-DATASET-IMPORT-PORT-001** | Mecanismo de ingestão (Parser de CSV/Excel). | Dataset Contract | Alto | Não |
| 9 | **PKG-UTILITY-APP-EXECUTION-PORT-001** | Runtime e Sandbox para execução de fórmulas. | Action Runner | Alto | Não |
| 10 | **PKG-UTILITY-APP-PROVENANCE-001** | Registro de governança e origem via `Traceability`. | Traceability | Baixo | Sim |

---

## Detalhamento da Estratégia

### 1. Separação de Dados
- **Datasets Tabulares:** Devem ter persistência própria (tabelas de linhas/colunas) para permitir indexação e buscas eficientes, evitando o uso de JSONB de definições para dados volumosos.
- **Configuração:** O JSONB deve ser restrito a metadados e versões de regras.

### 2. Runtime e Sandbox
- A execução de Utility Apps deve ser isolada do motor de workflow principal para garantir performance e segurança. O pacote `PKG-UTILITY-APP-EXECUTION-PORT-001` deve implementar um executor de `json_logic` ou similar que não exponha o servidor.

### 3. Governança
- A integração com `Traceability` (`PKG-UTILITY-APP-PROVENANCE-001`) transformará o hashing em uma evidência de aprovação formal de regras técnicas.

---

## Riscos de Implementação
1. **Performance:** Ingestão de planilhas gigantes sem estratégia de paginação/indexação em banco.
2. **Segurança:** Injeção de lógica em expressões dinâmicas.
3. **Acoplamento:** Dependência excessiva de tipos do Form Builder em utilitários que não requerem UI.
