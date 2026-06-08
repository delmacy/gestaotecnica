# Alpha Reordering Decision

## Contexto
O bloco Alpha do roadmap inicial precisava de reorganização para garantir segurança, rastreabilidade e coerência na evolução da plataforma, especialmente em relação ao Frontend Parity Gate e à integração com agentes.

## Decisões Tomadas
1. **Fase 39 passa a ser gate final Alpha**: A integração Paperclip-ready serve como verificação de segurança, garantindo que a base está pronta para agentes orquestradores.
2. **Fase 40/40B deve ocorrer antes da Fase 39**: O registro de agentes deve existir para testar o gate de segurança.
3. **Fase 38/38B antecipada**: O consentimento por workspace precisa existir antes de ativar a observação por IA/n8n.
4. **28B será reduzida**: Focará no Agent Candidate Inbox mínimo, sem prometer metadados complexos antes da Fase 30.
5. **30/30B assumem metadata**: Correlação, idempotência e recibos passam a ser o core das Fases 30 e 30B.
6. **Fases 34 e 36 serão quebradas**: A complexidade exige subfases (34A-E, 36A-E) para persistência, diff e aprovação versionada.
7. **Política de Rotas**: O Alpha usará a política de 'workspace ativo por contexto'.

## Nova Ordem
(Veja ROADMAP_100_FASES.md para a ordem completa e revisada).
