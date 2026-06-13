# EVENT IDEMPOTENCY & DEDUPLICATION CONTRACT

Um sistema distribuído garante resiliência através de retentativas ("retries"), o que inevitavelmente introduz a possibilidade de processar a mesma mensagem múltiplas vezes. Este documento especifica o contrato de Idempotência e Deduplicação no System Builder.

## 1. Producer (Produtor)
- **Event ID Estável:** Cada evento recebe um ID permanente no ato da persistência transacional de domínio. Em caso de repetição do comando original por falha técnica de rede (sem alterar negócio), deve-se usar um "command idempotency key" para evitar criar um evento ou estado de banco diferente do já gerado.
- **Proteção Contra Evento Duplicado:** O produtor assume a responsabilidade de garantir "uniqueness" na geração do ID ou utilizando logs de chaves de comando previas já processadas.

## 2. Dispatcher (Despachante)
- **Claim Seguro:** Qualquer processo que puxe (`pull`) mensagens do outbox precisa segurar o estado com um lock exclusivo transacional (`FOR UPDATE SKIP LOCKED`).
- **Retry & Duplicate Delivery:** Dispatchers falharão ou serão mortos (OOM, timeout). A entrega é classificada como *pelo menos uma vez* (at-least-once). O dispatcher não garante entrega única e a infraestrutura deve estar preparada para envio duplicado se o Ack do broker/webhook externo falhar após a rede ter sido bem sucedida.
- **Attempt Tracking:** O dispatch sempre criará um novo registro de `DeliveryAttempt` isolado, garantindo tracking auditável mesmo em duplicações. O lock ownership não pode ser permanente sem renovação/timeout explícito no outbox.

## 3. Consumer (Consumidor Interno / Trabalhador)
- **Deduplicação / Inbox:** O worker deverá armazenar o seu recebimento assíncrono temporariamente (Inbox ou Dedup Store).
- **Identidade:** A chave que provê identidade em workers baseia-se unicamente em `"source" + "eventId"` combinados ou `"correlationId"` no caso do Agent Gateway.
- **Processamento Repetido Seguro:** Executar a mesma instrução (process instance update, trigger step) precisa ser perfeitamente idempotente (e.g. `UPDATE table SET status = 'done' WHERE status != 'done' AND event_id = $1`). Se já foi consumido, o worker descarta silenciosamente ou emite um ack genérico de sucesso, sem dar fail ou emitir logs alarmistas.
- **Receipt Duplicado Seguro:** Emitir o mesmo receipt duas vezes também será processado idempotentemente e arquivado pela persistência de forma amena.

## 4. Agent Gateway
- **Preservação de Chave:** Quando os clientes que se comunicam através do Gateway enviem uma header `Idempotency-Key`, essa chave deverá ser mapeada e preservada em todo o request pipeline e nos logs originais.
- **Escopo Isolado:** Chaves de Idempotência do Gateway não podem ser cruzadas com eventIds internos ou contextos semanticamente distintos a fim de evitar conflitos entre clientes que enviem chaves genéricas.
