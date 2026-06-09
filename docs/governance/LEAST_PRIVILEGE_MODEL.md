# Least Privilege Model

## Objetivo
Garantir acesso mínimo necessário, pelo menor tempo e escopo.

## Campos e entidades obrigatórios
sujeito/papel, necessidade, permissões, escopo, justificativa, início/fim, aprovador, revisão, exceção e revogação.

## Processo de uso
Inventariar tarefas → derivar acesso mínimo → remover excessos → aprovar exceções temporárias → revisar periodicamente → revogar.

## Critérios de aceite
Toda concessão tem justificativa; acessos temporários expiram; excesso identificado gera task; revisões têm responsável.

## Exemplo aplicado
Auditor recebe leitura de eventos de um workspace durante auditoria, sem poder alterar processos.

## Riscos e anti-padrões
Copiar perfil de administrador; privilégio permanente para conveniência; exceção sem expiração; acesso sem owner.
