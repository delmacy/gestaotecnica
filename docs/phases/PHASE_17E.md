# Relatório de Execução — Fase 17E

## Objetivo
Adicionar botão ou painel mínimo para iniciar instância de processo publicado utilizando a Action exposta da fase anterior para provar a comunicação de ponta a ponta sem criar painéis gigantes.

## Resumo das Ações
O botão "Instanciar" foi adicionado no componente `BuilderDraftActionsPanel` (`src/features/builder/draft-actions/BuilderDraftActionsPanel.tsx`), logo ao lado do botão de "Publicar".
Ele aparece apenas se a versão atual está no estado `published`.
Utiliza `useTransition` para evitar concorrência e dá um feedback via `alert` simples conforme instruído para o escopo mínimo de POC.

## Resultados das Validações
Nenhum erro de lint/type. E permite a validação visual do fluxo completo do Bloco 17 (Criação do Processo no banco através do Runtime).
