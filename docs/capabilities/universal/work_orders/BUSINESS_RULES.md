# Business Rules — work_orders

## Regras comuns
- Mudanças entre draft, planned, executing, validation, closed são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com requests, tasks, assets, audit não permitem alteração indireta sem contrato.

## Exemplo
Uma ordem exige fotos e validação do supervisor.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
