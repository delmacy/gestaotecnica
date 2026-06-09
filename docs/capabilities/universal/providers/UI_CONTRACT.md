# UI Contract — providers

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com organization, procurement, contracts.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: candidate, qualified, active, suspended.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Um prestador é qualificado antes de receber ordem.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
