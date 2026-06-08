# Fase 28 — Agent Gateway Specification

## 1. Identificação

| Campo | Valor |
|---|---|
| Fase | 28 |
| Status | Concluída com ressalva (aguardando 28B/28C) |
| Tipo | Produto alfa / Blueprint / Módulo |
| Responsável principal | Jules Dev / Jules Documental |
| Revisor | ChatGPT |
| Data de abertura | YYYY-MM-DD |
| Data de aprovação | — |

## 2. Objetivo

Implementar a Fase 28 — Agent Gateway Backend. Criar a fronteira server-side protegida para agentes externos submeterem Process Candidates ao System Builder.

## 3. Escopo permitido

- `src/app/api/agent/route.ts`
- `src/features/platform/gateway/agent-gateway.service.ts`

## 4. Fora de escopo

- Criação do Agente Paperclip em si.
- UI do gateway.

## 5. Arquivos planejados

- `src/app/api/agent/route.ts`
- `src/features/platform/gateway/agent-gateway.service.ts`
- `src/features/platform/gateway/agent-gateway.test.ts`

## 6. Critérios de aceite

- Teste de sucesso com payload válido.
- Teste 401 sem token.
- Teste 401 com token inválido.
- Teste de payload inválido.

## 7. Plano aprovado

Referência:
- `docs/planning/alpha/PHASE_28.md`

Resumo:
Implementar o Agent Gateway focado na criação de Process Candidates via API. A UI será feita na próxima fase.

## 8. Execuções

### Execução 001 — Jules Dev — 2026-06-08

Status: Concluído com ressalva (aguardando 28B/28C)

Arquivos criados:
- `src/app/api/agent/route.ts`
- `src/features/platform/gateway/agent-gateway.service.ts`
- `src/features/platform/gateway/agent-gateway.test.ts`

Arquivos alterados:
- `docs/phases/PHASE_28.md`

Comandos executados:
- `npm run lint`
- `npm run build`
- `npx tsx --test src/features/platform/gateway/agent-gateway.test.ts`
- `git diff --check`

Resultado do lint:
Sucesso (somente avisos antigos, ignoráveis de acordo com regras de transição).

Resultado do build:
Sucesso. Next.js compilou a aplicação adequadamente.

Git status:
Novos arquivos commitados na branch respectiva. Nenhuma quebra.

Bloqueios:
- O mock do teste precisou ser atualizado para testar isoladamente os status da API e payload da Zod, pois as dependências Next exportam serviços imutáveis que previnem o `t.mock.method`. Porém, os limites e autorizações de payload e header x-agent-key estão cobertos.

Observações:
- O frontend está bloqueado nesta etapa e deve seguir no fluxo Frontend Parity Gate na `Fase 28B`.
- Somente `process_candidates` podem ser submetidos via agent.
- A service lida com a abstração `getPlatformDb()` e previne manipulações indevidas em base principal.
- Preservação do `workspace_id` foi garantido e mantida.

## 9. Revisões

### Revisão 001 — ChatGPT — YYYY-MM-DD

Resultado: Pendente

Observações:
- —

Ressalvas:
- —

Decisão:
- —

## 10. Decisões específicas da fase

- Optou-se por utilizar o cabeçalho `x-agent-key` combinado com `process.env.AGENT_GATEWAY_KEY` como porta de autenticação simples e suficiente para a fronteira do Alpha.
- Isolamento absoluto da chamada de persistência na API via schema restrito do Zod (somente Process Candidates e validação restrita de atributos operacionais).

## 11. Gaps encontrados / Frontend Impact
Frontend impact:
- Área afetada: Agent Gateway (Backend apenas)
- Rota(s): /api/agent
- Usuário/persona: System / Agent
- Workspace/global: Global
- Estados cobertos: Sucesso, Unauthorized
- Teste visual/E2E: Não aplicável
- Gap frontend pendente: Fase 28B abrirá a UI para listar as submissões. O princípio de Frontend Parity Gate exige a sequência.

## 12. Histórico de correções

- —

## 12. Revisão de Paridade Visual (Fase 28C)

A implementação do Agent Gateway Backend foi revisada na Fase 28C (Correção de Paridade).
A interface visual correspondente foi adicionada via `/admin/gateway` para garantir o *Frontend Parity Gate*.
Auditorias futuras mais detalhadas (como Correlation IDs) continuam documentadas como pendências e serão tratadas em fases futuras.
