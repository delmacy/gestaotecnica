# Próxima Fase — System Builder

## Fase atual de organização

```text
A Fase 16 e o planejamento da 16C (Context Packs) foram concluídos.
O foco atual transiciona do modelo de modelagem estrutural (Builder) para o ambiente operacional (Runtime).
```

## Próxima fase técnica planejada

```text
Fase 17 — Runtime mínimo (Início da Trilha de Execução)
```

## Divisão Granular de Fases

A fim de garantir total controle e testabilidade, a Fase 17 de Runtime foi segmentada em subfases extremamente granulares.

### Fase 17A — Runtime schema e contratos
*   **Objetivo:** Estabelecer fundação para a execução definindo esquemas e tipos TS.
*   **Ação:** Criar apenas tabelas (`process_instances`, etc.) e tipos para o runtime mínimo.
*   **Anti-Escopo:** Sem service, sem UI, sem server action e sem events.

### Fase 17B — Runtime repository
*   **Objetivo:** Permitir interação pura com os dados persistidos da instância.
*   **Ação:** Criar as funções de leitura e escrita do banco de dados (Ex: `createInstance`, `getInstance`) para suportar `process_instances` e futuramente `process_instance_steps`.
*   **Anti-Escopo:** Sem service logico, sem server action de exposição de API, sem UI.

### Fase 17C — Runtime service
*   **Objetivo:** Centralizar regra de negócios para orquestrar dados operacionais.
*   **Ação:** Criar service/lógica para iniciar uma instância a partir de uma versão *Published* com segurança transacional e isolamento lógico.
*   **Anti-Escopo:** Sem interface de usuário (UI) operável, sem manipulação do event system completo.

### Fase 17D — Server action para iniciar instância
*   **Objetivo:** Disponibilizar os métodos do Service seguramente pela API (Boundary Frontend-Backend).
*   **Ação:** Expor action de servidor (`actions.ts`) necessária para disparar a engine/service de criar nova instância a partir de chamadas web (Next.js action).
*   **Anti-Escopo:** Sem construir as páginas UI de operação complexas de usuário.

### Fase 17E — UI mínima para iniciar instância
*   **Objetivo:** Garantir uma forma visual tangível para testar a engine.
*   **Ação:** Criar botão, shell ou tela muito simples focada apenas para o administrador iniciar instâncias e verificar logs localmente.
*   **Anti-Escopo:** Sem monitoramento real-time por sockets ou execução avançada de visualização de subetapas da instância.

### Fase 18A — Contratos de execução de etapa
*   **Objetivo:** Avançar a lógica do Process Instance para a gestão dos nós de execução.
*   **Ação:** Preparar tipos e contratos (TS interfaces/types) para transicionar instâncias entre os estados modelados (ex: Avançar passo ativo, resolver Node), sem construir a engine final ou regras complexas de validação que seriam da Fase 18B+.
*   **Anti-Escopo:** Não implementar orquestrador ou automações ativas (events/workers/runners).
