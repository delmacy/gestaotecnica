# Capability Matching

## Objetivo
Relacionar padrões observados às capabilities universais, identificando cobertura, composição e gaps sem forçar encaixe.

## Campos e entidades obrigatórios
CapabilityMatch contém pattern_id, capability, versão de referência, grau de cobertura, processos cobertos, entidades mapeadas, regras compatíveis, diferenças, customizações, confiança e decisão do revisor.

## Processo de uso
1. Selecionar padrão validado. 2. Consultar Registry. 3. Comparar intenção, entidades, processos e eventos. 4. Classificar match total/parcial/ausente. 5. Registrar gaps. 6. Submeter à revisão humana.

## Critérios de aceite
O match explica por que existe; dependências são listadas; customização não altera silenciosamente a capability universal; match parcial gera gap; revisor responsável é identificado.

## Exemplo aplicado
O padrão de entrada de demanda combina requests para triagem, communication para canal e documents para anexos. A regra de prioridade local vira adaptação, não mudança universal.

## Riscos e anti-padrões
Escolher capability pelo nome da tela; criar capability para cada cliente; esconder composição; declarar cobertura total ignorando regras ou estados incompatíveis.
