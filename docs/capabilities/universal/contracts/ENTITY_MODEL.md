# Entity Model — contracts

## Entidades
Contract, Party, Obligation, Renewal

## Campos comuns
Cada entidade declara identidade, workspace scope quando operacional, owner, origem, estado, timestamps, versão e rastreabilidade. Relações cruzadas usam referências explícitas, não ownership implícito.

## Regras de modelagem
- Entidade possui ciclo de vida e responsável claros.
- Dados flexíveis não substituem campos essenciais.
- Alterações relevantes geram evento/auditoria.

## Exemplo
Um contrato alerta renovação e obrigação pendente.

## Critério de pronto
Identidades, relações, cardinalidades conceituais, estados, sensibilidade e fonte de verdade foram revisados.
