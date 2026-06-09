# UI Contract — finance

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com sales, procurement, contracts, audit.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: open, due, paid, overdue, reconciled.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Uma fatura recebida é paga e conciliada.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
