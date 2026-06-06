# Fase 25 — Publish Candidate to Workflow Template

## Objetivo
Construir o pipeline que transforma um Candidate aprovado em um Workflow Template oficial.

## Contexto
Um Process Candidate isolado não roda. Ele precisa ser 'compilado' em um template oficial nas tabelas `workflow.process_definitions`.

## Arquivos permitidos
- `src/features/builder/candidates/candidate.publisher.ts`

## Arquivos proibidos
- UI.
- Execução do processo instanciado (Runtime).

## Regras
- O publisher só aceita Candidates em status `approved`.
- O processo publicado deve referenciar a ID do Candidate de origem como auditoria.

## Etapas
1. Desenvolver a lógica que mapeia os states/transitions do candidato para a estrutura do ProcessDefinition.
2. Salvar a nova versão no banco.

## Validações
- Validação estrita dos dados antes do mapping.

## Relatório final esperado
- Lógica de compilação/publicação concluída.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 25 — Publish Candidate to Workflow Template

Objetivo:
Construir o pipeline que transforma um Candidate aprovado em um Workflow Template oficial.

Escopo:
Permitido criar o serviço de publicação mapeando Candidate -> Workflow Definition.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie o transformador que traduz o Candidate para o formato canônico do Runtime.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Publish Candidate to Workflow Template. Pare e solicite review.
```
