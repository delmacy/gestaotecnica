# SB-S01-T05 — Provar descoberta e execução de task pelo Jules

## Tipo
Teste operacional de orquestração.

## Estado inicial
`blocked` até `SB-S01-T04` estar aprovada ou com findings bloqueadores resolvidos.

## Objetivo de negócio
Comprovar que o novo modelo reduz o prompt humano ao mínimo: informar o ID e o caminho deve ser suficiente para o Jules localizar contexto, entender dependências, respeitar escopo e publicar uma entrega verificável.

## Contexto atual
A governança só é útil se funcionar na prática. Esta task testa o mecanismo de descoberta, não o desenvolvimento de uma funcionalidade comercial. O foco é observar se o agente segue os documentos globais, o contexto da sprint e o contrato individual sem depender da memória do chat.

## Resultado esperado
Criar `DISCOVERY_PROOF.md` com três execuções controladas:

1. uma task de planejamento/documentação;
2. uma task de desenvolvimento read-only ou de ferramenta interna;
3. uma task de review ou teste.

As execuções podem usar tasks da própria Sprint 01 já concluídas em modo de simulação/reexecução segura, ou fixtures específicas criadas para o teste, sem duplicar entregas reais.

## Dependências

- `SB-S01-T01` concluída;
- `SB-S01-T02` concluída;
- `SB-S01-T03` concluída;
- `SB-S01-T04` aprovada;
- catálogo passando no validador.

## Diretórios permitidos

- `docs/product-roadmap/sprint-01-backlog-governance/DISCOVERY_PROOF.md`
- fixtures estritamente dentro da pasta da sprint;
- evidências documentais de execução.

## Diretórios proibidos

- `src/**`;
- schemas/migrations;
- módulos de negócio;
- alterações reais em issues e PRs não criados para a prova;
- mudanças em tasks de outras sprints.

## Protocolo de teste

Para cada execução:

1. fornecer ao Jules apenas:
   - ID da task;
   - caminho do arquivo individual;
   - instrução para ler os documentos obrigatórios;
2. registrar o prompt exato;
3. observar se o agente:
   - encontra os arquivos corretos;
   - identifica dependências;
   - detecta se está blocked/ready;
   - respeita diretórios permitidos e proibidos;
   - cria branch com nome coerente;
   - publica PR isolado ou relatório de bloqueio;
   - inclui evidências exigidas;
4. comparar a entrega com o contrato;
5. registrar falhas e correções necessárias no modelo.

## Métricas obrigatórias

- taxa de localização correta: 3/3 esperada;
- taxa de identificação correta do estado: 3/3 esperada;
- violações de escopo: 0;
- dependências ignoradas: 0;
- arquivos não permitidos no diff: 0;
- prompts adicionais necessários: registrar quantidade e motivo;
- divergências entre PR e contrato: 0 para aprovação.

## Cenários obrigatórios

- task ready;
- task blocked por dependência;
- task de review que não pode implementar correção;
- caminho informado corretamente, mas existência de documentos semelhantes;
- tentativa de expandir escopo;
- necessidade de registrar blocker em vez de improvisar.

## Critérios de aceite

- o Jules encontra e interpreta corretamente as três tasks;
- não precisa receber o conteúdo completo da task no prompt;
- não mistura arquivos, sprints ou responsabilidades;
- bloqueios são respeitados;
- evidências são suficientes para auditoria;
- qualquer falha do modelo gera recomendação concreta antes da Sprint 02.

## Evidências obrigatórias no PR

- prompts exatos usados;
- IDs e caminhos testados;
- branch/PR ou artefato gerado por execução;
- resultado de cada métrica;
- findings e severidade;
- decisão final: modelo aprovado ou necessita correção.

## Fora de escopo

- executar funcionalidades das próximas sprints;
- usar prompts longos que repitam o contrato;
- corrigir código funcional encontrado durante a prova;
- declarar sucesso sem evidência remota.

## Rollback
Remover fixtures e relatório da prova. PRs experimentais devem ser fechados sem merge e identificados como teste, caso tenham sido criados.

## Prompt Jules
Busque a task `SB-S01-T05` em `docs/product-roadmap/sprint-01-backlog-governance/05-provar-descoberta-pelo-jules.md`, execute somente a prova de descoberta e registre evidências sem desenvolver funcionalidades do produto.