# Events — documents

## Eventos de referência
create_document_completed, review_completed, sign_completed, archive_completed

## Envelope mínimo
event_id, event_type, capability, workspace_id quando operacional, actor, subject, occurred_at, correlation_id, source, version, evidence_refs e payload mínimo necessário.

## Regras
Eventos relevantes são imutáveis, atribuíveis e idempotentes quando recebidos de borda. Correções geram novo evento. Payload externo bruto não vira evento de domínio.

## Exemplo
Um laudo é revisado, assinado e arquivado.

## Critério de pronto
Produtor, consumidor, gatilho, evidência, privacidade e política de evolução foram definidos.
