# OpenCode Local Task Runner

## Objetivo

Executar uma task canônica do System Builder do início ao fim em uma sessão local isolada:

```text
selecionar task ready
→ carregar contexto canônico
→ criar worktree e branch
→ iniciar servidor OpenCode local
→ implementar e testar
→ atualizar progresso e evidência
→ abrir PR
→ aguardar checks
→ corrigir falhas na mesma sessão e PR
→ entregar sem merge
→ apagar sessão e encerrar servidor
```

O runner não faz merge. Aceitação, aprovação e merge permanecem transições separadas do processo de integração.

## Componentes

- `scripts/opencode-task-runner.mjs` — controlador determinístico.
- `opencode.json` — configuração segura do projeto.
- `.opencode/agents/system-builder-task.md` — agente executor de uma única task.
- `.opencode/commands/execute-planned-task.md` — comando interativo equivalente.
- `.opencode/task-runs/` — estado, log do servidor e transcript locais; não versionados.
- `.worktrees/opencode/` — worktrees temporários; não versionados.

## Pré-requisitos

1. Node.js 24 e npm 11 ou superiores, conforme `package.json`.
2. Git instalado e `origin` configurado.
3. GitHub CLI instalado e autenticado:

```bash
gh auth status
```

4. OpenCode instalado e com o provedor/modelo configurado. Na interface do OpenCode, use `/connect` para autenticar o provedor quando necessário.
5. A reorganização documental do PR #999 integrada ou disponível na branch-base usada pela execução.
6. A task deve existir em `docs/phases/<FASE>/TASKS.md` e estar em `ready`.

## Segurança do servidor

Por padrão, o runner exige senha para o servidor local. O OpenCode utiliza Basic Auth quando `OPENCODE_SERVER_PASSWORD` está definido.

PowerShell:

```powershell
$env:OPENCODE_SERVER_PASSWORD = "use-uma-senha-local-forte"
```

Linux/macOS:

```bash
export OPENCODE_SERVER_PASSWORD='use-uma-senha-local-forte'
```

O servidor escuta apenas em `127.0.0.1` e usa uma porta livre automaticamente. `--insecure-local` desativa essa exigência de forma explícita e não é recomendado.

## Executar uma task específica

```bash
npm run opencode:task -- \
  --phase docs/phases/F21-platform-hardening \
  --task SB-CR-09
```

Selecionar a primeira task `ready` da fase:

```bash
npm run opencode:task:next -- \
  --phase docs/phases/F21-platform-hardening
```

Ver apenas a seleção, branch e arquivos de contexto, sem iniciar OpenCode:

```bash
npm run opencode:task -- \
  --phase docs/phases/F21-platform-hardening \
  --next \
  --dry-run
```

Escolher modelo explicitamente:

```bash
npm run opencode:task -- \
  --phase docs/phases/F21-platform-hardening \
  --task SB-CR-09 \
  --model provider/model-id
```

## Retomar uma task

Quando a branch ou o worktree da task já existir:

```bash
npm run opencode:task -- \
  --phase docs/phases/F21-platform-hardening \
  --task SB-CR-09 \
  --resume
```

Se a branch já estiver anexada a um worktree, o runner reutiliza esse diretório e não o remove automaticamente.

## Fluxo executado pelo controlador

### 1. Seleção

O runner lê o Markdown de `TASKS.md`. Ele nunca escolhe uma task `planned`, `blocked`, `review` ou `merged` como nova execução. `--next` seleciona a primeira linha em estado `ready`.

### 2. Contexto

São carregados obrigatoriamente:

- `AGENTS.md`;
- `docs/current/STATUS.md`;
- `docs/current/ROADMAP.md`;
- os três contratos em `docs/agents/`;
- `README.md`, `TASKS.md` e `PROGRESS.md` da fase.

O contexto é enviado para a sessão antes do prompt de implementação.

### 3. Isolamento Git

A branch segue o formato:

```text
<FASE>/<TASK-ID>-<slug>
```

Exemplo:

```text
F21/SB-CR-09-implementar-protecao-no-banco
```

