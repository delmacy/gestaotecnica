# Business Rules — communication

## Regras comuns
- Mudanças entre queued, sent, delivered, failed, read são explícitas, autorizadas e auditáveis.
- Operações respeitam workspace, papel e ownership.
- Exceções exigem justificativa e evidência.
- Publicação de mudança estrutural exige revisão humana.
- Relações com customers, requests, integrations não permitem alteração indireta sem contrato.

## Exemplo
Uma notificação de agendamento registra entrega.

## Anti-padrões
Regra escondida na UI; estado alterado sem evento; acesso global a dado operacional; exceção apagando histórico; especialização de cliente promovida a universal sem revisão.
