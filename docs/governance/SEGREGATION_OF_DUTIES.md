# Segregation of Duties

## Objetivo
Prevenir concentração de ações incompatíveis e fraude/erro não detectado.

## Campos e entidades obrigatórios
regra, ação A, ação B, papéis afetados, escopo, severidade, exceção, mitigação, aprovador e evidência de revisão.

## Processo de uso
Mapear decisões críticas → identificar ações incompatíveis → testar papéis → definir bloqueio ou mitigação → aprovar exceção → auditar.

## Critérios de aceite
Conflitos críticos estão documentados; exceções possuem mitigação e validade; responsibility map reflete a regra.

## Exemplo aplicado
Quem executa uma ordem não pode validar sua própria evidência; em equipe mínima, revisão posterior independente é mitigação temporária.

## Riscos e anti-padrões
SoD apenas no organograma; exceção informal; bloquear trabalho sem fallback; não revisar conflito após mudança de papel.
