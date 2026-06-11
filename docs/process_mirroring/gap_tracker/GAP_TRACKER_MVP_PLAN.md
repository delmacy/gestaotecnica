# Gap Tracker MVP Plan

## 1. Objetivo do MVP
Criar e implementar uma superfície de Gap Tracker em modo sintético/mock para organizar lacunas que impedem o espelhamento de processos.

## 2. O que o módulo faz
- Lista gaps de processo.
- Classifica gaps por tipo, risco, impacto e status.
- Relaciona gaps com fontes, evidências, observações e capabilities.
- Simula decisões de revisão (client-side state).

## 3. O que o módulo não faz
- Não coleta arquivos reais.
- Não lê filesystem em runtime.
- Não persiste dados no banco.
- Não resolve gaps reais.
- Não desbloqueia validações (REAL-SRC-002, CAP-VAL-002).

## 4. Personas
- Builder / Admin

## 5. Entidades mínimas
- ProcessGap
- GapType
- GapSeverity
- GapImpact
- GapStatus
- GapSourceRequirement
- GapEvidenceRequirement
- GapRisk
- GapOwnerRole
- GapNextAction
- GapReviewDecision
- GapRelation

## 6. Telas/seções mínimas
- Gap List
- Gap Detail
- Risk & Impact Matrix
- Required Sources
- Missing Evidence
- Related Observations
- Related Capabilities
- Next Actions
- Review Decision

## 7. Fluxo de uso
1. Usuário acessa o Tracker.
2. Vê aviso de modo sintético.
3. Filtra gaps.
4. Seleciona gap e vê detalhes, fontes ausentes e risco.
5. Simula decisão de revisão.

## 8. Dados sintéticos permitidos
- Gaps baseados no Pilot Technical Service, Clinic Appointment, e Workshop Repair.
- Gaps sintéticos e pendentes "reais" sem dados reais (PII).

## 9. Dados reais futuros
- IDs reais do runtime, uploads e vínculos confirmados ao As-Is Mirror.

## 10. Regras de risco
- Se falta fonte crítica, o risco aumenta.

## 11. Regras de impacto
- Classificações: low, medium, high, blocking.

## 12. Regras de priorização
- High/Blocking/Critical aparecem com destaque.

## 13. Regras de status
- open, pending_source, pending_review, reviewed_synthetic, blocked_real_source, accepted_for_demo, deferred, closed_synthetic.

## 14. Gaps conhecidos
- Persistência e RBAC serão implementados no futuro (Grupo D bloqueado).

## 15. Critérios de aceite
- Superfície renderiza. Exibe painéis completos usando os dados mock.

## 16. Próximas tasks
- Revisão DEV-GAP-TRACKER-001. As-Is Mirror Mock.
