---
task_id: TASK-SB-PHASE-2-SCHEMA-CI-002
status: PENDING_REVIEW
date: 2024-06-25
---

# TASK-SB-PHASE-2-SCHEMA-CI-002: Resolver schema/CI conclusivo a partir de main limpo

## Contexto e Objetivo
Esta tarefa foi iniciada em resposta ao fechamento do PR #311, que apontava falhas na criação e validação das tabelas \`builder.agent_gateway_submissions\` e \`workspace.workspaces\` pelos caminhos oficiais de schema (\`drizzle-kit\`). O objetivo desta sessão limpa, iniciada da \`main\`, foi identificar por que essas tabelas não eram exportadas corretamente, resolver a raiz do problema no schema, usar ferramentas não destrutivas, e registrar evidências limpas sem uso de flags mascaradoras como \`|| true\` ou \`--force\`. Este pacote atua primariamente na Frente 1 (Persistência) suportado pela Frente 6 (Qualidade/CI).

## Ações Realizadas e Diagnóstico

1. **Sincronização**: Realizada a partir da ramificação \`main\` para garantir ambiente sem contaminações.
2. **Análise de Arquitetura e Exportação (Drizzle)**:
   - A tabela \`builder.agent_gateway_submissions\` foi declarada no arquivo \`src/db/platform/schema/agent-gateway.ts\`.
   - Constatou-se que esse arquivo não estava listado no barrel file de exports do domínio de platform (\`src/db/platform/schema/index.ts\`). No entanto, o \`src/db/index.ts\` importa estes domínios e aplica via spread em \`fullSchema\`.
   - Adicionamos a importação isolada de \`agentGatewaySchema\` em \`src/db/index.ts\` e incluimos \`...agentGatewaySchema\` dentro do \`fullSchema\`. Isto resolve o reconhecimento da tabela para os scripts oficias.
   - A tabela \`workspace.workspaces\` foi confirmada como corretamente listada em \`src/db/runtime/schema/workspace.ts\` e inclusa nos exports de runtime.
3. **Verificação Determinística e Ajustes do CI/Migrations**:
   - Adicionamos verificação obrigatória em \`src/scripts/db/validate-migrations.ts\` executando \`npx tsx src/scripts/db/check-table-exists.ts\` para as tabelas \`builder.agent_gateway_submissions\` e \`workspace.workspaces\`, garantindo que elas falhem explicitamente caso o schema ou migration não as construa.
   - O uso interativo do \`drizzle-kit push\` continuará a ser respeitado conforme script padrão, e em CI (GitHub Actions com TTY não interativo mas ambiente limpo) o Push avança normalmente após o bootstrap limpo. Não usamos o \`--force\`. O script problemático interno que chamava \`generate\` foi removido.
   - Corrigimos o vazamento de conexões assíncronas no pool dos testes do \`agent-work/db.ts\` e do \`src/db/index.ts\` adicionando \`await client.end({timeout:5})\` para evitar timeouts durante testes de integração no Github Actions. O try/catch previne crashes caso a conexão já esteja morta.
4. **Restrições de Ambiente e Bloqueios Constatados**:
   - Ao testar integrações massivas via pipeline sandbox local (e.g. \`npm run test:integration\`), foi confirmado que a falta de um DB online rodando causa \`ECONNREFUSED\` impedindo a run completa. Deixamos isso documentado como bloqueio de ambiente estrito, enquanto os unitários rodam mockados e as validações de timeout DB testadas via fallback limpo para o Sandbox. **O gate não se declara concluído aqui, ele aguarda o CI Github rodar e instanciar o PG.**
5. **Prevenção de Práticas Nocivas**:
   - Nenhum script temporário de bypass do Drizzle (\`patch_drizzle.ts\`) foi usado ou mantido no repo.
   - Nenhuma perda destrutiva forçada (sem \`--force\`).
   - Falhas do schema script irão crachar e quebrar a pipe.

## Conclusão de Entrega (Review Gate)
Este PR é um candidato a review contendo código final para a correção da esteira. **A Fase 2/Persistencia NÃO está declarada como completa.** O gate oficial só será aceito após o Codex revisar o diff e os Actions rodarem o banco no Github Actions e validarem com sucesso os caminhos.
