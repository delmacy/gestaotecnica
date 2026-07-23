# Regras determinísticas de execução

## Leitura obrigatória

Antes de executar qualquer task, o agente deve ler:

1. `docs/product-roadmap/README.md`;
2. `docs/product-roadmap/ARCHITECTURE_CONTEXT.md`;
3. `docs/product-roadmap/EXECUTION_RULES.md`;
4. `docs/product-roadmap/TASK_INDEX.md`;
5. `CONTEXT.md` da sprint;
6. arquivo individual da task.

## Entrada e bloqueios

- Só iniciar quando todas as dependências marcadas como obrigatórias estiverem `approved` ou `merged`, salvo autorização explícita da task.
- Se uma dependência estiver ausente, inconsistente ou apenas local, marcar a task como `blocked` e publicar evidência; não improvisar substituto silencioso.
- Se o contrato conflitar com o código atual, registrar a divergência e seguir a decisão arquitetural mais recente documentada. Não expandir escopo sem task corretiva.

## Branch e PR

- Criar branch nova a partir de `origin/main` atual.
- Nome recomendado: `task/<task-id-em-minusculas>-<slug>`.
- Um PR por task.
- Não reutilizar branch contaminada ou PR anterior fechado.
- Não fazer merge, force-push em branch compartilhada, alteração de proteção ou mudança de secrets.

## Controle de escopo

Antes do commit e antes do PR, executar:

```bash
git status --short
git diff --name-only origin/main...HEAD
```

Qualquer arquivo fora de `Diretórios permitidos` deve ser removido, salvo autorização explícita no arquivo da task. Diretórios proibidos têm precedência absoluta.

## Implementação

- Ambiente obrigatório: usar Node.js 24.x para instalar dependências, rodar scripts,
  testes, typecheck e build. Antes de qualquer implementação, executar
  `node --version` e registrar o resultado nas evidências da task/PR. Se o
  ambiente iniciar com Node.js 20 ou 22, o agente deve primeiro tentar ativar
  Node.js 24 com o gerenciador disponível no ambiente (`nvm`, `fnm`, `volta`,
  `mise`, `asdf`) ou instalar/usar Node.js 24 de forma local e não destrutiva.
  Só registrar blocker se a troca para Node.js 24 falhar, incluindo os comandos
  tentados e a saída exata.
- Não confiar em tenant, actor, role ou ownership vindos de input público.
- Não criar fallback global para contornar falta de contexto.
- Não duplicar domínio existente sob outro nome.
- Não misturar correção de arquitetura, módulo e documentação geral no mesmo PR.
- Não adaptar testes para validar apenas existência de função, strings no código ou mocks sem comportamento quando a task exige regra de negócio.

## Reviews

Tasks de review não devem implementar a correção no mesmo PR. Devem produzir findings verificáveis com severidade, arquivo, regra violada, impacto e recomendação.

## Testes

Tasks de teste usam ambiente isolado e registram comandos, dados preparados, resultados e limitações. Falha real gera blocker ou task corretiva; não deve ser mascarada.

## Evidências obrigatórias no PR

- Task ID e caminho do contrato;
- base SHA e head SHA;
- arquivos alterados;
- comandos executados;
- resultados de testes, typecheck, build e architecture check;
- critérios de aceite atendidos ou não;
- gaps e riscos;
- dependências encontradas;
- estratégia de rollback;
- confirmação de ausência de arquivos fora do escopo.

## Estados

- `planned`: definida, ainda sem critérios de entrada completos;
- `ready`: pode ser iniciada;
- `in_progress`: branch remota com execução ativa;
- `review`: implementação publicada e aguardando revisão;
- `blocked`: impedimento documentado;
- `approved`: revisão aprovada, ainda não necessariamente mergeada;
- `merged`: integração confirmada na main;
- `superseded`: substituída por outra task;
- `closed-unmerged`: encerrada sem integração.

## Regra de conclusão

Descrição, evidências e diff real devem concordar. Havendo divergência, prevalece o diff e a task permanece bloqueada.
