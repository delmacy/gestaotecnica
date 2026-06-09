# Próximo Handoff Técnico

Você é Jules Dev.

Sua próxima missão é implementar a **Fase 28B — Agent Candidate Inbox mínimo**.

## 1. Leitura obrigatória
- `docs/planning/alpha/PHASE_28B.md`
- `docs/planning/FRONTEND_PARITY_GATE.md`

## 2. Objetivo
Criar uma tela autenticada mínima (`/admin/gateway` ou estender `/candidates`) para visualizar Process Candidates cuja origem seja 'agent'. Não prometa logs ou correlações complexas; apenas exiba a lista e os detalhes básicos que vêm do gateway.

## 3. Escopo permitido
- `src/app/(builder)/admin/gateway/page.tsx`
- Modificação em `src/components/builder/candidates/...` se estender a área existente.

## 4. Fora de escopo
- Tabela do Drizzle de Receipts e Idempotency (isso é Fase 30).
- Publicação direta sem revisão.

## 5. UI Esperada
- Tabela com lista de propostas filtrando `origin=agent` (se origin existir, senão crie a lógica de filtro).
- Estado vazio, Loading, Erro.

## 6. Testes obrigatórios
- E2E na rota.

## 7. Critérios de aceite
- Frontend Parity Gate para a Fase 28 atingido;
- Usuário vê os dados submetidos pelo Agente.

## 8. Regra de parada
- Não avance para as demais fases até esta interface estar operacional e em PR.

No seu relatório final, aponte a rota, o comportamento testado e se o E2E completou.
