# Feature Contract — Fase 31B
## 1. Identificação
- Fase: 31B
- Nome: Signal Inbox UI
- Tipo: Frontend
- Dependências: Fase 31
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Lista e detalhe de payloads brutos em `/inbox`.

## 3. Problema que resolve
Frontend Parity Gate para visualizar requisições do n8n.

## 4. Escopo permitido
- Rotas e componentes para exibir o `signal_inbox`.

## 5. Fora de escopo
- Edição do sinal.

## 6. Entidades e contratos
N/A

## 7. Estados e transições
- status: pending, processed.

## 8. Services, repositories e actions esperados
- Server actions de leitura.

## 9. UI esperada
- Rota: `/inbox` ou `/workspace/inbox`.
- Drawer com payload JSON.
- Estados vazios, populados, loading e error.

## 10. Testes obrigatórios
- Visual e E2E.

## 11. Frontend impact
- Rota: `/inbox`.

## 12. Critérios de aceite
- Pode ler JSON bruto e status.

## 13. Regra de parada
Lista UI e drawer mostrando payload.

## 14. Prompt para Jules Dev
`Criar UI para Signal Inbox (Fase 31B) mostrando payloads e JSON em drawer.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Decisão: UI read-only simples sem processamento aqui.
