# CONSUMER RECEIPT & INBOX CONTRACT

Estabelece as regras conceituais e contratos futuros em relação a forma como o System Builder *consome* (processa assincronamente) os eventos ou comandos despachados para ele por fontes internas ou externas.

## Conceitos Chave

1. **InboxEntry:** Assim como Outbox transporta do sistema para o exterior de forma transacional, o Inbox armazena mensagens vindas de fora (ou de event busses internos) que precisam ser processadas. É a tabela base para o modelo assíncrono idempotente.
2. **ConsumerProcessingReceipt:** O registro oficial de qual "worker" interno ou listener terminou de lidar com uma dada `InboxEntry` ou `Event`. É semelhante ao DeliveryReceipt, porém ocorre estritamente do lado de quem processa as mensagens, e não de quem envia.
3. **ConsumerDeduplicationKey:** Representa a chave de colisão a ser monitorada no processamento. Um worker consumindo um evento (ex. do rabbit/SQS/pubsub interno) utilizará essa chave (geralmente `source` + `eventId`) para determinar se deve processar ou descartar.

## Invariantes Estritas

- **At-Least-Once Delivery & Duplicação Segura:** Por natureza de sistemas distribuídos e infraestrutura futura, assumimos que consumidores e inboxes receberão a mesma mensagem mais de uma vez. O design garante processamento idempotente. NUNCA assumiremos exactly-once delivery real via rede.
- **Deduplicação de Eventos:** Utilizará a composição da identidade principal do Evento (source + eventId, ou messageId/correlationId quando externo) como trava na tabela Inbox ou dedup store (e.g. constraints em tabela de banco transacional).
- **Processamento Transacional (Onde Possível):** A persistência da mudança de negócio (o "update" em um Process Instance ou Aggregate) DEVE transacionar com o encerramento do `InboxEntry` (e emissão visual de Receipt do Consumer). Caso isso não possa ser transacionado, será preferida idempotência de read/write.
- **Falhas de Processamento do Consumidor:** Diferenciaremos sempre falhas permanentes (e.g. ValidationError, Entidade não encontrada, Contract Error) de falhas de rede (`retryable`/`transient`). Falhas permanentes não devem encher filas, parando rapidamente em 'poison messages'/dead letters internos e emitindo o `ConsumerProcessingReceipt` marcando "failed" com causa atestada.
- **Implementação:** A tabela Inbox física, dedup store real e os workers/processors *não* serão implementados nesta fase. As regras ficam como design aprovado para implementação nas fases vindouras.
