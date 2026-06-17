# Inventário Arquitetural: Utility Apps (AS-IS)

Este documento mapeia os ativos existentes no repositório `gestaotecnica` que podem sustentar a implementação de Utility Apps (conversores, calculadoras, tabelas técnicas, etc.).

## 1. Evidência de Ativos Reutilizáveis (AS-IS)

| Ativo Reivindicado | Caminho no Repositório | Símbolo / Tabela / Coluna | Comportamento Confirmado | Limitações | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FormFieldTypeSchema** | `src/components/builder/form-builder/schema/field-schema.ts` | `FormFieldTypeSchema` | Enum de tipos de campos (text, number, date, etc.). | Focado em UI de formulários. | Confirmed |
| **ValidationRuleSchema** | `src/components/builder/form-builder/schema/field-schema.ts` | `ValidationRuleSchema` | Esquema Zod para regras (required, min, max, etc.). | Não possui motor de execução associado. | Confirmed |
| **FieldDefinitionSchema** | `src/components/builder/form-builder/schema/field-schema.ts` | `FieldDefinitionSchema` | Definição canônica de um campo de entrada. | Acoplado ao builder de formulários. | Confirmed |
| **ViewType** | `src/components/builder/view-builder/view-builder-types.ts` | `ViewType` | Union type de visualizações (table, kanban, etc.). | Apenas definição de tipo. | Confirmed |
| **ViewFilter** | `src/components/builder/view-builder/view-builder-types.ts` | `ViewFilter` | Interface para filtros de busca. | Apenas definição de contrato. | Confirmed |
| **ViewBinding** | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBinding` | Interface de ligação entre views e targets. | Targets limitados (form, capability, process_step). | Confirmed |
| **ViewBlueprint** | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBlueprint` | Interface mestre para definição de views. | Atualmente usado para mocks/blueprints. | Confirmed |
| **DataSourceMode** | `src/components/builder/view-builder/view-builder-types.ts` | `DataSourceMode` | Enum (synthetic, mock, real_pending, etc.). | Indica maturidade da fonte de dados. | Confirmed |
| **Config Schema** | `src/db/platform/schema/registry.ts` | `module_versions.config_schema` | Coluna JSONB para configuração de módulos. | Genérica para qualquer módulo. | Confirmed |
| **View Engine** | `src/platform/views/view-engine.ts` | `getAvailableActionsForEntity` | Lógica de descoberta de ações baseada em contexto. | Focado em ações de entidade. | Partial |
| **Action Registry** | `src/platform/actions/action-registry.ts` | `registerAction`, `listActions` | Mapa em memória de ações registradas. | Não persiste em banco por padrão. | Partial |
| **Action Runner** | `src/platform/actions/action-runner.ts` | `runAction` | Executor de handlers de ações com validação. | Não possui sandbox para código dinâmico. | Partial |
| **Split View** | `src/components/builder/view-builder/view-builder-types.ts` | `split_master_detail` | Membro do tipo `ViewType`. | Implementação de UI é apenas fallback. | Confirmed |

---

## 2. Respostas às Perguntas Obrigatórias

1. **Existe algum conceito atual equivalente a dataset?**
   `PARTIAL`. Não existe a entidade "Dataset" no código. O mais próximo é o uso de `jsonb` em `module_versions` para configurações e a intenção de fontes reais em `DataSourceMode`.

2. **Há contratos reutilizáveis para campos, tipos e validação?**
   `CONFIRMED`. `src/components/builder/form-builder/schema/field-schema.ts` provê os esquemas Zod necessários.

3. **Há views configuráveis que possam representar tabela, cards ou resultado?**
   `CONFIRMED`. O `ViewBuilder` define `table`, `dashboard_cards` e `split_master_detail`.

4. **Existem mecanismos de fórmula ou expression?**
   `PARTIAL`. O contrato `ProcessEdgeConditionSchema` em `src/platform/workflows/contracts/process-node-edge.ts` aceita `expression` e `json_logic`, mas não há um motor de execução (engine) de fórmulas implementado no repositório.

5. **Existe importação CSV ou planilha?**
   `PROPOSED`. Nenhuma implementação de parser de CSV ou Excel encontrada no código atual.

6. **Onde os dados de referência seriam persistidos hoje?**
   `PROPOSED`. Atualmente, a única via seria como metadados JSONB em `process_versions` ou `module_versions`. A persistência de tabelas técnicas reais é uma lacuna.

