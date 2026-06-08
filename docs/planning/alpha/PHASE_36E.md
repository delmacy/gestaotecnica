# Feature Contract — Fase 36E
## 1. Identificação
- Fase: 36E
- Nome: Apply Improvement
- Tipo: Backend
- Dependências: Fase 36D
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Gerar nova versão ou change proposal a partir do diff.

## 3. Problema que resolve
Transforma o node mudado na baseline de um novo workflow process version.

## 4. Escopo permitido
- Geradores de version.

## 5. Fora de escopo
- UI.

## 6. Entidades e contratos
- Nova versão de processo baseada num apply de diff.

## 7. Estados e transições
- published.

## 8. Services, repositories e actions esperados
- Apply Service.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Testes unit de merges.

## 11. Frontend impact
N/A

## 12. Critérios de aceite
- Gera uma nova versão sem mutar a antiga.

## 13. Regra de parada
Teste de apply passando.

## 14. Prompt para Jules Dev
`Gerar nova versão do processo com melhoria aplicada sem alterar o anterior (Fase 36E).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
