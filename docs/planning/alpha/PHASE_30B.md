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

## 4. Domínio / DDD
- Application Use Case: ViewGatewayReceipts (Leitura)
- Persona: Administrador da Plataforma / Gestor do Workspace
- Decisão Humana: Apenas observação. Nenhuma transição de estado permitida.
- Estados da Entidade: pending (amarelo), success (verde), failed (vermelho).
- Erros de Domínio Visíveis: Detalhes de falha por idempotency ou validação de schema.
- Audit Trail / Receipt: Exibição visual da correlação de eventos.

## 5. Escopo permitido
- Criação de páginas e componentes para a rota `/admin/gateway/receipts`.

## 6. Fora de escopo
- Reenvio (retry) de requisições.

## 7. Entidades e contratos
N/A

## 8. Estados e transições
- Filtros de status.

## 9. Services, repositories e actions esperados
- Server actions de leitura dos recibos.

## 10. UI esperada
- Rota: `/admin/gateway/receipts`
- Tabela com `correlation_id`, status, timestamp.

## 11. Testes obrigatórios
- E2E.

## 12. Frontend impact
- Rota: `/admin/gateway/receipts`

## 13. Critérios de aceite
- Administrador consegue ver o histórico de payloads recebidos e erros.

## 14. Regra de parada
Quando a lista estiver funcional com paginação/filtros simples.

## 15. Prompt para Jules Dev
`Implementar Fase 30B. Crie a interface /admin/gateway/receipts para listar o histórico do gateway criado na Fase 30.`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- Foco apenas em leitura.
