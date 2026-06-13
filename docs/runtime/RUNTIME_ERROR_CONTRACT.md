# Runtime Error Contract

Estabelece os códigos de erro canônicos que o motor de execução deve devolver.

## Mapeamento Inicial Canônico

| Code | Meaning | Safe Message | Retryable |
|---|---|---|---|
| `INVALID_INPUT` | Input payload com forma errada ou malformada | "Os dados fornecidos para o comando são inválidos." | Não |
| `WORKSPACE_REQUIRED` | Faltou isolamento de tenant | "Contexto de workspace não encontrado." | Não |
| `WORKSPACE_MISMATCH` | Cruzamento ilegal de tenant | "O recurso acessado não pertence ao seu espaço de trabalho." | Não |
| `PROCESS_VERSION_NOT_FOUND` | Publicação apagada ou não identificada | "Versão de processo inatingível." | Não |
| `PROCESS_VERSION_NOT_PUBLISHED` | Execução não roda rascunho | "Este processo não possui versão ativada publicamente." | Não |
| `PROCESS_VERSION_WORKSPACE_MISMATCH` | Versão de outro workspace | "Versão de processo não pertence ao workspace." | Não |
| `INVALID_PROCESS_DEFINITION` | JSON publicado tem shape errada | "Erro na estrutura publicável do motor." | Não |
| `INITIAL_NODE_NOT_FOUND` | Sem nó de origem | "O motor não conseguiu localizar o ponto inicial do fluxo." | Não |
| `INSTANCE_NOT_FOUND` | Acesso fantasma | "A instância solicitada não foi localizada." | Não |
| `INSTANCE_NOT_ACTIVE` | Instância terminal recebeu avance | "Esta instância de processo não está mais aguardando andamentos." | Não |
| `ACTION_EXECUTION_NOT_FOUND` | Step pointer incorreto | "O passo de execução não pôde ser encontrado." | Não |
| `ACTION_EXECUTION_NOT_ACTIVE` | Passo já feito sendo refeito | "Este passo não se encontra mais em andamento." | Não |
| `INVALID_STATE_TRANSITION` | Pulo ilógico | "A transição de estado requisitada violou o gráfico do processo." | Não |
| `AMBIGUOUS_TRANSITION` | Multiplas edges em nó linear não condicional | "Ambiguidade na árvore de direções. Caminho não único." | Não |
| `NO_VALID_TRANSITION` | Chegou numa ponta que não é final | "A engine chegou a uma aresta morta no diagrama." | Não |
| `CONCURRENT_MODIFICATION` | Conflito de transações / locks | "O recurso foi atualizado por outro processo simultâneo. Tente novamente." | Sim |
| `DUPLICATE_COMMAND` | Idempotency repetido | "Este comando já foi processado pelo motor." | Não |
| `PAYLOAD_VALIDATION_FAILED` | Erro validador vs version definition | "Falha de validação dos dados atrelados à carga do nó." | Não |
| `EVENT_WRITE_FAILED` | Outbox atômico falhou (Future) | "Erro em logar dados no sistema." | Sim |
| `OUTBOX_WRITE_FAILED` | Mensageria falhou internamente | "Erro interno no barramento." | Sim |
| `INTERNAL_ERROR` | Falha bruta ou unhandled promise | "Ocorreu um erro interno irrecuperável." | Sim |

Não criaremos nenhuma API de uso agora.
