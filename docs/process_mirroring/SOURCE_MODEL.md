# Source Model

## Objetivo
Governar as fontes usadas para construir o espelho operacional e tornar cada conclusão rastreável.

## Campos e entidades obrigatórios
Source contém: id, workspace, tipo, proprietário, origem, período coberto, método de coleta, consentimento, classificação de sensibilidade, retenção, confiabilidade, limitações, evidências derivadas e hash/referência quando aplicável.

## Processo de uso
1. Inventariar fontes. 2. Classificar sensibilidade e confiabilidade. 3. Obter autorização. 4. Coletar amostra mínima. 5. Relacionar observações. 6. Registrar limitações. 7. Revisar retenção.

## Critérios de aceite
Toda observação aponta para fonte válida; fonte sensível possui regra de acesso/retenção; limitações são explícitas; fontes conflitantes não são silenciosamente reconciliadas.

## Exemplo aplicado
Uma planilha de ordens concluídas cobre três meses, pertence ao supervisor e não registra cancelamentos. Ela é aceita como fonte parcial, com limitação documentada.

## Riscos e anti-padrões
Copiar conteúdo sem autorização; considerar sistema legado como verdade absoluta; ocultar conflito entre entrevista e log; armazenar documento inteiro quando bastava referência.
