# Business Rules — providers

## Regras comuns
- Mudanças entre candidate, qualified, active, suspended são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com organization, procurement, contracts não permitem alteração indireta sem contrato.

## Exemplo
Um prestador é qualificado antes de receber ordem.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
