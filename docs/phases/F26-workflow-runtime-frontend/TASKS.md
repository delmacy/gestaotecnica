# Tasks — F26 Workflow, Runtime & Frontend Parity

Os IDs são preservados, mas o escopo deve consolidar o engine existente em vez de recriá-lo.

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| SB-WE-01 | Consolidar motor de execução de workflow | F24, F25, inventário runtime | planned | state machine existente reconciliada, testada e documentada |
| SB-WE-02 | Engine de formulários dinâmicos | WE-01 | planned | schema versionado renderiza e valida sem confiar no cliente |
| SB-WE-03 | Visualizador de instância | WE-01 | planned | estado, timeline, dados e receipts visíveis conforme permissão |
| SB-WE-04 | Triggers orientados a eventos | WE-01, F25 | planned | triggers idempotentes, autorizados e auditáveis |
| SB-WE-05 | Jobs assíncronos e consumidor | F21 outbox, WE-01 | planned | retry, idempotência, dead-letter e observabilidade |
| SB-WE-06 | Binding Paperclip/n8n na borda | WE-04..05 | planned | integração traduz sinais para contratos internos sem governar o core |
| SB-WE-07 | Design system necessário às jornadas | UX contracts | planned | componentes acessíveis e estados padronizados, sem biblioteca paralela desnecessária |
| SB-WE-08 | Auditoria de paridade frontend | WE-01..07 | planned | cada capacidade backend possui superfície ou gap rastreado |
| SB-WE-09 | E2E dos caminhos críticos | WE-01..08 | planned | três jornadas reais passam em ambiente reproduzível |
| SB-WE-10 | Portal da API Gateway | F25, WE-06 | planned | documentação, playground seguro e credenciais escopadas por tenant |

## Inventário mínimo de `SB-WE-01`

- runtime contracts, repository e service históricos;
- instanciação e avanço de steps;
- event logs e trace receipts;
- Builder draft/publish;
- APIs e UI de instância;
- testes smoke e E2E já existentes.

Cada item recebe decisão `reuse`, `extend` ou `replace` com plano de migração.
