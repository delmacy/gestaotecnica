# UI Contract — tasks

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com people, cases, work_orders.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: backlog, ready, in_progress, blocked, review, done.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Uma tarefa bloqueada aguarda documento antes da revisão.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
