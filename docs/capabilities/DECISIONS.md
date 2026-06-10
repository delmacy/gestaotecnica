# Decisões — capabilities

## CAPABILITIES-DEC-001 — Documentação precede implementação

- **Status:** accepted
- **Decisão:** este módulo evolui por tasks, decisões e contratos antes de código.
- **Consequência:** qualquer necessidade técnica encontrada vira dependência no Tasker.

## DEC-CAP-001 — Fronteiras das capabilities universais antes de validação setorial

- **Data:** 2024-06-10
- **Módulo:** capabilities
- **Decisão:** As 24 capabilities são mantidas como catálogo universal. O primeiro MVP da Gestão Técnica usa apenas um subconjunto (MVP Capability Core). Capabilities setoriais só nascem após Process Mirroring ou necessidade comprovada. Sobreposições devem ser resolvidas por composição, não absorção indevida.
- **Motivo:** O piloto atual não possui fontes reais para validação conclusiva. Reduzir o acoplamento desde já garante arquitetura limpa sem inventar demandas operacionais.
- **Consequência:** Implementação futura deve respeitar o núcleo (organization, people, requests, work_orders, documents, audit, communication, scheduling) antes de integrar outras capabilities.
- **Status:** accepted
