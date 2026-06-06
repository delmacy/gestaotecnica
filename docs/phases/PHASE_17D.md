# Relatório de Execução — Fase 17D

## Objetivo
Expor uma Server Action do NextJS chamada `startProcessInstanceAction` que se conecta ao Runtime Service criado na Fase 17C, atuando como o boundary isolado e livre de falhas críticas para a interface do usuário.

## Resumo das Ações
O arquivo `src/features/workflow/runtime/runtime.actions.ts` foi criado de acordo com as regras estabelecidas.
A Server Action tem a diretiva obrigatória `"use server"` na primeira linha. Ela recebe requisições assíncronas do client, captura e instila contextos como `workspaceId` (que está "mockado" de forma segura conforme orientação das fases iniciais), e invoca o service `startProcessInstance(db, input)`.

Caso uma exceção suba pelas camadas de banco ou infraestrutura, ela é devidamente empacotada no retorno `{ ok: false, error: ... }` para garantir estabilidade e o padrão Zod do client.

## Assinatura Exposta
`export async function startProcessInstanceAction(processVersionId: string, initialPayload: Record<string, any> = {})`

## Resultados das Validações
A tipagem está aderente e o build do app (`npm run build`) passou com sucesso.
