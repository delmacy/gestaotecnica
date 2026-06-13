# EVENT CORRELATION & TRACE CONTRACT

Este documento solidifica os contratos e limites sobre como vinculamos ações, eventos e origens em todo o sistema para facilitar rastreamento e auditoria em larga escala, diferenciando os domínios lógico (Aplicação) e de rede (Infraestrutura).

## Conceitos Definitórios

### Correlation Id (`correlationId`)
- **Natureza:** Domínio / Aplicação (Business).
- **Propósito:** Agrupar uma "cadeia de eventos". Toda e qualquer consequência desencadeada por uma ação inicial ou solicitação externa. Exemplo: um upload no gateway que cria instâncias, gera análises automáticas e emite faturas; todos compartilham o mesmo `correlationId`.

### Causation Id (`causationId`)
- **Natureza:** Domínio / Aplicação (Business).
- **Propósito:** Apontar para o antecedente imediato e direto (seja um evento anterior que desencadeou uma reação automática do trabalhador do workflow, ou um comando emitido pelo operador).
- **Regra:** Causation é uma ligação entre pai-filho estrito. Correlation é uma ligação de "irmandade de transação de negócio".

### Trace Context (`traceParent` / `traceState`)
- **Natureza:** Infraestrutura / Transporte (W3C Trace Context).
- **Propósito:** Instrumentação para a observabilidade do fluxo na malha de serviços ou APMs (latência de request em HTTP, brokers, lambda).
- **Regra Limitante:** Jamais use o `traceParent` no lugar de `correlationId` para lógica de negócio, e nunca baseie deduplicação ou processos de regras usando tracing IDs.

### IDs Relacionados Internamente
- `commandId`: Referência ao comando (intent/ação) inicial.
- `eventId`: A identidade própria e exclusiva de cada ocorrência.
- `parentEventId` / `rootEventId`: Alternativas contextuais/suplementares ao causation caso a aplicação crie grafos arbitrários em domínios específicos.

## Regras Canônicas

1. **Início de Correlação:** Um comando ou evento original externo inicia uma nova correlação (gera UUID/Correlation próprio ou assimila via Gateway). Um evento contínuo que decorre disto sempre absorve e copia a correlação.
2. **Identidade Exclusiva:** Nenhum evento jamais reutiliza um ID. Dois eventos numa mesma correlação têm `correlationId` igual, mas obrigatoriamente IDs (`eventId`) distintos.
3. **Ponteiro Imadiato:** `causationId` aponta apenas para a causa 1 nível acima no tempo/espaço da reação do sistema (Comando > Evento > Processo Interno Reage > Dispara Comando > Novo Evento).
4. **Respeito às Fronteiras:** Correlação e observabilidade/transporte não devem ser acopladas no motor de persistência. A base se encarrega estritamente da correlação como metadado de negócio imutável.
