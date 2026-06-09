# Events — requests

## Eventos de referência
capture_request_completed, triage_completed, prioritize_completed, convert_completed

## Envelope mínimo
event_id, event_type, capability, workspace_id quando operacional, actor, subject, occurred_at, correlation_id, source, version, evidence_refs e payload mínimo necessário.

## Regras
Eventos relevantes são imutáveis, atribuíveis e idempotentes quando recebidos de borda. Correções geram novo evento. Payload externo bruto não vira evento de domínio.

## Exemplo
Uma mensagem vira solicitação triada e depois ordem.

## Critério de pronto
Produtor, consumidor, gatilho, evidência, privacidade e política de evolução foram definidos.
