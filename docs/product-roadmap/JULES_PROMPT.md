# Prompt padrão para o Jules

Use este prompt sem reescrever a task inteira:

```text
Busque a task <TASK_ID> em <CAMINHO_DA_SPRINT>.

Leia também:
- docs/product-roadmap/README.md
- docs/product-roadmap/TASK_INDEX.md

Execute somente o contrato da task indicada.
Respeite tipo, dependências, modo de execução, escopo e critérios de aceite.
Crie branch nova a partir da main atual.
Não misture arquivos de outras tasks ou sprints.
Execute os checks aplicáveis.
Publique um PR isolado com:
- task ID;
- arquivos alterados;
- checks executados;
- resultados;
- riscos e gaps;
- dependências ainda bloqueadas.
Não faça merge automático.
```

## Exemplos

```text
Busque a task SB-S01-T01 em docs/product-roadmap/sprint-01-backlog-governance/README.md e desenvolva.
```

```text
Busque a task SB-S06-T27 em docs/product-roadmap/sprint-06-commercial-modules/README.md e desenvolva.
```

## Prompt de review

```text
Busque a task <TASK_ID> em <CAMINHO_DA_SPRINT> e execute apenas a etapa de review. Compare o diff real com o contrato, valide escopo, dependências, testes e critérios de aceite. Não implemente correções no mesmo PR; publique findings verificáveis.
```

## Prompt de teste

```text
Busque a task <TASK_ID> em <CAMINHO_DA_SPRINT> e execute apenas a etapa de teste. Use ambiente isolado, registre comandos, resultados e falhas. Não altere a implementação para fazer o teste passar sem abrir task corretiva separada.
```