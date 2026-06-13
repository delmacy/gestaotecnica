# Integration Error Contract

- Erros originados de falha de conexão (Timeout/502) são classificados como `RETRYABLE`.
- Erros originados de payload mal formado (400) ou não autorizado (401/403) são classificados como `TERMINAL`.
- Detalhes sensíveis de erros não vazam no log exposto, ficando apenas as mensagens genéricas, mas o `Delivery Attempt` no banco pode conter o stack trace seguro/sanitizado.
