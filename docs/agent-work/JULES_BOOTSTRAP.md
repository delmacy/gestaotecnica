# Jules Worker Bootstrap Lifecycle

Este documento descreve o processo de inicialização (bootstrap) e o ciclo de vida operacional de um trabalhador (worker) na Agent Factory.

## Pré-requisitos

Para iniciar o trabalho, o agente deve possuir as seguintes chaves configuradas no ambiente:

- `JULES_WORKER_KEY`: Identificador único do worker (ex: `jules-documentator-01`).
- `AGENT_WORK_DATABASE_URL`: URL de conexão com o banco de dados de controle da Agent Factory.

## Bootstrap

O comando de bootstrap é a porta de entrada para qualquer tarefa. Ele realiza a autenticação do worker, seleciona um recurso compatível (Package ou Review) e estabelece o contrato de execução.

```bash
JULES_WORKER_KEY=jules-documentator-01 \
npm run agent-work -- bootstrap \
  --worker jules-documentator-01 \
  --wave WAVE-01-FOUNDATION
```

### Seleção de Recurso

O serviço de bootstrap segue uma ordem lógica para seleção:
1. **Compatibilidade de Role**: O worker só recebe pacotes destinados à sua role (ex: `documentator` só recebe pacotes com `workerRole: 'documentator'`).
2. **Compatibilidade de Wave**: O pacote deve pertencer à Wave solicitada.
3. **Base SHA**: O `baseSha` do pacote deve ser idêntico ao `baseSha` registrado na Wave.
4. **Dependências**: Todas as dependências do pacote (definidas em `agent_package_dependencies`) devem estar com status `completed`.
5. **Prioridade e Merge Order**: Pacotes com maior prioridade e menor ordem de merge são selecionados primeiro.

### Claim Token e Lease

Ao selecionar um recurso, a Agent Factory emite:
- **Claim Token**: Um token único (hash SHA-256) que prova a posse da tarefa.
- **Lease**: Um "aluguel" temporário (geralmente 1 hora). O worker deve manter a lease ativa através do heartbeat.

### Heartbeat

Para evitar que a tarefa seja considerada "stale" e reaberta para outros workers, o agente deve renovar a lease periodicamente:

```bash
npm run agent-work -- package:heartbeat \
  --worker jules-documentator-01 \
  --package PKG-OPERATION-DOCS-FOUNDATION-001
```

## Kits de Trabalho

Dependendo do recurso selecionado, o worker recebe um "Kit":

- **Task Kit**: Para Module Workers e Documentators. Contém instruções, caminhos permitidos, critérios de aceite e SHA base.
- **Review Kit**: Para Reviewers. Contém o diff da PR, estatísticas de mudanças e checklists de verificação.

## Stop Conditions

O worker deve interromper a execução imediatamente se:
- `invalid lease`: A lease expirou ou foi revogada.
- `SHA divergence`: O HEAD da branch divergiu do esperado.
- `red collision`: Uma colisão crítica de escrita foi detectada em caminhos exclusivos.
- `incomplete dependency`: Uma dependência upstream foi invalidada.
- `failed test`: Testes obrigatórios falharam.
- `failed review`: O pacote recebeu um review com `changes_requested`.
- `failed build`: O projeto não compila mais.

## Exemplos Reais por Role

### Module Worker
```bash
npm run agent-work -- bootstrap --worker jules-dev-shared-contracts-01 --wave WAVE-01-FOUNDATION
```
*Retorno: Package `PKG-SHARED-CONTRACTS-001`, Task Kit com caminhos de contratos.*

### Documentator
```bash
npm run agent-work -- bootstrap --worker jules-documentator-01 --wave WAVE-01-FOUNDATION
```
*Retorno: Package `PKG-OPERATION-DOCS-FOUNDATION-001`, Task Kit focado em `docs/`.*

### Reviewer
```bash
npm run agent-work -- bootstrap --worker jules-reviewer-01 --wave WAVE-01-FOUNDATION
```
*Retorno: Review Package `REV-PKG-001`, Review Kit, Tipo `module`.*

### Integrator
```bash
npm run agent-work -- integration-kit --wave WAVE-01-FOUNDATION
```
*Nota: O integrador geralmente consome o Integration Kit diretamente.*

### Coordinator
```bash
npm run agent-work -- bootstrap --worker jules-coordinator-01 --wave WAVE-01-FOUNDATION
```
*Retorno: Visão geral da Wave, status de todos os pacotes e colisões.*

## Condições de Erro

- `NO_COMPATIBLE_WORK_AVAILABLE`: Não há tarefas prontas que atendam aos requisitos de dependência ou role.
- `BOOTSTRAP_BLOCKED`: O worker está bloqueado por ultrapassar o limite de claims ativos ou por falha de segurança.
- `OPERATION_DOCS_BOOTSTRAP_MISMATCH`: (Específico de documentação) Erro quando o bootstrap seleciona um pacote fora do escopo da missão.