Cada task recebe um worktree próprio. A sessão OpenCode é iniciada dentro desse worktree, impedindo mistura com outras branches.

### 4. Servidor e sessão

O controlador:

1. escolhe uma porta livre;
2. inicia `opencode serve --hostname 127.0.0.1`;
3. verifica `GET /global/health`;
4. cria uma sessão por `POST /session`;
5. injeta contexto;
6. envia a tarefa ao agente `system-builder-task`.

Para inspeção manual, o OpenAPI do servidor está disponível em `/doc` enquanto o processo estiver ativo.

### 5. Implementação e PR

O agente deve:

- modificar somente a task autorizada;
- executar testes reais;
- atualizar `PROGRESS.md`;
- criar ou atualizar evidência em `evidence/`;
- fazer commit e push;
- abrir exatamente um PR contra a base informada;
- nunca aprovar, fechar ou fazer merge.

Se o agente declarar `BLOCKED`, o controlador registra o estado e encerra a sessão sem inventar um PR.

### 6. Checks e correções

Após localizar o PR, o runner consulta:

```bash
gh pr checks <numero>
```

Enquanto houver checks pendentes, aguarda. Se algum falhar, envia os resultados à mesma sessão OpenCode e exige correção na mesma branch e no mesmo PR.

Quando o repositório não publicar checks após o período de graça, são executados localmente:

```text
validate:all, quando existir
ou
lint → typecheck → test:unit → build
```

O número padrão de ciclos de correção é três e pode ser alterado por `--max-fixes`.

### 7. Entrega e encerramento

Uma entrega só é aceita pelo runner quando:

- existe PR aberto para a branch;
- `PROGRESS.md` foi alterado;
- há evidência em `evidence/`;
- checks ou gates locais passaram.

Depois disso, o runner:

- registra estado `delivered`;
- apaga a sessão pela API do OpenCode;
- encerra o servidor local;
- remove o worktree criado pelo runner, salvo `--keep-worktree`.

A branch e o PR permanecem para revisão independente. Nenhum merge é executado.

## Opções principais

| Opção | Função |
|---|---|
| `--phase <pasta>` | pasta da fase ou caminho do `TASKS.md` |
| `--task <ID>` | task específica |
| `--next` | primeira task `ready` |
| `--base <branch>` | base do worktree e PR; padrão `main` |
| `--agent <nome>` | agente OpenCode; padrão `system-builder-task` |
| `--model <provider/model>` | modelo explícito |
| `--max-fixes <n>` | ciclos máximos de correção; padrão 3 |
| `--ci-timeout-minutes <n>` | espera máxima dos checks; padrão 45 |
| `--ci-grace-seconds <n>` | espera antes do fallback local; padrão 90 |
| `--resume` | reutiliza branch/worktree existente |
| `--keep-session` | não apaga a sessão ao final |
| `--keep-worktree` | não remove o worktree ao entregar |
| `--dry-run` | apenas seleciona e carrega contexto |

## Estado e diagnóstico

Os arquivos locais ficam em:

```text
.opencode/task-runs/<run-id>.json
.opencode/task-runs/<run-id>.server.log
.opencode/task-runs/<run-id>.transcript.jsonl
```

Em falha, o worktree é preservado para diagnóstico. Em sucesso, é removido por padrão.

## Operação manual do servidor

Para abrir um servidor fixo sem executar task:

```bash
npm run opencode:serve
```

Verificar saúde:

```bash
curl -u "opencode:$OPENCODE_SERVER_PASSWORD" \
  http://127.0.0.1:4096/global/health
```

A documentação OpenAPI estará em:

```text
http://127.0.0.1:4096/doc
```

## Limites deliberados

- O runner não faz merge.
- O runner não aprova o próprio PR.
- O runner não modifica o estado documental para `validated` por conta própria.
- O runner não executa duas tasks na mesma sessão.
- O runner não cria task ausente nem transforma `planned` em `ready`.
- O runner não substitui o governor remoto; é um executor local isolado para tasks canônicas.
