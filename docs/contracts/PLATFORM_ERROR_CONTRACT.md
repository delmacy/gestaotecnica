# Platform Error Contract

## Objetivo

Padronizar a estrutura de erros em toda a plataforma para garantir consistência em APIs, logs, workflows e interfaces administrativas. Este contrato assegura que os erros sejam serializáveis, seguros (sem vazamento de informações sensíveis) e contenham contexto suficiente para depuração e feedback ao usuário.

## Envelope Canônico

O envelope de erro deve seguir a seguinte estrutura JSON:

```json
{
  "id": "string (UUID ou EntityID)",
  "code": "CATEGORY.RESOURCE.REASON",
  "category": "validation | domain | authorization | authentication | not_found | conflict | integration | infrastructure | rate_limit | timeout | unexpected",
  "severity": "info | warning | error | critical",
  "message": "Mensagem técnica para desenvolvedores",
  "userMessage": "Mensagem amigável e segura para o usuário final (opcional)",
  "timestamp": "ISO 8601 UTC",
  "workspaceId": "UUID (opcional)",
  "correlationId": "string (opcional)",
  "causationId": "string (opcional)",
  "source": {
    "pointer": "Caminho no JSON/Payload (opcional)",
    "parameter": "Nome do parâmetro (opcional)",
    "component": "Nome do componente (opcional)"
  },
  "details": {
    "key": "value"
  },
  "validationIssues": [
    {
      "path": ["campo", "subcampo"],
      "code": "tipo_do_erro",
      "message": "descrição da falha"
    }
  ],
  "retry": {
    "retryable": boolean,
    "afterSeconds": number (opcional)
  },
  "metadata": {
    "key": "value"
  }
}
```

## Categorias

- **validation**: Erros de entrada de dados, formato ou tipos.
- **domain**: Violação de regras de negócio.
- **authorization**: Falta de permissão para realizar a ação.
- **authentication**: Identidade não verificada ou inválida.
- **not_found**: Recurso solicitado não existe.
- **conflict**: Conflito de estado (ex: duplicidade).
- **integration**: Falha na comunicação com serviços externos.
- **infrastructure**: Falhas de banco de dados, rede ou servidor.
- **rate_limit**: Limite de requisições excedido.
- **timeout**: Operação excedeu o tempo limite.
- **unexpected**: Erros não mapeados ou falhas críticas inesperadas.

## Severidades

- **info**: Informativo, não impede a operação.
- **warning**: Alerta, a operação pode ter continuado com ressalvas.
- **error**: Falha na operação atual, mas o sistema está estável.
- **critical**: Falha catastrófica que pode afetar a estabilidade do sistema.

## Convenção de Códigos

Os códigos devem seguir o padrão `CATEGORIA.RECURSO.RAZAO` em letras maiúsculas:

- `VALIDATION.USER.EMAIL_INVALID`
- `DOMAIN.ACCOUNT.INSUFFICIENT_FUNDS`
- `AUTHORIZATION.WORKSPACE.ACCESS_DENIED`
- `INTEGRATION.STRIPE.PAYMENT_FAILED`

## Segurança

1. **Stack Traces**: Nunca devem ser incluídos no envelope canônico enviado para o cliente ou persistido em logs de nível de aplicação.
2. **Mensagens**: A `message` pode conter detalhes técnicos, enquanto a `userMessage` deve ser sanitizada.
3. **Dados Sensíveis**: Não inclua senhas, tokens ou PII (Personally Identifiable Information) sem necessidade técnica e proteção adequada.

## Retry

O campo `retry` orienta o consumidor se faz sentido tentar a operação novamente e após quanto tempo. Erros de `validation` ou `authorization` geralmente não são retryable sem alteração da requisição.

## Regras para Consumidores

1. Sempre verifique se o erro é retryable antes de implementar lógicas de retentativa.
2. Use o `correlationId` para buscar logs relacionados em caso de suporte.
3. Exiba `userMessage` para o usuário final; use `message` apenas para depuração.
4. Mantenha a imutabilidade do envelope ao propagá-lo entre camadas.
