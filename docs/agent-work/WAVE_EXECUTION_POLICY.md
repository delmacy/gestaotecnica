# Wave Execution Policy

Este documento define as regras e restrições para a execução de ondas (waves) de trabalho na Agent Factory.

## Princípios de Isolamento

A Agent Factory opera sob um modelo de execução paralela isolada, garantindo que múltiplos agentes possam trabalhar no mesmo repositório sem conflitos destrutivos.

### SHA-Base Único
Toda Wave possui um **Base SHA** obrigatório e imutável. Todos os pacotes de trabalho (Work Packages) de uma mesma Wave devem nascer a partir deste SHA exato.
- É proibido fazer `git pull` da `main` durante a execução de um pacote se isso alterar o SHA base de trabalho.
- Divergências de SHA ativam automaticamente uma `stop condition`.

### Branch por Package
Cada Work Package deve ser executado em sua própria branch dedicada.
- Padrão de nomenclatura: `wave-NN/pkg-nome-do-pacote-001`.
- Target da PR: Sempre a branch de integração da wave (ex: `integration/wave-01`).

### Package por Worker
Cada pacote é atribuído a um único Worker (humano ou agente) por vez através de um **Claim**. Um Worker pode ter um limite máximo de claims ativos (definido em `maxActiveClaims`).

## Controle de Acesso (Path Ownership)

O controle de arquivos é gerenciado por três categorias de caminhos:

1.  **Owned Paths**: Arquivos que o pacote *tem permissão de escrita*. A Agent Factory garante exclusividade de escrita nestes caminhos através de `agent_path_claims`.
2.  **Read-only Paths**: Arquivos que podem ser lidos para contexto, mas *não podem ser alterados*.
3.  **Forbidden Paths**: Caminhos estritamente proibidos, inclusive para leitura em alguns contextos de segurança.

## Ciclo de Vida da Execução

### Claims e Leases
Ao iniciar (bootstrap), o worker obtém um `claim` sobre o pacote. Este claim possui uma `lease` (aluguel de tempo).
- Se a lease expirar sem um `heartbeat`, o pacote retorna ao status `ready` e pode ser pego por outro worker.

### Dependências
A execução segue um Grafo Direcionado Acíclico (DAG). Um pacote só entra em status `ready` quando todas as suas dependências declaradas em `agent_package_dependencies` estão com status `completed`.

### Colisões
O `collision-engine` monitora tentativas de múltiplos pacotes reivindicarem o mesmo caminho de escrita.
- **Colisão Vermelha**: Tentativa de escrita em um caminho já sob posse (Owned) de outro pacote ativo. Bloqueia o bootstrap.
- **Colisão Amarela**: Interseção em caminhos de leitura ou contratos compartilhados. Gera um alerta para o Integrador.

## Wave 01 - Foundation (Lotes Reais)

A Wave 01 está organizada nos seguintes lotes de entrega:

### Lote A
- **Shared Contracts**: Definição de interfaces e contratos públicos compartilhados.
- **Operation Docs Foundation**: Documentação base da operação e playbooks da Agent Factory (Este pacote).

### Lote B
- **Runtime Types and Mappers**: Implementação dos tipos de tempo de execução e conversores de dados.
- **Event Types and Mappers**: Definição dos esquemas de eventos e payloads.

### Lote C
- **Runtime Tenancy**: Implementação do isolamento de inquilinos (multi-tenancy) no kernel.

*Nota: O sandbox de prova utilizado para validações técnicas não altera a ordem canônica da execução real definida acima.*

## Stop Conditions e Rollback

### Stop Conditions
O agente deve parar se:
- Lease inválida ou expirada.
- Divergência de SHA base.
- Colisão vermelha detectada.
- Falha em teste obrigatório ou build.

### Rollback
Em caso de falha crítica ou erro arquitetural detectado após o merge:
1.  Os pacotes são revertidos na ordem reversa do merge.
2.  Os claims são liberados e o status do pacote é resetado para `ready` ou `blocked` para correção.
3.  O `rollback_plan` definido na Wave é executado para limpar efeitos colaterais no banco de dados ou infraestrutura.
