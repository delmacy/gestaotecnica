# Context Pack: Runtime

## 1. Objetivo do Domínio
O ambiente operacional para materialização e controle em tempo real dos Processos previamente Publicados. Transforma uma planta (Blueprint/Definition Published) em uma entidade ativa com contexto, estado, transições e rastreabilidade viva (Instâncias de Processos e Passos).

## 2. Arquivos Principais (Esperados a partir da Fase 17)
- `src/db/runtime/schema/workflow.ts` (Já existente)
- `src/features/workflow/runtime/runtime.types.ts`
- `src/features/workflow/runtime/runtime.repository.ts`
- `src/features/workflow/runtime/runtime.service.ts`

## 3. Decisões Ativas
- O schema do runtime já existe em `src/db/runtime/schema/workflow.ts`. Não deve ser criado novo arquivo de schema na Fase 17A.
- A modelagem começará pela criação dos contratos TypeScript rigorosos baseados nas tabelas existentes.
- O Runtime depende 100% que as etapas do Process Builder já tenham gerado Definitions e Versions do tipo "Published".
- Nenhuma etapa operacional será misturada (separar schema, repository, e controllers).
- Tabelas primárias são focadas em: `process_instances` (o envelope da execução em andamento) e `process_instance_steps` (cada passo de transição concluído ou em andamento).

## 4. Anti-Escopo
- O Runtime não constrói diagrama ou tipos, isso é do domínio do Builder e Workflow-Definitions.
- Durante MVP e Fases Iniciais (17 e 18), **não** teremos eventos assíncronos plenos via pub/sub (Events System) acoplados ao Runtime; vamos depender de chamadas simples, locais e diretas (Fase 17D).
- Não criar migrations ou novos schemas na Fase 17A.

## 5. Próximas Fases Relacionadas
- **Fase 17A**: Runtime contracts e análise do schema existente.
- **Fase 17B**: Acesso a Dados (Repository).
- **Fase 17C**: Lógica de Negócios (Service).
- **Fase 17D e 17E**: Consumo Server Action e UI Operacional básica.
- **Fase 18A a 18D**: Modelagem de execução e transição de estado.