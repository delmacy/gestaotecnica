# Business Rules — assets

## Regras comuns
- Mudanças entre active, maintenance, unavailable, retired são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com work_orders, inventory não permitem alteração indireta sem contrato.

## Exemplo
Um equipamento entra em manutenção e fica indisponível.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
