# Relatório de Execução — Fase 17C

## Objetivo
Criar regra de negócio para iniciar instância a partir de uma process version published, validar o input usando Zod e usar o repository da camada anterior.

## Resumo das Ações
Foi criado o arquivo `src/features/workflow/runtime/runtime.service.ts` com a função `startProcessInstance`. Esta função:
1. Valida o input recebido contra `startProcessInstanceInputSchema`.
2. Verifica no banco se a Process Version referenciada existe e se seu status é efetivamente "published". Se não for, retorna `{ok: false, error: {...}}`.
3. Chama o repository para registrar e retornar o envelope `ProcessInstanceRecord` da execução.
4. Salva o payload inicial (se aplicável).
5. Tudo envolto num bloco `try/catch` de segurança genérico.

## Assinatura Exposta
`export async function startProcessInstance(db: RuntimeDb, input: StartProcessInstanceInput): Promise<RuntimeResult<ProcessInstanceRecord>>`

## Resultados das Validações
O Typescript compilou e não apresentou vazamentos de "any" nas assinaturas expostas. O padrão de retorno exigido nas políticas ({ok, data} ou {ok, error}) foi rigorosamente obedecido.
