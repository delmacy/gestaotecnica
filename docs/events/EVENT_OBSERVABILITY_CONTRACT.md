# EVENT OBSERVABILITY CONTRACT

O sistema baseia seu monitoramento não apenas na base relacional e painéis de admin locais, mas na exportação formal de métricas agregadas operacionais. Este documento descreve as métricas e métricas conceituais futuras associadas ao motor de eventos.

## Métricas Conceituais de Domínio

1. `events_created_total`: Incrementado via hook a cada persistência transacional que origina evento no log (separado por eventType).
2. `outbox_pending_total`: Um gauge ou consulta em read-model do número de registros na fila/tabela de `OutboxEntry` esperando lock/processamento.
3. `outbox_delivery_attempts_total`: Contador total do número de transações de envio intentadas (sejam successful ou failed network call).
4. `outbox_delivery_failures_total`: Contador indicando as tentativas falhas (transport failures, timeouts e timeouts forçados no gateway).
5. `outbox_dead_letter_total`: Incremento isolado por volume de mensagens extintas com poison/permanent status (serve como pager duty primordial - requerem olhar de administrador/desenvolvedor urgente).
6. `receipt_received_total`: Métricas capturando o volume total de recebimentos na malha (`DeliveryReceipt`).
7. `consumer_processing_failures_total`: Reflete workers abortando negócio, gerando "processing error" local ou remoto.
8. `delivery_latency`: Histograma contabilizando latência decorrida entre `createdAt` (nascimento no outbox) e `processedAt`/`finishedAt` (tempo do envio com sucesso para broker externo).
9. `processing_latency`: Diferenciação da taxa anterior para incluir tempos gastos pelos serviços de negócio em `Inbox/Consumer`.
10. `oldest_pending_outbox_age`: Métrica de segurança medindo em milissegundos quanto tempo a mensagem mais antiga está parada na fila `pending` (ajuda a detectar workers down).

## Regras de Logging Estruturado

Os logs gravados no STDOUT (via Logger winston/pino) devem:
- Possuir estruturação JSON garantida.
- Ter obrigatoriamente os metadados: `correlationId` (quando aplicável/disponível), `workspaceId`, `eventId`, e não injetar payload completo.
- Remover informações estritas de token ou senhas de `context` de logs (obrigatório de acordo com EVENT_PAYLOAD_SECURITY_POLICY).

## Alertas Conceituais (Futuro)

- `oldest_pending_outbox_age > X` indica congelamento de pull worker.
- Taxa de variação acelerada para erro em `outbox_dead_letter_total` indica deploy defeituoso num microserviço ou API key expirada de cliente externo.

> Nota: Não implemente telemetria Prometheus ou bibliotecas APM como parte desta fase. O escopo é estrito a design contratual e planejamento arquitetural.
