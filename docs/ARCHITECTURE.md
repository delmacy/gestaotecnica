# Architecture

## Camadas de Escopo e Foco

A arquitetura do projeto obedece à decisão (DEC-SB-001) que define três camadas prioritárias:
1. **System Builder Platform (Foco Imediato):** Módulos e infraestrutura base. Construção estrutural e agnóstica de cliente.
2. **Demo Sintética (Facilitador):** Dados sintéticos (SIMULATED_OBSERVATION) que permitem desenvolver a plataforma sem dependência de fontes reais bloqueantes.
3. **Gestão Técnica (Piloto Futuro):** Instância de cliente real, cujo espelhamento exige fontes reais mas que não impede o avanço das camadas 1 e 2.

## Projeção de federação

O System Builder deve evoluir para suportar instâncias federadas: instalações isoladas de clientes, filhas gerenciadas pela plataforma principal, instâncias operadas por parceiros/devs delegados, peers federados e instâncias emancipadas. Essa camada fica acima do modelo multi-tenant por workspace e deve preservar portabilidade, auditoria e revogação.

A projeção detalhada está em `docs/product-roadmap/FEDERATED_INSTANCE_SCOPE.md`. Até essa trilha ser materializada, nenhuma funcionalidade deve assumir administração remota irrestrita, compartilhamento de superuser ou replicação direta de banco entre instalações.

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
