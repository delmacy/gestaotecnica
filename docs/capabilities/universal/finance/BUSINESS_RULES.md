# Business Rules — finance

## Regras comuns
- Mudanças entre open, due, paid, overdue, reconciled são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com sales, procurement, contracts, audit não permitem alteração indireta sem contrato.

## Exemplo
Uma fatura recebida é paga e conciliada.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
