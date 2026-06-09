# Core Contamination Audit

## 1. Resumo executivo

A auditoria de contaminação do "Core" pelo legado da adaptação anterior ("Gestão Técnica") revelou que enquanto a infraestrutura de dados mais moderna (`src/db/platform/schema`, `src/db/runtime/schema`) e áreas centrais de administração e controle (`src/features/builder`, `src/app/admin`, `src/app/(builder)`, `src/app/operations`) estão limpas, ainda existe uma vasta contaminação em módulos legados de produto (`src/modules`), interfaces antigas (`src/app/workforce`, `src/app/assets`, `src/app/service-orders`) e documentações de planejamento. O objetivo atual não é remover essa contaminação imediatamente, mas sim isolá-la para permitir que o "Core" (System Builder) continue evoluindo independente do modelo de negócio específico.

## 2. Matriz de contaminação

| Área | Status | Evidência | Classificação correta | Ação recomendada | Prioridade |
|---|---|---|---|---|---|
| README.md | contaminated | Termos 'técnica' (5x), 'Gestão Técnica' (2x) | legacy_adaptation | Atualizar termos para referenciar o System Builder | Baixa |
| AGENTS.md | contaminated | Termo 'técnica' (1x) | legacy_adaptation | Remover menções ao negócio legado | Baixa |
| docs/00-current/** | contaminated | 9 ocorrências de termos como 'técnica', 'Gestão Técnica', 'técnico' | legacy_adaptation | Revisar arquivos de status e limites | Média |
| docs/planning/** | contaminated | 26 ocorrências em contratos de feature e limites de agentes | legacy_adaptation | Atualizar planejamento futuro para agnóstico | Média |
| docs/architecture/** | contaminated | 15 ocorrências em DDD guidelines, Platform vs Client e Modules | legacy_adaptation | Revisar documentação arquitetural | Média |
| src/db/platform/schema/** | clean | Nenhuma contaminação encontrada | clean | Manter protegido | Alta |
| src/db/runtime/schema/** | clean | Nenhuma contaminação encontrada | clean | Manter protegido | Alta |
| src/db/legacy/schema.ts | contaminated | Termo 'sobreaviso' (1x) | legacy_adaptation | Isolar em bounded context | Baixa |
| src/features/builder/** | clean | Nenhuma contaminação encontrada | clean | Manter limpo de business logic | Alta |
| src/platform/** | partially_contaminated | 'técnico', 'técnica', 'sobreaviso', 'plantão', 'service order' | partially_contaminated | Mover lógica específica para capabilities | Alta |
| src/app/admin/** | clean | Nenhuma contaminação encontrada | clean | Manter controle abstrato | Alta |
| src/app/(builder)/** | clean | Nenhuma contaminação encontrada | clean | Manter construtor abstrato | Alta |
| src/app/operations/** | clean | Nenhuma contaminação encontrada | clean | Consolidar abstração | Alta |
| src/app/workforce/** | contaminated | 2 ocorrências de 'OS' | legacy_adaptation | Migrar para app operations | Baixa |
| src/app/assets/** | contaminated | 1 ocorrência de 'OS' | legacy_adaptation | Refatorar como feature genérica | Baixa |
| src/app/schedules/** | contaminated | 1 ocorrência de 'sobreaviso' | legacy_adaptation | Desacoplar escala | Baixa |
| src/app/service-orders/** | contaminated | 4 ocorrências de 'OS' | legacy_adaptation | Transformar em Workflow genérico | Baixa |
| src/modules/** | contaminated | 65 ocorrências em múltiplos formulários e actions | legacy_adaptation | Encapsular como capabilities instaláveis | Alta |

## 3. Core limpo

As seguintes áreas foram auditadas e estão **limpas** (sem termos relacionados a "Gestão Técnica"):
- `src/db/platform/schema/**`
- `src/db/runtime/schema/**`
- `src/features/builder/**`
- `src/app/admin/**`
- `src/app/(builder)/**`
- `src/app/operations/**`

Isso indica que o banco de dados principal e a interface central de construção do sistema (Builder) não dependem de regras do negócio legado.

## 4. Contaminações encontradas

Foram identificadas contaminações nos arquivos da plataforma que deveriam ser agnósticos, especialmente em:
- `src/platform/events/default-events.ts`
- `src/platform/workspaces/module-catalog.ts`
- `src/platform/integrations/module-registry.ts`

Estas áreas contêm referências diretas a 'técnico', 'sobreaviso', 'plantão' e 'service order', vazando a lógica do domínio de Gestão Técnica para a infraestrutura de instalação de módulos (Capabilities).

## 5. Legacy/adaptation

A vasta maioria da contaminação (65 ocorrências apenas em `src/modules`) reflete o fato de que a base inicial do código foi adaptada de um produto de "Gestão Técnica". Encontramos dezenas de ocorrências de "OS" (Ordem de Serviço), "técnico", "sobreaviso" em arquivos do tipo:
- `src/modules/service-orders/**`
- `src/modules/workforce/**`
- `src/modules/maintenance-plans/**`
- `src/modules/schedules/**`

Estas áreas devem ser tratadas temporariamente como aplicações de legado ou convertidas em pacotes de "capabilities" instaláveis por Workspace, de forma a não estarem hardcoded no sistema principal.

## 6. Termos proibidos no Core

Os seguintes termos devem ser banidos das áreas consideradas "Core" (`src/features/builder`, `src/db/platform`, `src/platform`, `src/app/(builder)`, `src/app/admin`, etc.):
- técnico / técnica
- Gestão Técnica
- OS / service order
- shift log / escala técnica
- sobreaviso / plantão
- 24h
- manutenção preventiva / manutenção corretiva
- telecom / elétrica
- auxílios / ativo técnico
- técnico responsável / validação técnica

## 7. Termos permitidos no Core

No lugar dos termos proibidos, o Core deve usar a terminologia agnóstica do "System Builder":
- Process Candidate / Workflow / Process Definition
- User / Actor / Assignee
- Workspace / Tenant
- Capability / Module
- Payload / Event / Receipt
- Task / Step / Execution
- Form / Field / Schema

## 8. Recomendações de descontaminação

1. **Blindar a Plataforma**: Realocar hardcoded configs em `src/platform/workspaces/module-catalog.ts` para arquivos de configuração de seeds específicos, ou abstrair termos.
2. **Transformar em Capabilities**: Os diretórios `src/modules/service-orders`, `src/modules/workforce` devem ser movidos mentalmente ou fisicamente para uma estrutura que deixe claro que são extensões instaláveis (Capabilities) e não lógicas padrão para todos os Workspaces.
3. **Descontaminar Documentos de Planejamento**: Atualizar os arquivos `docs/planning/**` e `docs/architecture/**` que mencionam o domínio legado, focando as fases futuras nos termos do System Builder.
4. **Não quebrar o runtime legado agora**: A contaminação visual em `src/modules` e rotas legado (`src/app/workforce`, etc) pode ser ignorada no momento até que a infraestrutura de Capabilities seja capaz de instanciar essas features dinamicamente.

## 9. Próximas tasks sugeridas

- CAP-DOC-A-T02 — Limpeza de termos proibidos na camada `src/platform/`.
- CAP-DOC-A-T03 — Atualização do `README.md` e `AGENTS.md` para remover menções de Gestão Técnica.
- CAP-DOC-A-T04 — Definir nova política de Bounded Context para os módulos em `src/modules/**`.
