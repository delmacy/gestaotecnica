# Audit Policy

## Objetivo
Definir quais decisões e ações precisam de trilha imutável, atribuível e revisável.

## Campos e entidades obrigatórios
evento, ator, papel, workspace, ação, sujeito, antes/depois quando permitido, motivo, evidência, correlação, timestamp, retenção, acesso e revisão.

## Processo de uso
Classificar ações auditáveis → definir envelope e retenção → garantir acesso mínimo → revisar amostras/anomalias → registrar achados.

## Critérios de aceite
Eventos críticos são imutáveis e correlacionáveis; correções geram novo evento; retenção e acesso estão definidos; ausência de log é detectável.

## Exemplo aplicado
Ao rejeitar uma aprovação, registra-se decisor, motivo, versão analisada e evidência.

## Riscos e anti-padrões
Log editável; registrar segredo/dado excessivo; auditoria sem revisão; confiar apenas em texto livre.
