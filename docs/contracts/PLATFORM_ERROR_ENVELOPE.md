# Platform Error Envelope

## Objetivo do envelope
Prover um contrato canônico e estruturado para todos os erros gerados na plataforma, garantindo consistência na comunicação entre serviços, logs e interfaces de usuário.

## Campos
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | Sim | Identificador único do erro (e.g., "err_..."). |
| `code` | `string` | Sim | Código de erro legível por máquina (CATEGORY.RESOURCE.REASON). |
| `category` | `string` | Sim | Categoria do erro para fins de roteamento e tratamento. |
| `severity` | `string` | Sim | Nível de severidade do erro. |
| `message` | `string` | Sim | Mensagem técnica do erro em inglês. |
| `timestamp` | `string` | Sim | Data e hora do erro no formato ISO 8601 (UTC). |
| `userMessage` | `string` | Não | Mensagem amigável para o usuário final. |
| `workspaceId` | `string` | Não | ID do workspace onde o erro ocorreu. |
| `correlationId` | `string` | Não | ID de correlação para rastreamento da requisição. |
| `causationId` | `string` | Não | ID do evento ou ação que causou este erro. |
| `source` | `object` | Não | Identifica a origem do erro (pointer, parameter, header). |
| `details` | `object` | Não | Dados técnicos adicionais (UnknownRecord). |
| `validationIssues` | `array` | Não | Lista de falhas de validação específicas. |
| `retry` | `object` | Não | Instruções para tentativa de reprocessamento. |
| `metadata` | `object` | Não | Metadados genéricos adicionais. |

## Categorias
- `validation`: Falha na validação de entrada ou schemas.
- `domain`: Violação de regras de negócio.
- `authorization`: Falha de permissão de acesso.
- `authentication`: Falha na identificação do usuário/serviço.
- `not_found`: Recurso não encontrado.
- `conflict`: Conflito de estado do recurso (e.g., concorrência).
- `integration`: Erro em serviço externo ou integração.
- `infrastructure`: Erro em componentes de infraestrutura (banco, rede).
- `rate_limit`: Limite de requisições excedido.
- `timeout`: Tempo limite de operação excedido.
- `unexpected`: Erros internos não mapeados.

## Severidades
- `info`: Informativo, sem impacto operacional imediato.
- `warning`: Alerta, possível degradação ou comportamento inesperado.
- `error`: Falha em uma operação específica, sem comprometer o sistema todo.
- `critical`: Falha grave que exige intervenção imediata.

## Convenção de Código
O campo `code` deve seguir o padrão: `CATEGORY.RESOURCE.REASON`
Exemplo: `VALIDATION.USER_EMAIL.INVALID_FORMAT`
Caracteres permitidos: `A-Z`, `0-9`, `_`, `.`

## Validation Issues
Cada item em `validationIssues` contém:
- `code`: Código curto da falha (ex: "required").
- `message`: Descrição da falha.
- `path`: Array de strings indicando o caminho do campo (ex: `["user", "email"]`).

## Retry Instruction
- `retryable`: Booleano obrigatório indicando se a operação pode ser repetida.
- `afterSeconds`: Inteiro opcional indicando quanto tempo esperar antes da tentativa.

## Exemplo Mínimo
```json
{
  "id": "err_001",
  "code": "NOT_FOUND.DOCUMENT.MISSING",
  "category": "not_found",
  "severity": "error",
  "message": "Document not found in storage",
  "timestamp": "2023-10-27T10:00:00Z"
}
```

## Exemplo Completo
```json
{
  "id": "err_002",
  "code": "VALIDATION.FORM.INVALID_INPUT",
  "category": "validation",
  "severity": "error",
  "message": "Input validation failed",
  "timestamp": "2023-10-27T10:05:00Z",
  "userMessage": "Por favor, verifique os dados informados.",
  "workspaceId": "123e4567-e89b-12d3-a456-426614174000",
  "correlationId": "corr_999",
  "validationIssues": [
    {
      "code": "min_length",
      "message": "Name must have at least 3 characters",
      "path": ["name"]
    }
  ],
  "retry": {
    "retryable": false
  }
}
```

## Limites Explícitos deste Pacote
- Define apenas o contrato (Zod schemas e TypeScript types).
- Não implementa lógicas de transformação, sanitização ou middlewares.

## Pacotes Futuros (Fora do Escopo)
- `PKG-ERROR-FACTORY-001`: Fábrica para criação padronizada de envelopes.
- `PKG-ERROR-SANITIZER-001`: Utilitários para remover dados sensíveis antes de enviar ao cliente.
- `PKG-ERROR-SERIALIZATION-001`: Helpers para serialização JSON e integração com frameworks.
