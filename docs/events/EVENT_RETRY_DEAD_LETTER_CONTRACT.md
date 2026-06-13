# EVENT RETRY & DEAD LETTER CONTRACT

Define o contrato sobre como o runtime se recuperará de falhas operacionais e de rede no contexto de dispatching de mensagens assíncronas do outbox e do processamento de workers.

## Definições

- **Retryable Failure:** Falha decorrente de causas transitórias: rede indisponível, timeouts HTTP 5xx, bloqueio de banco/lock, falhas no container de worker. Mensagem deve ser enfileirada novamente.
- **Permanent Failure:** Falha decorrente de quebra estrutural e irremediável sem ajuste de configuração humana: HTTP 400 (Bad Request), Erro 401/403 (Auth Error), Erro de mapeamento estrito (Schema Validation Error), Entidade Alvo que deixou de existir. Nesses casos, o registro sofre "poisoning" para não entupir a fila.
- **Poison Message:** Mensagem malformada (bug lógico de sistema) que causa pânico recorrente no dispatcher e é devolvida em loop até extinguir tentativas.
- **Dead Letter:** Uma entry lógica ou tabela separada (no nosso caso, o estado `dead_lettered` e `deadLetteredAt` no outbox/inbox) indicando repouso. A mensagem não será retentada autonomamente nunca mais.

## Decisões Arquiteturais e Restrições

1. **Limite de Tentativas:** Toda outbox entry possui estritamente o limite em `maxAttempts`. O valor do limite é configurado de acordo com a severidade e SLO do endpoint do processo, mas não deve ser infinito.
2. **Backoff Configurável:** O intervalo entre falhas e a próxima retentativa (`nextAttemptAt`) baseia-se num recuo exponencial padrão (ex: `delay = config_base * (2 ^ attempt)`), protegendo o destino alvo de dDoS e afogamentos temporários.
3. **Replay Imutável:** A retentativa de uma mensagem (ou o envio forçado manual de Dead Letter) nunca gerará um "novo" Event ID nem modificará a outbox entry base, preservando `eventId` original para viabilizar deduplicação na ponta que ouve.
4. **Novo Attempt Id:** Em contrapartida da regra acima, *todas* as vezes que a mensagem sofrer o retentativa do outbox, cria-se obrigatória e invariavelmente uma nova `DeliveryAttempt`.
5. **Replay Manual & Auditoria:** Acionar o "replay" manual de um DLQ pelo operador (e.g. painel de SysAdmin) dispara eventos auditáveis vinculados à identidade de quem agiu, mudando o estado da message entry original novamente para pending, reiniciando count de attempt se for policy, e anotando notas de reconciliação no recibo final (se aprovado).
6. **Persistence e Visibilidade:** Mensagens em "Dead Letter" não evaporam ou são dropadas por política expiratória arbitrária sem documentação/backup em cold storage. Devem permanecer listáveis até intervenção administrativa.
7. **Privacidade de Erros:** Exceções stack-traces completas com informações perigosas (secrets via env, chaves no log) não devem sob hipótese alguma serem serializadas em formato bruto nos campos `lastErrorMessage` e nos attempts, exigindo sanitização na captura.
