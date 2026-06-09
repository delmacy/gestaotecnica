# Business Rules — inventory

## Regras comuns
- Mudanças entre available, reserved, low_stock, expired são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com work_orders, procurement, audit não permitem alteração indireta sem contrato.

## Exemplo
Uma peça é reservada e baixada por ordem.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
