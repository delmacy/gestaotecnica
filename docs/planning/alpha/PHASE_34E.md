# Feature Contract — Fase 34E
## 1. Identificação
- Fase: 34E
- Nome: Generate New Process Version
- Tipo: Backend
- Dependências: Fase 34D
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Gerar nova versão publicada a partir de proposta aprovada.

## 3. Problema que resolve
O desfecho de Feature Proposals aprovadas, mantendo imutabilidade.

## 4. Escopo permitido
- Lógica de geração no Process Service.

## 5. Fora de escopo
- UI.

## 6. Entidades e contratos
- Rastreabilidade mandatória pra versão antiga e proposta base.

## 7. Estados e transições
- Gera novo process_version imutável.

## 8. Services, repositories e actions esperados
- Action Generate.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Unit Test de geração e vínculo.

## 11. Frontend impact
N/A

## 12. Critérios de aceite
- Não sobrescrever versão antiga.

## 13. Regra de parada
Testes de geração passando.

## 14. Prompt para Jules Dev
`Implementar a geração de nova versão de processo a partir de FeatureProposal aprovada (Fase 34E).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
