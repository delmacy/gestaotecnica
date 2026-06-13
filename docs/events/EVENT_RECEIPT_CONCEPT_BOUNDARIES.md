# BOUNDARIES CONCEITUAIS DE EVENTOS E RECIBOS

Este documento estabelece inequivocamente as diferenças entre os conceitos de Evento, Outbox e Recibos, garantindo responsabilidade própria e impedindo generalizações.

## 1. Occurrence

Um fato que aconteceu no domínio ou sistema. É imaterial até ser formalizado e pode ser provocado por um comando (ex.: um usuário clicando, um sensor disparando).

## 2. Domain Event

Representação imutável de uma ocorrência relevante. Possui semântica e carrega estado do momento de sua ocorrência.

## 3. Persisted Event Record

Registro local e durável do evento ocorrido. Armazenado de forma persistente (ex.: no Event Log/Table) dentro da fronteira transacional que criou a alteração de estado do sistema, sendo a fonte primária de verdade.

## 4. Outbox Entry

Registro transitório e pendente de entrega para um destino ou tópico externo (via Transactional Outbox Pattern). Não é o evento em si, mas um "envelopamento" ou "tarefa" de transporte derivada de um evento.

## 5. Delivery Attempt

Tentativa individual de enviar ou despachar uma mensagem do Outbox. Registra o timestamp, o status da tentativa, falhas parciais e metadados de transporte.

## 6. Delivery Receipt

Registro de que o destino final ou integrador aceitou, rejeitou ou falhou em receber a entrega. É um recibo puramente do transporte/middleware.

## 7. Consumer Processing Receipt

Registro explícito (callback, ack) indicando que um consumidor (destino/worker externo) não apenas recebeu, mas processou a carga com sucesso ou que sofreu falha (permanent/retryable) na execução.

## 8. Traceability Receipt

Canhoto de rastreabilidade voltado à auditoria, evidência legal e cadeia de conhecimento. Comprova que algo aconteceu de ponta-a-ponta, associando evento, atores, consequências e hashes de payloads originais, independentemente do sucesso da entrega.

## 9. Gateway Submission Receipt

Recibo específico da entrada de dados originais pelo Agent Gateway (Gateway -> Platform). Trata-se do "sinal de entrada", atestando o recebimento da requisição pelo gateway, mas não prova a conclusão de um workflow no runtime.

---

### Declarações de Anti-Confusão e Invariantes

- **Gateway Submission Receipt != Runtime Delivery Receipt:** O primeiro documenta o input de dados externos; o segundo documenta a confirmação de entrega ao despachar saídas.
- **Runtime Event != Audit Log genérico:** Evento de runtime modela mudança de estado de domínio; audit log rastreia genericamente interações administrativas.
- **Outbox Entry != Event:** Outbox é transporte transitório; Evento é estado de domínio.
- **Delivery Receipt != Domain Event:** Recibo comprova recebimento de mensagem; Evento comprova uma mudança semântica.
- **Traceability Receipt != Transport Receipt:** O canhoto tem valor legal, analítico e de negócio; o recibo de transporte tem valor apenas técnico/infraestrutura.
