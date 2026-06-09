# Feature Contract — Fase 34A
## 1. Identificação
- Fase: 34A
- Nome: FeatureProposal Contract
- Tipo: Documental / Contratos
- Dependências: N/A
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Definir Zod schemas e tipos TypeScript para propostas de mudança (FeatureProposal).

## 3. Problema que resolve
Divide a antiga Fase 34 complexa definindo estritamente os dados antes da persistência.

## 4. Escopo permitido
- `src/features/.../types.ts`

## 5. Fora de escopo
- Persistência e UI.

## 6. Entidades e contratos
- Tipos de FeatureProposal: `status`, `payload` e relação de risco/impacto.

## 7. Estados e transições
N/A

## 8. Services, repositories e actions esperados
N/A

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Unit test de tipagem.

## 11. Frontend impact
N/A

## 12. Critérios de aceite
- Tipo gerado.

## 13. Regra de parada
Testes de Zod passando.

## 14. Prompt para Jules Dev
`Implementar Fase 34A. Defina apenas os tipos e Zod schemas para FeatureProposal.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Divisão necessária.
