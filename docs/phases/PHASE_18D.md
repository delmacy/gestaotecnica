# Relatório de Execução — Fase 18D

## Objetivo
Expor uma Server Action (`advanceStepAction`) para avançar etapa e criar uma UI mínima para permitir essa iteração visualmente durante o desenvolvimento do MVP, sem timeline complexa nem events.

## Resumo das Ações
1. **Server Action**: Adicionado `advanceStepAction` ao `src/features/workflow/runtime/runtime.actions.ts`. Este método busca a etapa ativa e a avança injetando `workspaceId` e `processInstanceId` no service principal já construído (Fase 18C).
2. **UI Mínima**: No arquivo `src/features/builder/draft-actions/BuilderDraftActionsPanel.tsx`, modificamos o fluxo do botão "Instanciar" da Fase 17E.
   - Ao criar a instância com sucesso, salvamos no React state `activeInstanceId`.
   - Enquanto há uma instância ativa presa no estado local, substituímos o botão "Instanciar" por "Avançar Step".
   - Cada clique exibe o progresso do avanço. Se o step retornar `"completed"` (que significa fim do ciclo linear e também `end` processual no service provisório), o state limpa a instância, devolvendo o controle normal da UI.

## Resultados das Validações
Nenhum quebra de typings detectada no build. Nenhuma dependência acidental de eventos foi gerada.
O payload interage corretamente de ponta-a-ponta.
