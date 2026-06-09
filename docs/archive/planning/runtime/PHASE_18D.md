# Fase 18D — Server action/UI mínima de avançar etapa

## Objetivo
- expor server action para avançar etapa;
- criar UI mínima para avançar etapa atual;
- sem timeline complexa;
- sem events ainda.

## Contexto
Permitir que o administrador ou testador interaja com a Engine manual através do Client/Browser. Expõe-se a Action do Bloco 18 e implementa-se um shell básico interativo.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.actions.ts`
- Alteração visual em listagem ou shell de teste de execução (e.g., `src/app/(builder)/builder/page.tsx` ou modal de inspeção de instância).

## Arquivos proibidos
- Services e Repositories devem permanecer inalterados nesta camada.

## Regras
- UIs simples (como formulário manual de 'Advance') visíveis apenas nos mock instances.

## Etapas
1. Server action `advanceStepAction`.
2. Adicione no componente visual correspondente um botão "Avançar Próxima Etapa".

## Validações
- Comportamento de clique testado e tipagem preservada no Server Action.

## Relatório final esperado
Print/Descrição do botão injetado e do payload retornado visualmente no cliente.

## Regra de parada
Após fechar a UI básica confirmando o action handler.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime.md

Fase 18D — Server action/UI mínima de avançar etapa

Objetivo:
Expor a lógica de execução da fase anterior ao front-end e anexá-la a uma interface visual simples.

Escopo:
- Arquivos a alterar:
  `src/features/workflow/runtime/runtime.actions.ts`
  A UI ou o modal associado aos detalhes de uma Instância (no Builder/Saved list ou em painel específico designado).

Não alterar:
Services lógicos.

Regras:
1. `use server` no novo endpoint de Action.
2. Botão simples com `useTransition` na UI para não bloquear o Client render.

Etapas:
1. Implemente a action.
2. Anexe ao botão/shell na árvore do React.

Validações:
Nenhuma dependência com Events do banco legados.

Relatório final:
Explicação da localização visual da integração.

Regra de parada:
Commit visual concluído, fase fechada.
```