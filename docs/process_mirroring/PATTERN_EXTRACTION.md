# Pattern Extraction

## Objetivo
Converter observações repetidas e variantes em padrões explicáveis, sem eliminar diferenças relevantes.

## Campos e entidades obrigatórios
ExtractedPattern registra nome, intenção, sinais de entrada, sequência recorrente, atores, artefatos, frequência, variantes, exceções, contexto aplicável, evidências, confiança e candidatos de capability.

## Processo de uso
1. Agrupar ocorrências comparáveis. 2. Identificar invariantes e variações. 3. Medir frequência. 4. Separar regra de hábito. 5. Validar com executores. 6. Registrar padrão e contraexemplos.

## Critérios de aceite
Padrão possui pelo menos duas evidências ou justificativa explícita; variantes permanecem visíveis; confiança é informada; contraexemplos foram analisados.

## Exemplo aplicado
Em 18 de 20 chamados, o atendente pede foto antes da triagem. O padrão é solicitar evidência visual; duas exceções telefônicas permanecem registradas.

## Riscos e anti-padrões
Chamar preferência individual de padrão; ignorar baixa frequência com alto risco; extrair padrão sem contexto; transformar correlação em regra obrigatória.
