# Runtime Responsibility Map

Este mapa estabelece claramente as fronteiras e as responsabilidades para as camadas em torno do motor de execução do fluxo (Runtime Engine). É estritamente proibido misturar responsabilidades destas camadas.

## 1. Definition layer
**Responsável por:**
- **Process definition:** O mapa lógico do processo.
- **Process version:** As versões imutáveis publicadas da definição.
- **Publicação:** O ciclo de vida que transforma o rascunho de builder para algo executável.
- **Definição imutável:** A snapshot (payload JSON) do que é o workflow.
- **Nodes/states:** Entidades estáticas dentro do workflow representadas pelo tipo do nó (Start, Task, Condition, End).
- **Edges/transitions:** Regras de direcionamento de um nó para outro.
- **Actions declarativas:** As descrições estáticas do trabalho a ser realizado ou forms exigidos por um nó.

*Nota: Esta camada descreve **o que** deve acontecer.*

## 2. Runtime application layer
**Responsável por:**
- **Validar comandos:** Validar os dados de entrada de um usuário, sistema ou API via `workspaceId`, payloads, tipagens z.schema.
- **Iniciar instância:** Transformar uma Process Version (publicada) em uma Process Instance ativa.
- **Avançar execução:** Descobrir o próximo nó (Path-Finding), avaliar regras de branch, executar steps sequenciais.
- **Controlar status:** Manter a consistência de status do processo e da execução de ação (`pending`, `active`, `completed`, `failed`).
- **Coordenar transação:** Assegurar atomicity de forma estrita. Se `advanceStep` criar um novo evento e fechar o passo, tudo deve ocorrer numa mesma transação de BD (Tx boundary).
- **Produzir eventos:** Sinalizar à rede os fatos de negócio que acabaram de acontecer (`step.completed`, `process.started`).
- **Mapear erros:** Categorizar e tornar claros os erros operacionais via códigos como `INVALID_INPUT`, `NO_VALID_TRANSITION`.

*Nota: Esta camada descreve o **motor lógico e transacional**.*

## 3. Runtime persistence layer
**Responsável por:**
- **Process instances:** Tabela e persistência do workflow em execução, seu root e current state.
- **Payloads:** Persistir o histórico e snapshots de dados transitando nas execuções das ações de uma instância.
- **Action executions:** Trilhas persistidas das atividades instanciadas.
- **Event log:** Fatos de auditoria para observabilidade.
- **Outbox:** Padrão transacional onde eventos que exigem processamento de rede/mensageria são salvos na própria transação do BD, para serem emitidos depois de forma assíncrona.
- **Isolamento por workspace:** Impedir hard-leakage de dados usando Row-Level Security conceitual (sempre forçar verificação via `workspaceId`).

*Nota: Esta camada garante a **durabilidade e integridade** do estado.*

## 4. Integration layer (Futura)
**Responsável futuramente por:**
- **Webhooks:** Emissão externa dos fatos acontecidos no Runtime.
- **n8n:** A camada agnóstica do sistema para conexões SaaS.
- **Consumers:** Trabalhadores que irão ler a tabela Outbox e processá-la.
- **Retries externos:** Controle e idempotência de recebimento via Webhooks ou APIs.
- **Delivery receipts:** Verificações assíncronas do status final de uma notificação ou callback externo.

*Nota: Esta camada lida com a **assincronicidade com o mundo fora do domínio central**.*
