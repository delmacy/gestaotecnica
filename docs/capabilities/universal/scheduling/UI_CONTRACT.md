# UI Contract — scheduling

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com people, resources, work_orders.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: tentative, confirmed, completed, cancelled.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Uma visita reserva profissional e veículo sem conflito.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
