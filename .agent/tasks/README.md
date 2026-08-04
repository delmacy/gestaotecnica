# OpenCode task queue

A fila é processada em ordem lexicográfica pelos arquivos Markdown em `.agent/tasks/ready/`.

- `ready/`: tarefas disponíveis para execução.
- `completed/`: tarefas movidas pela mesma PR que implementa a mudança.
- `failed/`: tarefas retiradas da fila após decisão operacional.

Cada tarefa deve declarar objetivo, escopo permitido, critérios de aceite, comandos de validação e nível de risco. Use nomes iniciados por prioridade numérica, por exemplo `010-SB-CR-09.md`.

O workflow executa somente uma tarefa por vez. Uma nova tarefa é liberada após o merge da PR anterior; o cron de 15 minutos funciona como watchdog.