7. **Como separar dados de referência de dados transacionais?**
   `PROPOSED`. Segregação lógica via schemas: `src/db/platform` para definições (referência) e `src/db/runtime` para estados de execução (transacional).

8. **Como versionar tabelas técnicas?**
   `PROPOSED`. Reutilizar o padrão de "Definition" e "Version" usado em Workflows, onde cada versão contém o snapshot do dataset.

9. **Como registrar origem e aprovação de regras?**
   `PARTIAL`. O módulo de `traceability` em `src/platform/documents/traceability/` provê primitivos de integridade (hashing), mas o workflow de aprovação e o registro de proveniência de regras são `PROPOSED`.

10. **Como ligar Utility Apps a capabilities?**
    `PROPOSED`. Utility Apps podem implementar uma ou mais `Capabilities` registradas no `Registry`. A Capability define a habilidade de negócio, enquanto o Utility App provê a ferramenta executável.

11. **Como uma Utility App poderia futuramente ser usada dentro de um Process Node?**
    `PROPOSED`. Via `ProcessNode` do tipo `action` onde o `actionKey` aponta para o Utility App. Requer um adaptador de ação que ainda não existe.

12. **Quais componentes atuais devem ser reaproveitados?**
    - `Zod schemas` de formulários.
    - `Action Registry/Runner` para orquestração de lógica.
    - `Traceability` para garantir integridade.

13. **Quais componentes estão ausentes?**
    - `Dataset Persistence` (Tabelas para dados tabulares).
    - `CSV/Excel Importer`.
    - `Formula Execution Engine`.
    - `Utility Studio` (UI de edição).

14. **Quais riscos existem em transformar planilhas em regras automaticamente?**
    - Inconsistência de tipos (Zod vs Planilha).
    - Riscos de segurança em expressões dinâmicas.
    - Performance de busca em grandes volumes JSONB sem indexação tabular.

---

## 3. Classificação de Utility Apps (Proposed Categories)

| Categoria | Inputs | Outputs | Persistência | Histórico | Workflow | Exemplo Real |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lookup Utility** | Chave/ID | Valor/Objeto | Dataset | Não | Sim | Tabela de NCM/Tarifas |
| **Calculation Utility** | Parâmetros | Resultado | Fórmula | Sim | Sim | Calculadora de SLA |
| **Decision Table Utility** | Contexto | Decisão | Matriz | Sim | Sim | Matriz de Escalonamento |
| **Mapping Utility** | Origem | Destino | Mapa | Não | Não | De-Para de Conectores |
| **Reference Catalog** | Filtros | Lista | Dataset | Não | Não | Catálogo de Cabos |
| **Diagnostic Utility** | Sintomas | Diagnóstico | Árvore | Sim | Não | Árvore de Falhas Elétricas |
| **Checklist Utility** | Contexto | Status | Checklist | Sim | Sim | Checklist de Comissionamento |
| **Comparison Utility** | A + B | Diff | Regras | Não | Não | Comparador de Modelos |

---

## 4. Avaliação do Modelo Conceitual (Proposed)

| Entidade | Status Atual | Recomendação |
| :--- | :--- | :--- |
| **UtilityAppDefinition** | `PROPOSED` | Criar contrato canônico. |
| **DatasetDefinition** | `PROPOSED` | Abstração para dados tabulares puros. |
| **DatasetVersion** | `PROPOSED` | Seguir padrão de imutabilidade. |
| **LookupDefinition** | `PROPOSED` | Especialização para busca Key-Value. |
| **FormulaDefinition** | `PARTIAL` | Isolar lógica de cálculo de workflows. |
| **DecisionTableDefinition**| `PROPOSED` | Matrizes de decisão em JSON. |
| **UtilityViewDefinition** | `PARTIAL` | Estender `ViewBlueprint` para ferramentas. |
| **RuleApproval** | `PROPOSED` | Workflow de governança para regras. |
| **RuleProvenance** | `PARTIAL` | Usar `TraceReceipt` como primitivo. |

---

## 5. Distinção de Conceitos

- **Process App:** Orquestração de passos e estados temporais. Focado em fluxo.
- **Utility App:** Transformação ou consulta pontual sem estado persistente. Focado em I/O.
- **Capability:** Conceito de negócio / habilidade no catálogo (ex: "Cálculo de Imposto").
- **View:** Componente visual de apresentação de dados.
- **Action:** Unidade de execução lógica registrada no sistema.
