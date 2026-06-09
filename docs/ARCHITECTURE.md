# Architecture

## Modelo modular

| Módulo | Responsabilidade | Saída principal |
|---|---|---|
| `doc` | Governar documentação | padrões e decisões |
| `tasker` | Coordenar trabalho | tasks executáveis |
| `process_mirroring` | Espelhar operação real | processo validado |
| `capabilities` | Definir blocos universais | contratos de capability |
| `enterprise_architecture` | Conectar organização | mapas empresariais |
| `governance` | Definir limites de ação | papéis e políticas |
| `enablement` | Orientar execução humana | guias e checklists |
| `registry` | Indexar capabilities | catálogo e dependências |
| `ui` | Contratar superfícies | view contracts |
| `workflow` | Contratar processos | process contracts |
| `runtime` | Contratar execução futura | execution contracts |
| `integrations` | Contratar bordas | webhook/signal contracts |
| `core` | Sustentar identidade e workspace | contratos centrais |

## Fluxo arquitetural
Observed Work → Process Mirror → Capability Match → Enterprise Map → Adapted Process → Builder Contract.

## Dependências
- Comunicação intermodular ocorre por contratos.
- Dependências circulares são proibidas.
- Registry indexa; não desenvolve capabilities.
- Runtime executa somente versões publicadas.
- Payload externo é normalizado antes de entrar no domínio.
