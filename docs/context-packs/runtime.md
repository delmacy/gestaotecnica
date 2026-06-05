# Context Pack: Runtime

## 1. Objetivo do Domínio
O ambiente operacional para materialização e controle em tempo real dos Processos previamente Publicados. Transforma uma planta (Blueprint/Definition Published) em uma entidade ativa com contexto, estado, transições e rastreabilidade viva (Instâncias de Processos e Passos).

## 2. Arquivos Principais (Esperados a partir da Fase 17)
- `src/db/runtime/schema/workflow-runtime.ts` (A planejar)
- `src/features/runtime/process-instance.repository.ts` (A planejar)
- `src/features/runtime/process-instance.service.ts` (A planejar)

## 3. Decisões Ativas
- O Runtime depende 100% que as etapas do Process Builder já tenham gerado Definitions e Versions do tipo "Published".
- Nenhuma etapa operacional será misturada (separar schema, repository, e controllers).
- Tabelas primárias futuras serão focadas em: `process_instances` (o envelope da execução em andamento) e `process_instance_steps` (cada passo de transição concluído ou em andamento).

## 4. Anti-Escopo
- O Runtime não constrói diagrama ou tipos, isso é do domínio do Builder e Workflow-Definitions.
- Durante MVP e Fases Iniciais (17 e 18), **não** teremos eventos assíncronos plenos via pub/sub (Events System) acoplados ao Runtime; vamos depender de chamadas simples, locais e diretas (Fase 17D).

## 5. Próximas Fases Relacionadas
- **Fase 17A**: Modelagem estrutural (Schema).
- **Fase 17B**: Acesso a Dados (Repository).
- **Fase 17C**: Lógica de Negócios (Service).
- **Fase 17D e 17E**: Consumo Server Action e UI Operacional básica.
- **Fase 18A**: Modelagem de execução e transição de estado.