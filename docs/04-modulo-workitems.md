# Modulo WorkItems

WorkItem representa a necessidade antes da execucao autorizada por OS.

## Implementado

- Rota `/work-items`
- Rota `/work-items/[id]`
- Listagem das ultimas 50 demandas
- Formulario de criacao de demanda
- Campos iniciais:
  - titulo
  - tipo
  - prioridade
  - descricao
  - ativo vinculado
  - solicitante
  - contato
- Criacao automatica de evento `work_item.created`
- Alteracao de status com evento `work_item.status_changed`
- Tela de detalhe com contexto, solicitante, contato, cards de status e timeline de eventos
- Exibicao do ativo vinculado na listagem e no detalhe
- Cards de resumo:
  - demandas
  - abertas
  - criticas
  - eventos criados

## Decisao de dominio

A demanda nasce como `work_items.status = open`. Ela ainda nao e uma OS. A proxima evolucao natural e permitir triagem, atribuicao de equipe e criacao de uma `service_order` a partir da demanda.

## Proximos passos

- Tela de detalhe do WorkItem
- Triagem
- Vinculo com ativo
- Criacao de OS a partir de WorkItem
- Historico de eventos por demanda
