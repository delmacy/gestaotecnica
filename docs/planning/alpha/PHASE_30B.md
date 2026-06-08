# Feature Contract — Fase 30B

## 1. Identificação
- Fase: 30B
- Nome: Gateway Receipts UI
- Tipo: Frontend
- Dependências: Fase 30
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Criar interface para visualização de recibos de Gateway com base nos metadados da Fase 30.

## 3. Problema que resolve
Frontend Parity Gate para os metadados de rastreabilidade (Correlation ID e Idempotency).

## 4. Escopo permitido
- Criação de páginas e componentes para a rota `/admin/gateway/receipts`.

## 5. Fora de escopo
- Reenvio (retry) de requisições.

## 6. Entidades e contratos
N/A

## 7. Estados e transições
- Filtros de status.

## 8. Services, repositories e actions esperados
- Server actions de leitura dos recibos.

## 9. UI esperada
- Rota: `/admin/gateway/receipts`
- Tabela com `correlation_id`, status, timestamp.

## 10. Testes obrigatórios
- E2E.

## 11. Frontend impact
- Rota: `/admin/gateway/receipts`

## 12. Critérios de aceite
- Administrador consegue ver o histórico de payloads recebidos e erros.

## 13. Regra de parada
Quando a lista estiver funcional com paginação/filtros simples.

## 14. Prompt para Jules Dev
`Implementar Fase 30B. Crie a interface /admin/gateway/receipts para listar o histórico do gateway criado na Fase 30.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Foco apenas em leitura.
