# SB-S01-T03 — Criar validador do catálogo de tasks

## Tipo
Desenvolvimento de ferramenta interna.

## Estado inicial
`blocked` até a aprovação ou merge de `SB-S01-T01`.

## Objetivo de negócio
Impedir que o catálogo volte a ficar inconsistente à medida que novas tasks, sprints e dependências forem adicionadas. O validador deve transformar regras de governança em verificações determinísticas.

## Contexto atual
O roadmap é composto por arquivos Markdown e IDs estáveis. Sem validação automática, podem surgir IDs duplicados, links quebrados, dependências inexistentes, ciclos, arquivos fora do índice ou tasks sem campos obrigatórios.

## Resultado esperado
Criar um script read-only, preferencialmente em `scripts/validate-product-roadmap.ts`, com testes próprios, capaz de validar todo o diretório `docs/product-roadmap/`.

## Validações mínimas

- ID único no catálogo;
- ID listado no `TASK_INDEX.md` possui arquivo ou entrada correspondente;
- arquivo individual possui título com o mesmo ID;
- dependências referenciam IDs existentes;
- nenhum ciclo de dependência;
- sprint do arquivo corresponde ao prefixo do ID;
- campos mínimos presentes: tipo, estado inicial, objetivo, dependências, diretórios permitidos/proibidos, critérios de aceite, evidências, rollback e prompt;
- task marcada como paralela não depende diretamente da task paralela;
- caminhos referenciados existem quando forem internos ao roadmap;
- ausência de placeholders não resolvidos como `<ID>`, `TODO` ou `TBD` em tasks marcadas `ready`.

## Interface esperada

Comando sugerido:

```bash
npx tsx scripts/validate-product-roadmap.ts
```

O script deve:

- sair com código `0` quando válido;
- sair com código diferente de zero quando inválido;
- listar erros com arquivo, regra e mensagem;
- produzir saída determinística e ordenada;
- não alterar arquivos.

## Dependências

- `SB-S01-T01` aprovada ou mergeada;
- estrutura base de `docs/product-roadmap/` presente.

## Pode executar em paralelo com
`SB-S01-T02`, desde que não edite `TASK_INDEX.md` e use o inventário aprovado.

## Diretórios permitidos

- `scripts/validate-product-roadmap.ts`
- testes específicos do validador em `tests/unit/` ou diretório equivalente existente;
- documentação da task dentro da sprint;
- `package.json` somente se for indispensável adicionar um script npm, sem alterar dependências.

## Diretórios proibidos

- módulos em `src/modules/**`;
- schemas e migrations;
- código do Builder/runtime;
- outras ferramentas não relacionadas.

## Requisitos não funcionais

- sem acesso de escrita ao GitHub;
- sem rede;
- execução rápida;
- mensagens legíveis por humano e agente;
- parser tolerante a Markdown, mas estrito nos contratos obrigatórios;
- evitar dependência externa nova quando Node/TypeScript já forem suficientes.

## Testes obrigatórios

Fixtures ou arquivos temporários devem provar:

- catálogo válido;
- ID duplicado;
- dependência inexistente;
- ciclo A → B → A;
- sprint incompatível com ID;
- task ready com placeholder;
- campo obrigatório ausente;
- índice apontando para task inexistente.

## Critérios de aceite

- todos os cenários negativos falham de forma específica;
- o catálogo atual válido passa;
- nenhuma alteração é feita nos arquivos validados;
- saída e ordenação são determinísticas;
- o PR não contém mudanças funcionais do produto.

## Evidências obrigatórias no PR

- comando de execução;
- saída de sucesso;
- saída resumida dos testes negativos;
- arquivos alterados;
- confirmação de ausência de nova dependência, ou justificativa se houver;
- base SHA e head SHA.

## Fora de escopo

- validar código de negócio;
- alterar automaticamente o catálogo;
- consultar estado do GitHub em tempo real;
- implementar workflow CI nesta task, salvo se explicitamente necessário e sem ampliar escopo.

## Rollback
Remover script, testes e eventual entrada de npm script.

## Prompt Jules
Busque a task `SB-S01-T03` em `docs/product-roadmap/sprint-01-backlog-governance/03-criar-validador-catalogo-tasks.md`, implemente apenas o validador read-only e seus testes.