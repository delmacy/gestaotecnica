# UI Contract — analytics

## Superfícies mínimas
Lista/board, detalhe, criação ou comando permitido, filtros, histórico e relações com audit, enterprise_architecture.

## Estados obrigatórios
Vazio, carregando, erro, acesso negado, sucesso e os estados de domínio: draft, verified, published, deprecated.

## Regras
A interface mostra workspace ativo, ações disponíveis por papel, confirmação para ações críticas, feedback e trilha. UI não inventa regra nem esconde falta de autorização.

## Exemplo
Um dashboard publica tempo médio com fonte definida.

## Critério de pronto
Persona, rota, escopo, dados, comandos, estados, permissões, auditoria e teste E2E esperado estão documentados.
