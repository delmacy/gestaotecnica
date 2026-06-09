# Roadmap Estratégico do System Builder

Este documento projeta a evolução do System Builder a longo prazo, seguindo a filosofia de transformação do trabalho recorrente em processos formais.

## Blocos Concluídos (Fases 1-16)
- **Fundações:** Configuração do projeto, Drizzle, Schemas base.
- **Modelagem Visual:** React Flow, Explorer, Inspector, Local Storage.
- **Persistência Básica:** Save de Definitions, Salvar Oficial, Versões Publicadas.

## Fila do MVP Técnico (Fases 17-19)
- **17. Runtime Core:** Contratos, Repositório e Service do motor de Workflow.
- **18. Step Execution:** Motor de avanço e transição de estados pelo grafo (já em execução/parcialmente implementado).
- **19. Eventos e Rastreabilidade:** Trilha imutável de eventos (`started`, `completed`) e trace receipts básicos.

## Bloco Alpha: Control Plane & Process Candidates (Fases 20-40)
*Este bloco estabelece o "Process Candidate" como camada estratégica de descoberta, preparando a governança para aceitar propostas humanas e, futuramente, agênticas.*

- **Fases 20-27:** Builder Control Plane Shell, Process Candidate Lifecycle, Regras e Formulários.
- **Fase 28:** Agent Gateway Backend
- **Fase 28B:** Agent Candidate Inbox UI
- **Fase 29:** Agent Payload Contract
- **Fase 29B:** Candidate Origin/Evidence UI Refinement
- **Fase 30:** Gateway Metadata, Correlation ID, Idempotency Backend
- **Fase 30B:** Gateway Receipts UI
- **Fase 38:** Workspace Consent Backend
- **Fase 38B:** Workspace Consent UI
- **Fase 37:** Origin/Authorship Backend
- **Fase 37B:** Origin Visibility UI
- **Fase 31:** n8n Signal Inbox Backend
- **Fase 31B:** Signal Inbox UI
- **Fase 32:** Observation Pipeline Backend
- **Fase 32B:** Observation Review UI
- **Fase 33:** Living Procedures Backend
- **Fase 33B:** Living Procedures UI
- **Fase 35:** Metrics Backend
- **Fase 35B:** Workspace Dashboards UI
- **Fase 34A:** FeatureProposal Contract
- **Fase 34B:** FeatureProposal Persistence
- **Fase 34C:** FeatureProposal UI
- **Fase 34D:** FeatureProposal Approval
- **Fase 34E:** FeatureProposal Generate Version
- **Fase 36A:** ImprovementProposal Contract
- **Fase 36B:** ImprovementProposal Persistence
- **Fase 36C:** Diff UI
- **Fase 36D:** Approve Improvement
- **Fase 36E:** Apply Improvement
- **Fase 40:** Agent Registry Backend
- **Fase 40B:** Agent Registry UI
- **Fase 39:** Final Paperclip-ready Security Gate

## Além (Fases 41+)

- **Automações Nativas Complexas:** Workers de longa duração.
- **Multi-Tenant Real:** Billing e Separação física.
- **Marketplace de Adaptações:** Módulos instaláveis entre instâncias.
