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

- **20. Builder Control Plane Shell:** UI administrativa avançada (sidebar, densidade, properties panel).
- **21-25. Process Candidate Lifecycle:** Ontologia, UI Manual de Candidatos, Governança Humana e Publicação para Template.
- **26-27. Regras e Formulários:** Forms como padronização da informalidade, e Políticas de Aprovação (ex: timeout, exceções).
- **28-29. Agent Gateway & Builder Agent:** Especificação e APIs para comunicação imutável e controlada de Agentes propondo processos, além da especificação do primeiro Agente Construtor.
- **30-31. Fronteiras de Integração:** Paperclip Integration Strategy e n8n como barramento de sinais.
- **32-34. Observation Pipeline:** Signal Inbox, Document Agent (Procedimento Vivo), e Feature Agent (Mudança Controlada).
- **35-37. Métricas & Elicitação Dupla:** Inteligência Operacional, Formato padrão de Proposta de Melhoria, e Metodologia de Elicitação Humano/Máquina.
- **38-40. Governance & MVP Ready:** Consentimento de Observação, Milestone de MVP Paperclip-Ready, e Modelo Operacional Multiagente futuro.

## Além (Fases 41+)
- **Automações Nativas Complexas:** Workers de longa duração.
- **Multi-Tenant Real:** Billing e Separação física.
- **Marketplace de Adaptações:** Módulos instaláveis entre instâncias.
