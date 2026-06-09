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

## 4. Domínio / DDD
- Application Use Case: ViewSignalInbox (Leitura)
- Persona: Administrador da Plataforma / Gestor do Workspace
- Decisão Humana: Apenas visualização do raw_payload para debug ou auditoria.
- Estados da Entidade: pending, processed.
- Erros de Domínio Visíveis: Sinais com falha (ex: schema de webhook inválido).
- Audit Trail / Receipt: Exibição do payload exato recebido.

## 5. Escopo permitido
- Rotas e componentes para exibir o `signal_inbox`.

## 6. Fora de escopo
- Edição do sinal.

## 7. Entidades e contratos
N/A

## 8. Estados e transições
- status: pending, processed.

## 9. Services, repositories e actions esperados
- Server actions de leitura.

## 10. UI esperada
- Rota: `/inbox` ou `/workspace/inbox`.
- Drawer com payload JSON.
- Estados vazios, populados, loading e error.

## 11. Testes obrigatórios
- Visual e E2E.

## 12. Frontend impact
- Rota: `/inbox`.

## 13. Critérios de aceite
- Pode ler JSON bruto e status.

## 14. Regra de parada
Lista UI e drawer mostrando payload.

## 15. Prompt para Jules Dev
`Criar UI para Signal Inbox (Fase 31B) mostrando payloads e JSON em drawer.`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- Decisão: UI read-only simples sem processamento aqui.
