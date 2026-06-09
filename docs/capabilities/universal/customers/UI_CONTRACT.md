# UI Contract — customers

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com organization, communication.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: prospect, active, inactive, blocked.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Um solicitante é associado ao cliente e aos seus canais.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
