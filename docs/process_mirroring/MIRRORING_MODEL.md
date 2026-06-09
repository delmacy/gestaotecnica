# Mirroring Model

## Objetivo
Representar o processo As-Is validado, incluindo fluxo principal, variantes, decisões, exceções, controles, evidências e trabalho informal.

## Campos e entidades obrigatórios
ObservedProcess agrega ObservedStep, Actor, Role, Tool, System, Artifact, Communication, Decision, Exception, Rule, DataField, Evidence, PainPoint, Workaround, Control, Risk, Metric e ProcessVariant. Cada item possui origem, confiança e vínculo com observações.

## Processo de uso
Capture Sources → Build As-Is Mirror → Identify Work Units → Extract Patterns → Match Capabilities → Compare with Reference Models → Detect Gaps → Adapt to Reality → Validate with Client → Generate Builder Package.

## Critérios de aceite
O espelho cobre início e fim; representa variantes frequentes; identifica decisões e responsáveis; aponta evidências; foi revisado por executores e dono do processo; não confunde As-Is com proposta.

## Exemplo aplicado
Pedido recebido por WhatsApp → registro em planilha → repasse verbal → execução → foto → atualização manual. A variante urgente pula a planilha e gera risco de perda.

## Riscos e anti-padrões
Desenhar somente happy path; apagar workaround por parecer inadequado; inventar regra; modelar tela futura em vez do trabalho atual; declarar validação sem participantes.
