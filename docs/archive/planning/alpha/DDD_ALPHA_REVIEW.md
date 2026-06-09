# DDD Alpha Review

Revisão das fases do bloco Alpha (30 a 40B) com a visão do DDD Pragmático.

## Fase 30 / 30B — Gateway Metadata, Correlation ID, Idempotency
- **Bounded Context:** Agent Gateway Context
- **Conceito de Domínio:** `AgentGatewaySubmission` / `GatewayReceipt`
- **Use Case Principal:** `RegisterAgentSubmissionWithIdempotency`
- **Invariantes:** Mesma idempotency_key não gera dois Candidates diferentes. Payload externo deve ser sanitizado.
- **Eventos/Receipts:** `AgentSubmissionReceived`, `AgentSubmissionAccepted`, `AgentSubmissionDuplicated`
- **UI Vinculada:** Fase 30B (Gateway Receipts UI)
- **Riscos de Modelagem:** Salvar payload bruto contendo segredos.
- **Decisão:** Usar `sanitized_payload` e implementar um Anti-Corruption Layer.

## Fase 31 / 31B — n8n Signal Inbox
- **Bounded Context:** Integration Boundary Context
- **Conceito de Domínio:** `SignalInbox`
- **Use Case Principal:** `ReceiveExternalSignalWithIdempotency`
- **Invariantes:** n8n não cria Candidates de forma autônoma. Sinais são mantidos puros até avaliação.
- **Eventos/Receipts:** Retorna HTTP 202 com recibo.
- **UI Vinculada:** Fase 31B (Signal Inbox UI)
- **Riscos de Modelagem:** Tentar aplicar lógica de domínio rica no Boundary.
- **Decisão:** Manter o Inbox simples, apenas persistindo e retornando recibo.

## Fase 32 / 32B — Observation Pipeline
- **Bounded Context:** Observation Context
- **Conceito de Domínio:** `Observation`
- **Use Case Principal:** `GroupSignalsIntoObservation`, `PromoteObservationToCandidate`
- **Invariantes:** Observation deve referenciar fontes determinísticas. Rejeição exige justificativa.
- **Eventos/Receipts:** `ObservationPromoted`, `ObservationRejected`
- **UI Vinculada:** Fase 32B (Observation Review UI)
- **Riscos de Modelagem:** IA complexa invadindo a heurística.
- **Decisão:** Usar heurística local simples (agrupamento de sinais) e focar na decisão humana.

## Fase 33 / 33B — Living Procedures
- **Bounded Context:** Platform / Builder Context
- **Conceito de Domínio:** `LivingProcedure`
- **Use Case Principal:** `PublishLivingProcedure`
- **Invariantes:** Procedimento só pode ser publicado se vinculado a uma versão *publicada* de um processo.
- **Eventos/Receipts:** `ProcedurePublished`
- **UI Vinculada:** Fase 33B (Living Procedures UI)
- **Riscos de Modelagem:** Desalinhamento entre versão do procedimento e versão do processo.
- **Decisão:** Vínculo forte entre IDs das versões publicadas.

## Fase 34 (A-E) — Change Management
- **Bounded Context:** Platform / Builder Context
- **Conceito de Domínio:** `FeatureProposal`, `ChangeRequest`
- **Use Case Principal:** `SubmitFeatureProposal`, `ApproveChangeRequest`
- **Invariantes:** Mudanças em processo publicado geram nova versão e requerem revisão.
- **Eventos/Receipts:** `ChangeRequested`, `ChangeApproved`
- **UI Vinculada:** Fases B/C/D correspondentes.
- **Riscos de Modelagem:** Agrupamento excessivo de complexidade.
- **Decisão:** Quebra da fase em sub-fases menores (A-E) para isolar submissão, aprovação e transição de estado.

## Fase 35 / 35B — Execution Traceability (Se aplicável)
- **Bounded Context:** Runtime Context
- **Conceito de Domínio:** `ExecutionTrace`, `RuntimeLog`
- **Use Case Principal:** `LogStepExecution`
- **Invariantes:** Trace logs são append-only.
- **UI Vinculada:** Fase 35B

## Fase 36 (A-E) — Improvement Proposals
- **Bounded Context:** Observation Context / Builder Context
- **Conceito de Domínio:** `ImprovementProposal`
- **Use Case Principal:** `ProposeImprovementToWorkflow`
- **Invariantes:** Proposta não altera processo publicado ativamente.
- **UI Vinculada:** Fases visuais atreladas.
- **Decisão:** Sub-fases para separar origem, revisão e aplicação de patch.

## Fase 37 / 37B — Authorship & Provenance
- **Bounded Context:** Workspace Governance Context
- **Conceito de Domínio:** `ProvenanceRecord`
- **Use Case Principal:** `RecordEntityProvenance`
- **Invariantes:** Origem (Humano vs Sistema vs Agente) deve ser imutável e verificável.
- **UI Vinculada:** Fase 37B

## Fase 38 / 38B — Workspace Consent
- **Bounded Context:** Workspace Governance Context
- **Conceito de Domínio:** `WorkspaceConsent`
- **Use Case Principal:** `GrantObservationConsent`
- **Invariantes:** Se consentimento for revogado, novas integrações externas para o workspace são bloqueadas.
- **UI Vinculada:** Fase 38B

## Fase 39 — Security Gate
- **Bounded Context:** Platform / Builder Context
- **Conceito de Domínio:** `SecurityAudit`
- **Use Case Principal:** `PerformSecurityGateChecks`
- **Invariantes:** Todas as rotas de agente/boundary exigem validação de escopo ou chaves válidas.
- **Decisão:** Fase de hardening, garantindo validação generalizada.

## Fase 40 / 40B — Agent Registry
- **Bounded Context:** Platform / Builder Context
- **Conceito de Domínio:** `AgentRegistry`, `AgentKey`
- **Use Case Principal:** `RegisterAgent`, `RevokeAgentKey`
- **Invariantes:** Chave revogada barra acesso imediato na camada de adapter (Auth filter).
- **UI Vinculada:** Fase 40B
