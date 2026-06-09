# UI Contract — work_orders

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com requests, tasks, assets, audit.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: draft, planned, executing, validation, closed.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Uma ordem exige fotos e validação do supervisor.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
