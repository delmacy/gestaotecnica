# UI Contract — contracts

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com customers, providers, approvals, legal.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: draft, review, active, expired, terminated.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Um contrato alerta renovação e obrigação pendente.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
