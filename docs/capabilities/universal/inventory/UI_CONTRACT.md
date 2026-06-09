# UI Contract — inventory

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com work_orders, procurement, audit.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: available, reserved, low_stock, expired.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Uma peça é reservada e baixada por ordem.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
