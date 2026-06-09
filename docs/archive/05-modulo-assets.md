# Modulo Assets

Assets representam equipamentos, sistemas, infraestrutura e outros elementos operacionais que podem receber demandas, OS, evidencias e eventos.

## Implementado

- Rota `/assets`
- Rota `/assets/[id]`
- Listagem dos ultimos 50 ativos
- Formulario de cadastro de ativo
- Campos iniciais:
  - codigo
  - nome
  - tipo
  - status
  - criticidade
  - localizacao
  - descricao
- Criacao automatica de evento `asset.created`
- Alteracao de status com evento `asset.status_changed`
- Tela de detalhe com contexto, relacoes e timeline de eventos
- Contagem de demandas vinculadas ao ativo
- Cards de resumo:
  - ativos
  - ativos operacionais
  - em manutencao
  - criticos

## Decisao de dominio

Ativo nao e apenas patrimonio. Ele pode representar equipamento fisico, sistema, infraestrutura, software ou qualquer elemento tecnico que precise de historico operacional.

## Proximos passos

- Vincular OS a Assets
- Historico cruzado de demandas e OS por ativo
- Tipos de ativos mais formais
- Criticidade com impacto operacional
