# Events — inventory

## Eventos de referência
receive_stock_completed, reserve_completed, issue_completed, reconcile_completed

## Envelope mínimo
event_id, event_type, capability, workspace_id quando operacional, actor, subject, occurred_at, correlation_id, source, version, evidence_refs e payload mínimo necessário.

## Regras
Eventos relevantes são imutáveis, atribuíveis e idempotentes quando recebidos de borda. Correções geram novo evento. Payload externo bruto não vira evento de domínio.

## Exemplo
Uma peça é reservada e baixada por ordem.

## Critério de pronto
Produtor, consumidor, gatilho, evidência, privacidade e política de evolução foram definidos.
