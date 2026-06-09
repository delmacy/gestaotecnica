# UI Contract — assets

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com work_orders, inventory.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: active, maintenance, unavailable, retired.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Um equipamento entra em manutenção e fica indisponível.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
