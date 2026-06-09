# UI Contract — sales

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com customers, contracts, finance.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: lead, qualified, proposal, won, lost.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Uma oportunidade aceita gera contrato.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
