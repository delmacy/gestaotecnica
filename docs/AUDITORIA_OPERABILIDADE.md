# AUDITORIA DE OPERABILIDADE DO BUILDER

## Flow Builder

| Item | Backend | API | UI | Funciona? | Notas |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Criar flow | Sim | Sim | Sim | Parcial | UI permite adicionar nós, mas não há um botão "Novo Flow" explícito no Explorer que funcione 100% dinâmico (está hardcoded no BuilderPage). |
| Salvar | Sim | Sim | Sim | Sim | Salva em `workflow.flow_definitions`. |
| Editar | Sim | Sim | Sim | Parcial | `getFlowDefinitionKernelAction` existe, mas a UI não carrega o estado salvo ao abrir um flow existente (usa `initialNodes`). |
| Excluir | Não | Não | Não | Não | Não há action de kernel nem botão na UI para excluir da persistência. |
| Publicar | Não | Não | Não | Não | Não há conceito de Draft/Published para Flows ainda. |
| Executar | Sim | Não | Não | Parcial | `FlowRunner` existe e funciona via código (`runFlowsForEvent`), mas não há trigger manual ou via UI. |

**Conclusão Flow Builder:** Editor visual com persistência básica, mas sem ciclo de vida (edição/publicação) funcional.

---

## Process Builder

*   **Definição:** Existe em `workflow.process_definitions`, mas a action `processes.save_definition` não salva o JSON da definição (apenas nome/chave).
*   **Persistência:** Apenas metadados básicos.
*   **Publicação:** Não implementado.
*   **Execução:** `WorkflowEngineService` existe mas parece desconectado da UI e incompleto.
*   **Resposta:** **UI apenas** (com persistência de metadados).

---

## Capability Management

*   **Instalar capability:** Funciona via `workspaces.install_capability`. Persiste em `workspace_module_configs`.
*   **Remover capability:** UI tem botão, mas a lógica de remoção no backend parece não estar mapeada no Kernel (apenas `toggleModule`).
*   **Listar capabilities:** Funciona via `listCapabilitiesKernelAction` e `ecosystemModules`.

---

## Action Registry

*   **Listar actions:** Funciona via `listActions()` no Registry.
*   **Pesquisar actions:** Funciona na UI do Flow Builder (filtro local).
*   **Selecionar action:** UI permite arrastar para o canvas, mas não há configuração de parâmetros da action.

---

## Event Registry

*   **Listar eventos:** Funciona via `listEvents()`.
*   **Pesquisar eventos:** Funciona na UI do Flow Builder.
*   **Utilizar evento como trigger:** UI permite colocar o nó de evento, mas o runtime (`FlowRunner`) ainda não consome as definições do banco (parece consumir apenas flows registrados via código no `kernel.ts`).

---

## Diagnóstico Geral

O Builder hoje é um **editor visual com persistência parcial**. A fundação (Registries e Tabelas) existe, mas a "cola" que transforma o desenho da UI em comportamento de runtime ainda está quebrada ou é manual (via código no `kernel.ts`).

## Atualização Pós-Implementação (System Builder MVP)

Após as intervenções realizadas, o estado do Builder evoluiu significativamente:

1.  **Flow Builder Operacional:**
    *   Fluxos criados na UI são persistidos no banco.
    *   Suporte a Ciclo de Vida: Draft e Published.
    *   **Runtime Reativo:** O `FlowRunner` agora carrega e executa fluxos publicados do banco de dados automaticamente quando eventos são emitidos.
2.  **Process Engine Real:**
    *   Diagramas de processos salvos na UI são decompostos em `states`, `transitions` e `actions` no banco.
    *   Isso habilita o motor de estados para instanciar processos reais baseados no desenho do arquiteto.
3.  **View Builder Persistente:**
    *   Configurações de layout (templates) são salvas e recuperadas.
4.  **Observabilidade:**
    *   A Timeline do Builder agora exibe execuções de flows (`flow_runs`), permitindo validar o funcionamento do sistema sem olhar o banco.

**Conclusão Final:**
O System Builder já consegue criar um sistema funcional (Fluxo de Automação Reativo) sem editar código?
**SIM.**

**Evidências de Runtime:**
*   `flow_definitions` populado via UI.
*   `flow_runs` gerados automaticamente por disparos de eventos do sistema.
*   Estados e Transições persistidos via `processes.save_definition`.
