# Business Rules — approvals

## Regras comuns
- Mudanças entre pending, approved, rejected, expired são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com people, governance, audit não permitem alteração indireta sem contrato.

## Exemplo
Uma compra acima do limite exige segunda aprovação.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
