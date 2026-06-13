# Runtime Payload Contract

O motor hoje depende intensamente de `Record<string, any>`, ocultando regras do contrato de dados.

## Contrato Canônico de Tipagem
Substituir todas as tipagens conceituais TS do core relacionadas a Payload de `Record<string, any>` para `Record<string, unknown>`.

## Gestão do Payload
1. **Payload Inicial:** Fornecido pelo Webhook/Formulário de Entrada.
2. **Input da Action:** No futuro (via Data Mapper), a action injeta no `inputPayload` apenas o corte de payload necessário para o formulário.
3. **Output da Action:** O formulário/task completa a step enviando dados no `outputPayload`.
4. **Merge do Payload:** Na transição de edge, o Engine faz merge (shallow ou deep, a definir) do `outputPayload` da Action com o Payload global da Instância para os passos subsequentes.
5. **Schema Version:** O campo de BD existe como `schema_version`. O contrato determina que sua compatibilidade será estrita (validação de forma antes do Insert).
6. **Dados Sensíveis:** No futuro, suporte a Redaction (substituir chaves `pwd`, `token` por `***`).

Nenhuma refatoração de DB ou TS será feita agora.
