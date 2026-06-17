# Inventário Arquitetural: Utility Apps (AS-IS)

Este documento mapeia os ativos existentes no repositório `gestaotecnica` que podem sustentar a implementação de Utility Apps (conversores, calculadoras, tabelas técnicas, etc.).

## 1. Mapeamento de Ativos Reutilizáveis

### 1.1 Form Builder (UI & Contracts)
- **Localização:** `src/components/builder/form-builder/`
- **Ativos:**
    - `FormFieldTypeSchema`: Define tipos de campos (text, number, boolean, date, select, reference).
    - `ValidationRuleSchema`: Regras de validação (required, min, max, pattern, custom).
    - `FieldDefinitionSchema`: Estrutura canônica de campos reutilizável para Inputs/Outputs de Utility Apps.
- **Uso em Utility Apps:** Definição da interface de entrada (Inputs) e saída (Outputs) de calculadoras e seletores.

### 1.2 View Builder (UI & Contracts)
- **Localização:** `src/components/builder/view-builder/`
- **Ativos:**
    - `ViewType`: Suporta `table`, `detail`, `kanban`, `dashboard_cards`.
    - `ViewFilter`: Mecanismo de filtragem configurável.
    - `ViewBinding`: Permite ligar views a `capability` ou `form`.
- **Uso em Utility Apps:** Representação visual de catálogos, tabelas técnicas e matrizes de compatibilidade.

### 1.3 Action Registry & Runner
- **Localização:** `src/platform/actions/`
- **Ativos:**
    - `ActionRegistry`: Catálogo central de funções executáveis.
    - `ActionRunner`: Orquestrador de execução de lógica pura.
- **Uso em Utility Apps:** Execução das fórmulas e regras de decisão (Pure Functions).

### 1.4 Workflow Expressions
- **Localização:** `src/platform/workflows/contracts/process-node-edge.ts`
- **Ativos:**
    - `ProcessEdgeConditionSchema`: Já prevê linguagens `expression` e `json_logic`.
- **Uso em Utility Apps:** Motor de regras para árvores de decisão e calculadoras.

### 1.5 Traceability & Hashing
- **Localização:** `src/platform/documents/traceability/`
- **Ativos:**
    - `canonicalizeTraceValue`: Garante determinismo nos dados.
    - `TraceReceiptHashing`: Hashing seguro para auditoria de regras aplicadas.
- **Uso em Utility Apps:** Registro de proveniência de regras e aprovações de tabelas técnicas.

### 1.6 Registry & Capabilities
- **Localização:** `src/db/platform/schema/registry.ts`
- **Ativos:**
    - `capabilities`: Catálogo de funções de negócio.
    - `module_versions`: Versionamento de configurações via JSONB.
- **Uso em Utility Apps:** Registro do Utility App como uma "Capability" disponível no sistema.

---

## 2. Respostas às Perguntas Obrigatórias

1. **Existe algum conceito atual equivalente a dataset?**
   Não explicitamente como entidade "Dataset". O mais próximo é o `module_versions.configSchema` e o `definitionJson` de processos. A estrutura de `ViewBlueprint` já prevê `DataSourceMode`, mas falta uma abstração de persistência de dados tabulares puros.

2. **Há contratos reutilizáveis para campos, tipos e validação?**
   Sim. `src/components/builder/form-builder/schema/field-schema.ts` contém o `FieldDefinitionSchema` que é ideal para esta finalidade.

3. **Há views configuráveis que possam representar tabela, cards ou resultado?**
   Sim. O `ViewBuilder` já possui suporte para `table`, `dashboard_cards` e `split_master_detail`.

4. **Existem mecanismos de fórmula ou expression?**
   Sim. O contrato de `ProcessEdgeCondition` define suporte a `expression` e `json_logic`, embora o motor de execução (runner) para Utility Apps ainda precise ser isolado.

5. **Existe importação CSV ou planilha?**
   Não foi encontrada nenhuma implementação de parser de CSV ou Excel no `src/`. É uma lacuna crítica.

6. **Onde os dados de referência seriam persistidos hoje?**
   Atualmente, seriam armazenados como `jsonb` em tabelas de definição (como `process_versions` ou uma futura `utility_versions`).

7. **Como separar dados de referência de dados transacionais?**
   Seguindo o padrão do projeto: `src/db/platform` para definições e referências (imutáveis por versão) e `src/db/runtime` para execuções (transacionais).

