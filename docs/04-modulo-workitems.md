# Módulo WorkItems

WorkItem representa a necessidade antes da execução autorizada por OS.

## Implementado

- Rota `/work-items`
- Rota `/work-items/[id]`
- Listagem das últimas 50 demandas
- Formulário de criação de demanda
- Campos iniciais:
  - título
  - tipo
  - prioridade
  - descrição
  - ativo vinculado
  - solicitante
  - contato
- Criação automática de evento `work_item.created`
- Alteração de status com evento `work_item.status_changed`
- Tela de detalhe com contexto, solicitante, contato, cards de status e timeline de eventos
- Exibição do ativo vinculado na listagem e no detalhe
- Cards de resumo:
  - demandas
  - abertas
  - críticas
  - eventos criados

## Decisão de domínio

A demanda nasce como `work_items.status = open`. Ela ainda não é uma OS. A próxima evolução natural é permitir triagem, atribuição de equipe e criação de uma `service_order` a partir da demanda.

## Próximos passos

- Tela de detalhe do WorkItem
- Triagem
- Vínculo com ativo
- Criação de OS a partir de WorkItem
- Histórico de eventos por demanda
