# Business Rules — scheduling

## Regras comuns
- Mudanças entre tentative, confirmed, completed, cancelled são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com people, resources, work_orders não permitem alteração indireta sem contrato.

## Exemplo
Uma visita reserva profissional e veículo sem conflito.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