8. **Como versionar tabelas técnicas?**
   Utilizando o modelo de "Definition" e "Version" já aplicado em Workflows. Cada alteração na tabela gera uma nova `UtilityVersion` com seu próprio `definitionJson`.

9. **Como registrar origem e aprovação de regras?**
   Através do módulo de `traceability`, gerando um `TraceReceipt` no momento da publicação de uma versão, vinculando o autor e o hash do conteúdo.

10. **Como ligar Utility Apps a capabilities?**
    Um Utility App deve ser registrado como uma `Capability` no `Registry`, permitindo que seja descoberto pelo `ViewEngine`.

11. **Como uma Utility App poderia futuramente ser usada dentro de um Process Node?**
    Através de um `ProcessNode` do tipo `action`, onde o `actionKey` aponta para o Utility App, passando o contexto do processo como input.

12. **Quais componentes atuais devem ser reaproveitados?**
    - `Zod schemas` do Form Builder.
    - `ViewEngine` para descoberta.
    - `Traceability` para hashing e auditoria.
    - `ActionRegistry` para o catálogo.

13. **Quais componentes estão ausentes?**
    - Dataset Persistence (tabelas para linhas/colunas).
    - CSV/Excel Importer.
    - Formula Engine Runtime (isolado de workflows).
    - Utility-specific Studio (editor de tabelas/fórmulas).

14. **Quais riscos existem em transformar planilhas em regras automaticamente?**
    - **Tipagem:** Planilhas aceitam dados heterogêneos; o sistema exige tipagem estrita (Zod).
    - **Injeção:** Fórmulas dinâmicas podem conter código malicioso se não forem sanitizadas.
    - **Performance:** Tabelas técnicas gigantescas em JSONB podem degradar a performance de busca.

---

## 3. Classificação de Utility Apps

| Categoria | Inputs | Outputs | Persistência | Histórico | Workflow | Exemplo Real |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lookup Utility** | Chave/ID | Valor/Objeto | Dataset | Não | Sim (Aprovação) | Tabela de NCM/Tarifas |
| **Calculation Utility** | Parâmetros | Resultado | Fórmula | Sim | Sim (Auditoria) | Calculadora de SLA |
| **Decision Table Utility** | Contexto | Decisão | Matriz | Sim | Sim | Matriz de Escalonamento |
| **Mapping Utility** | Origem | Destino | Mapa | Não | Não | De-Para de Conectores |
| **Reference Catalog** | Filtros | Lista | Dataset | Não | Não | Catálogo de Cabos |
| **Diagnostic Utility** | Sintomas | Diagnóstico | Árvore | Sim | Não | Árvore de Falhas Elétricas |
| **Checklist Utility** | Contexto | Status | Checklist | Sim | Sim | Checklist de Comissionamento |
| **Comparison Utility** | A + B | Diff | Regras | Não | Não | Comparador de Modelos |

---

## 4. Avaliação do Modelo Conceitual Proposto

| Entidade | Status Atual | Recomendação |
| :--- | :--- | :--- |
| **UtilityAppDefinition** | Inexistente | Criar em `src/platform/utility-apps/contracts` |
| **DatasetDefinition** | Parcial (ViewBlueprint) | Criar abstração própria para dados tabulares |
| **DatasetVersion** | Inexistente | Seguir padrão `process_versions` |
| **LookupDefinition** | Inexistente | Implementar como tipo de Utility App |
| **FormulaDefinition** | Parcial (Expression) | Isolar lógica de cálculo de workflow-engine |
| **DecisionTableDefinition**| Inexistente | Schema para matrizes JSON |
| **UtilityViewDefinition** | Parcial (ViewBlueprint) | Especializar views para ferramentas técnicas |
| **RuleApproval** | Inexistente | Integrar com sistema de governança/workflow |
| **RuleProvenance** | Parcial (Traceability)| Estender `TraceReceipt` para regras de negócio |

---

## 5. Distinção de Conceitos

- **Process App:** Orquestração de passos (nodes) e estados ao longo do tempo. Focado em fluxo.
- **Utility App:** Transformação de dados ou consulta pontual. Focado em entrada/saída imediata.
- **Capability:** Funcionalidade atômica exposta pelo sistema (pode ser um Process ou Utility).
- **View:** Representação visual de dados (tabelas, cards).
- **Action:** Execução de lógica pura ou integração externa.
