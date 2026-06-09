# Permission Model

## Objetivo
Documentar o que um papel pode fazer, em qual recurso, condição e escopo, antes de qualquer RBAC técnico.

## Campos e entidades obrigatórios
permission_id, action, resource/capability, effect, workspace scope, process scope, ownership condition, restrições, evidência, política, aprovador e validade.

## Processo de uso
1. Partir de tarefa permitida. 2. Definir ação/recurso. 3. Aplicar menor escopo. 4. Adicionar condições. 5. Testar cenários permitidos/negados. 6. Aprovar.

## Critérios de aceite
Cada permissão é necessária e testável; negativas críticas são explícitas; escopo e validade existem; vínculo com papel e auditoria está definido.

## Exemplo aplicado
Supervisor pode validar work_order da própria unidade quando não for executor.

## Riscos e anti-padrões
Permissão curinga; autorização baseada só em UI; misturar papel e pessoa; não testar acesso negado.
