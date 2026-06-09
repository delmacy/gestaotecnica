# Feature Contract — Fase 28B

## 1. Identificação
- Fase: 28B
- Nome: Agent Candidate Inbox mínimo
- Tipo: Frontend
- Dependências: Fase 28
- Fase frontend vinculada: N/A (Esta é a fase frontend)
- Status: Planejada refinada

## 2. Objetivo
Criar uma tela autenticada mínima para visualizar Process Candidates originados por agente.

## 3. Problema que resolve
O Agent Gateway permite a submissão de candidatos, mas não há visualização desses dados no painel administrativo/gestão. Isso cobre a regra de Frontend Parity Gate para a Fase 28.

## 4. Escopo permitido
- `src/app/(builder)/admin/gateway/page.tsx` ou equivalente.
- Componentes de lista para visualizar candidatos com origem "agent".

## 5. Fora de escopo
- Implementar metadata complexa (correlation_id, idempotency, etc), que será tratada na Fase 30.
- Editar processos diretamente nesta tela.

## 6. Entidades e contratos
N/A - Foco em Frontend. Os dados virão da estrutura existente de Process Candidates, filtrados.

## 7. Estados e transições
- Visualização apenas.
- Estados da lista: vazia, populada, loading, erro.

## 8. Services, repositories e actions esperados
- A UI deve consumir actions/queries existentes que listam candidatos (filtrando por origem).

## 9. UI esperada
- Rota: `/admin/gateway` ou `/candidates` com filtro.
- Componentes: Tabela ou lista mínima.
- Estado vazio: "Nenhum candidato originado por agentes."

## 10. Testes obrigatórios
- E2E garantindo que a tela carrega e exibe itens com `origin=agent`.

## 11. Frontend impact
- Área afetada: Dashboard / Gateway
- Rota(s): `/admin/gateway`
- Teste visual/E2E: Coberto.
- Gap frontend pendente: Detalhes de rastreabilidade completa (Fase 30).

## 12. Critérios de aceite
- Usuário consegue navegar até a tela.
- Lista exibe candidatos recebidos via API.

## 13. Regra de parada
Após a listagem básica funcionar e passar nos testes, sem tentar adicionar logs complexos.

## 14. Prompt para Jules Dev
`Implementar a Fase 28B (Agent Candidate Inbox mínimo) conforme o contrato docs/planning/alpha/PHASE_28B.md. Criar a rota /admin/gateway ou adaptar /candidates para listar itens cuja origem seja 'agent'. Não implementar correlação/recibos ainda.`

## 15. Prompt para Jules Tester
`Rodar testes e garantir que a rota de inbox de agentes está acessível e exibe o estado de carregamento e vazio de forma adequada.`

## 16. Riscos e decisões
- Decisão: Não prometer logs e receipts nesta fase para manter a entrega simples, alinhada com as limitações do MVP do Gateway.
