# Inventário de Fronteiras: Capability, Action e Utility App

Este documento mapeia os conceitos reais existentes no repositório `gestaotecnica` e identifica sobreposições, acoplamentos e ausências de contrato.

## 1. Tabela de Evidências

| Conceito | Caminho | Símbolo / Tabela | Responsabilidade Atual | Responsabilidade Implícita | Consumidores | Persistência | Runtime? | Limitações | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Capability** | `src/db/platform/schema/registry.ts` | `capabilities` | Catálogo de habilidades de negócio. | Interface de contrato para implementações. | ViewBuilder, BuilderTree | `registry.capabilities` | Sim | Falta contrato de input/output. | CONFIRMED |
| **Action** | `src/db/runtime/schema/workflow.ts` | `actions` | Passo técnico em um processo. | Unidade atômica de execução. | Workflow Engine | `workflow.actions` | Sim | Acoplado a `process_version`. | CONFIRMED |
| **Action (Global)** | `src/db/runtime/schema/workflow.ts` | `action_registry` | Catálogo de ações disponíveis. | Registro de handlers técnicos. | Action Runner | `workflow.action_registry` | Sim | Pouco uso em relação ao Workflow. | CONFIRMED |
| **Module** | `src/db/platform/schema/registry.ts` | `modules` | Agrupamento de funcionalidades. | Unidade de empacotamento e ativação. | Workspace Management | `registry.modules` | Sim | Confusão com "Capability". | CONFIRMED |
| **Utility App** | `docs/utility-apps/` | - | (Conceito em doc) | Ferramenta stateless de E/S. | Usuário Final, Processos | N/A | Não | Sem tabela ou contrato no código. | PROPOSED |
| **Process** | `src/db/runtime/schema/workflow.ts` | `process_definitions` | Orquestração de estados. | Governança de fluxo temporal. | Workflow Engine | `workflow.process_definitions` | Sim | Complexidade para lógica pura. | CONFIRMED |
| **View Binding** | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBinding` | Liga visualização a destino. | Ponto de entrada para execução. | View Engine | N/A (JSONB) | Não | Limitado a capabilities/forms. | CONFIRMED |
| **Registry** | `src/db/platform/schema/registry.ts` | `registrySchema` | Namespace de definições. | Fonte da verdade para o catálogo. | Platform Services | PostgreSQL | Não | Focado em Modules/Capabilities. | CONFIRMED |

---

## 2. Respostas às Perguntas Obrigatórias

1. **Capability existe como contrato, tabela ou apenas conceito?**
   Existe como tabela (`registry.capabilities`) e conceito. Atualmente carece de um contrato formal de esquema (Zod) para entradas e saídas.

2. **Action possui identidade estável?**
   Parcialmente. No `action_registry`, possui uma `key` única. No entanto, em `workflow.actions`, ela é uma instância atômica vinculada a uma versão de processo.

3. **Action Registry é persistente ou somente em memória?**
   Ambos. Existe a tabela `workflow.action_registry` para persistência e `src/platform/actions/action-registry.ts` para o mapa em memória de handlers.

4. **Process Node referencia Action por qual campo?**
   Pelo campo `actionKey` (conforme `src/platform/workflows/contracts/process-node-edge.ts`).

5. **ViewBinding aponta para capabilities ou actions?**
   Aponta para `capabilities` (via `target_type: "capability"`), mas também pode apontar para `process_step` ou `form`.

6. **Module e Capability estão semanticamente separados?**
   Sim. São tabelas distintas com uma relação muitos-para-muitos via `module_capabilities`. Um módulo é um pacote que "entrega" uma ou mais capabilities.

7. **Utility App deve implementar Capability, expor Action ou ambos?**
   Ambos. Deve implementar uma `Capability` (identidade de negócio) e expor uma ou mais `Actions` (interfaces técnicas de execução).

8. **Onde deve existir a relação UtilityApp ↔ Capability?**
   No `Registry` (definição de catálogo), indicando que o Utility App provê aquela habilidade.

9. **Onde deve existir a relação UtilityApp ↔ Action?**
   No `Action Registry`, onde as funções específicas da ferramenta são registradas para execução.

10. **Quais relações são definição e quais são runtime?**
    - **Definição:** Capability, Module, UtilityApp Definition, ActionRegistry entry, ViewBinding.
    - **Runtime:** ActionExecution, ProcessInstance, ProcessPayload.

---

## 3. Modelo Conceitual Proposto

- **Capability:** Habilidade de negócio declarativa (o "quê"). Ex: "Cálculo de Tributação".
- **Action:** Unidade técnica executável (o "como"). Ex: `tax.calculate_v1`.
- **Utility App:** Ferramenta focada em entrada/saída que pode implementar capabilities e expor actions. É a ponte entre a necessidade declarativa e a execução técnica.
- **Process:** Orquestra actions e estados ao longo do tempo. É o fluxo de trabalho.
- **Module:** Agrupamento funcional ou técnico para fins de distribuição e isolamento.

---

## 4. Sobreposições e Lacunas Identificadas

- **Sobreposição:** `Action` em Workflows vs `ActionRegistry`. O sistema usa o mesmo termo para instâncias de passos de fluxo e para o catálogo global de funções.
- **Acoplamento:** `ViewBinding` está fortemente acoplado a tipos específicos (`form`, `capability`), dificultando a extensão para novos tipos de targets sem alterar o schema.
- **Lacuna:** Falta um contrato de `Input/Output` para `Capabilities`. Atualmente, apenas `Action` possui `input_schema` e `output_schema`.
- **Lacuna:** Inexistência de uma tabela ou contrato para `Utility App`, forçando sua representação como `Module` ou `Capability` de forma imprópria.
