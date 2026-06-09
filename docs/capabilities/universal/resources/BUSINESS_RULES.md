# Business Rules — resources

## Regras comuns
- Mudanças entre available, reserved, allocated, unavailable são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com scheduling, work_orders não permitem alteração indireta sem contrato.

## Exemplo
Uma sala é reservada para uma execução específica.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
