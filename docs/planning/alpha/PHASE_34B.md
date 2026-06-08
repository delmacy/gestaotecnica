# Feature Contract — Fase 34B
## 1. Identificação
- Fase: 34B
- Nome: FeatureProposal Persistence/Service
- Tipo: Backend
- Dependências: Fase 34A
- Fase frontend vinculada: Fase 34C
- Status: Planejada refinada

## 2. Objetivo
Criar persistência (tabelas e actions) para FeatureProposal.

## 3. Problema que resolve
Salvar propostas no backend.

## 4. Escopo permitido
- Schema e repositorio.

## 5. Fora de escopo
- UI de diff ou lista.

## 6. Entidades e contratos
- Entidade baseada nos schemas da 34A.

## 7. Estados e transições
- status persistido.

## 8. Services, repositories e actions esperados
- Repositories/Actions de crud básico.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Integ tests.

## 11. Frontend impact
- Gap pendente (34C).

## 12. Critérios de aceite
- Salva dados no banco e vincula `workspace_id`.

## 13. Regra de parada
Services testados.

## 14. Prompt para Jules Dev
`Implementar persistência de FeatureProposal (Fase 34B).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
