# Inventário de Fronteiras: Capability, Action e Utility App

Este documento mapeia os conceitos reais existentes no repositório `gestaotecnica` e identifica sobreposições, acoplamentos e ausências de contrato.

## 1. Tabela de Evidências

| Conceito | Caminho | Símbolo / Tabela | Responsabilidade Atual | Responsabilidade Implícita | Consumidores | Persistência | Runtime? | Limitações | Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Capability** | `src/db/platform/schema/registry.ts` | `capabilities` | Catálogo de habilidades de negócio. | Interface de contrato para implementações. | ViewBuilder, BuilderTree | `registry.capabilities` | Sim | Falta contrato de input/output. | CONFIRMED |
| **Action Instance** | `src/db/runtime/schema/workflow.ts` | `actions` | Passo técnico configurado em um processo. | Unidade atômica de execução no fluxo. | Workflow Engine | `workflow.actions` | Sim | Acoplado a `process_version`. | CONFIRMED |
| **Action Descriptor** | `src/db/runtime/schema/workflow.ts` | `action_registry` | Tabela de catálogo de ações disponíveis. | Definição persistente de metadados e schemas. | Action Runner | `workflow.action_registry` | Não | Focado em metadados de catálogo. | CONFIRMED |
| **Action Handler** | `src/platform/actions/action-registry.ts` | `Map<string, ActionDefinition>` | Registro em memória de funções executáveis. | Ponto de execução técnica (runtime logic). | Action Runner | Somente memória | Sim | Requer registro explícito no bootstrap. | CONFIRMED |
| **Module** | `src/db/platform/schema/registry.ts` | `modules` | Agrupamento de funcionalidades. | Unidade de empacotamento e ativação. | Workspace Management | `registry.modules` | Sim | Confusão com "Capability". | CONFIRMED |
| **Utility App** | `docs/utility-apps/` | - | (Conceito em doc) | Ferramenta de E/S focada. | Usuário Final, Processos | N/A | Não | Sem tabela ou contrato no código. | PROPOSED |
| **Process** | `src/db/runtime/schema/workflow.ts` | `process_definitions` | Orquestração de estados. | Governança de fluxo temporal. | Workflow Engine | `workflow.process_definitions` | Sim | Complexidade para lógica pura. | CONFIRMED |
| **View Binding** | `src/components/builder/view-builder/view-builder-types.ts` | `ViewBinding` | Liga visualização a destino. | Ponto de entrada para execução. | View Engine | N/A (JSONB) | Não | Limitado a capabilities/forms. | PARTIAL |
| **Registry** | `src/db/platform/schema/registry.ts` | `registrySchema` | Namespace de definições. | Fonte da verdade para o catálogo. | Platform Services | PostgreSQL | Não | Focado em Modules/Capabilities. | CONFIRMED |

---

## 2. Respostas às Perguntas Obrigatórias

1. **Capability existe como contrato, tabela ou apenas conceito?**
   Existe como tabela (`registry.capabilities`) e conceito. Atualmente carece de um contrato formal de esquema (Zod) para entradas e saídas.

2. **Action possui identidade estável?**
   Parcialmente. No `action_registry` (Descriptor), possui uma `key` única. No entanto, em `workflow.actions` (Instance), ela é uma instância atômica vinculada a uma versão de processo.

3. **Action Registry é persistente ou somente em memória?**
   Ambos, com papéis distintos: a tabela `workflow.action_registry` persiste metadados/definições (Descriptor), enquanto `src/platform/actions/action-registry.ts` mantém os handlers executáveis em memória (Handler).

4. **Process Node referencia Action por qual campo?**
   Pelo campo `actionKey` (conforme `src/platform/workflows/contracts/process-node-edge.ts`).

5. **ViewBinding aponta para capabilities ou actions?**
   Aponta para `capabilities` (via `target_type: "capability"`), mas também pode apontar para `process_step` ou `form`. A ligação direta com `actions` é inferida em modelos de visualização de botões, mas não consolidada no contrato de binding.

6. **Module e Capability estão semanticamente separados?**
   Sim. São tabelas distintas com uma relação muitos-para-muitos via `module_capabilities`. Um módulo é um pacote que "entrega" uma ou mais capabilities.

7. **Utility App deve implementar Capability, expor Action ou ambos?**
   Uma Utility App pode implementar uma ou mais Capabilities e pode expor uma ou mais Actions quando a integração executável for necessária.

8. **Onde deve existir a relação UtilityApp ↔ Capability?**
   No `Registry` (definição de catálogo), indicando que a ferramenta provê aquela habilidade de negócio.

9. **Onde deve existir a relação UtilityApp ↔ Action?**
   No `Action Registry` (Descriptor), onde as funções específicas da ferramenta são registradas para descoberta e execução técnica.

10. **Quais relações são definição e quais são runtime?**
    - **Definição/Catálogo:** Capability, Module, Action Descriptor (`action_registry` table), ViewBinding.
    - **Runtime/Execução:** Action Handler (in-memory), Action Instance (`actions` process node), ActionExecution, ProcessInstance.

---

## 3. Modelo Conceitual Proposto

- **Capability:** Habilidade de negócio declarativa (o "quê"). Ex: "Cálculo de Tributação".
- **Action:** Unidade técnica executável (o "como"). Dividida em Descriptor (metadados persistentes), Handler (lógica em memória) e Instance (uso em fluxo).
- **Utility App:** Ferramenta focada em entrada/saída que não necessariamente modela um fluxo temporal, mas pode utilizar datasets persistidos, versões e histórico de execução.
- **Process:** Orquestra actions e estados ao longo do tempo. É o fluxo de trabalho.
- **Module:** Agrupamento funcional ou técnico para fins de distribuição e isolamento.

---

## 4. Sobreposições e Lacunas Identificadas

- **Sobreposição:** O termo `Action` é usado para três conceitos distintos: o descritor no catálogo, o handler em memória e a instância no nó de um processo.
- **Acoplamento:** `ViewBinding` está fortemente acoplado a tipos específicos (`form`, `capability`), dificultando a extensão para novos tipos de targets (como Utility Apps) sem alterar o schema.
- **Lacuna:** Falta um contrato de `Input/Output` para `Capabilities`. Atualmente, apenas `Action` possui `input_schema` e `output_schema`.
- **Lacuna:** Inexistência de uma tabela ou contrato para `Utility App` no código atual; referências em `docs/` e `ViewBinding` são baseadas em propostas de integração.
