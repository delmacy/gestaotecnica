# Modulo Service Orders / OS

Service Order representa execucao autorizada de mao de obra tecnica. No MVP, a OS nasce preferencialmente a partir de um WorkItem.

## Implementado

- Rota `/service-orders`
- Rota `/service-orders/[id]`
- Listagem das ultimas 50 OS
- Criacao de OS a partir do detalhe de um WorkItem
- Codigo automatico de OS no formato `OS-AAAAMMDD-HHMMSS-SUFIXO`
- Heranca inicial de:
  - titulo da demanda
  - prioridade da demanda
  - ativo vinculado a demanda
  - descricao da demanda como objetivo, quando o objetivo nao for informado
- Atualizacao do WorkItem para `planned` quando a OS e criada
- Criacao automatica de eventos:
  - `service_order.created`
  - `work_item.service_order_created`
  - `service_order.status_changed`
- Tela de detalhe com:
  - status
  - prioridade
  - data de criacao
  - data de conclusao
  - demanda origem
  - ativo vinculado
  - timeline de eventos
  - formulario de status

## Decisao de dominio

WorkItem preserva a necessidade. ServiceOrder representa a execucao autorizada. Essa separacao permite que uma mesma demanda tenha historico proprio e possa gerar uma ou mais OS ao longo do tempo.

## Proximos passos

- Atribuir tecnico/equipe a OS
- Registrar apontamento de tempo
- Registrar evidencia
- Melhorar regras de status
- Gerar entrada no livro de turno a partir de eventos da OS
