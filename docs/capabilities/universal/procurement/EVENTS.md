# Events — procurement

## Eventos de referência
request_purchase_completed, quote_completed, approve_completed, receive_completed

## Envelope mínimo
event_id, event_type, capability, workspace_id quando operacional, actor, subject, occurred_at, correlation_id, source, version, evidence_refs e payload mínimo necessário.

## Regras
Eventos relevantes são imutáveis, atribuíveis e idempotentes quando recebidos de borda. Correções geram novo evento. Payload externo bruto não vira evento de domínio.

## Exemplo
Uma requisição aprovada compara três cotações.

## Critério de pronto
Produtor, consumidor, gatilho, evidência, privacidade e política de evolução foram definidos.
