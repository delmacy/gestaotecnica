# Manual de Edição e Configuração de Módulos por Cliente

Este manual explica como adaptar a system builder platform para um cliente sem
quebrar o core. O objetivo não é configurar um único sistema de gestão técnica,
mas montar soluções operacionais sob medida a partir de módulos, packs,
workspaces e adaptações.

## 1. Regra principal

O core fornece capacidades universais; os módulos fornecem blocos reutilizáveis
de domínio; a adaptação configura vocabulário, fluxos, papéis e regras locais
de cada cliente.

Antes de alterar código, classifique a mudança:

- Core: capacidade reutilizável por vários clientes.
- Módulo: comportamento de domínio reutilizável.
- Adaptação: vocabulário, tipos, filas, templates, papéis e regras locais.
- Base: schema ou persistência necessária para sustentar configuração real.

## 2. Onde editar cada coisa

Use `src/adaptations/secao-tecnica` como primeira adaptação de referência:

- `terminology.ts`: nomes exibidos para entidades.
- `demand-types.ts`: tipos de demanda e comportamento de triagem.
- `service-order-types.ts`: tipos de ordem de serviço.
- `asset-types.ts`: famílias de ativos.
- `shift-types.ts`: tipos de escala e regras simples.
- `roles.ts`: papéis de negócio.
- `queues.ts`: filas operacionais.
- `workflows.ts`: estados iniciais por entidade.
- `report-templates.ts`: modelos de relatório.
- `document-templates.ts`: modelos documentais.
- `legacy.ts`: configuração do sistema oficial/legado.

O app deve importar `activeAdaptation` de `src/adaptations/active.ts`.
Componentes e actions não devem importar `secao-tecnica` diretamente.

Depois que o bootstrap cria os registros no banco, edições operacionais de
labels e descrições podem ser feitas em `/workspace-config`. Essa tela atualiza
os catálogos persistidos sem exigir alteração de código para ajustes simples de
linguagem do cliente.

Também é possível criar novas opções e ativar/desativar itens. Itens inativos
continuam preservados no banco para histórico e reativação, mas deixam de
aparecer nos formulários dos módulos.

## 3. Como criar uma nova adaptação

1. Crie uma pasta em `src/adaptations/<cliente>`.
2. Copie a estrutura de `src/adaptations/secao-tecnica`.
3. Ajuste labels, tipos, filas, papéis, workflows e templates.
4. Troque `src/adaptations/active.ts` para exportar a nova adaptação.
5. Rode lint e build.
6. Teste os módulos que usam selects e labels configuráveis.

Exemplo:

```ts
export { clienteXAdaptation as activeAdaptation } from "./cliente-x";
```

## 4. Como editar um módulo existente

Quando um módulo precisar de uma nova opção configurável:

1. Evite adicionar um array fixo dentro de `src/modules/<modulo>`.
2. Adicione a configuração na adaptação ativa.
3. Exponha um helper ou constante no módulo que leia `activeAdaptation`.
4. Preserve os contratos do módulo.
5. Documente a configuração em `docs/modulos`.

Se a mudança for label, descrição, ativação ou uma opção local simples, use
`/workspace-config`. Se a nova chave precisar fazer parte do produto-base ou
ser reaproveitada em futuros clientes, adicione também na adaptação versionada
para que o bootstrap continue documentando a intenção original.

Em manuais gerais, use linguagem neutra de plataforma: cliente, workspace,
operação, módulo, pack, action, event e flow. Termos específicos como sala
técnica, plantão, sobreaviso e livro de turno devem aparecer apenas na
documentação da adaptação correspondente.

Exemplo:

```ts
import { activeAdaptation } from "@/adaptations/active";

export const workItemTypes = activeAdaptation.demandTypes.map((item) => ({
  value: item.key,
  label: item.label,
}));
```

## 5. Quando alterar a base

Altere o schema apenas quando a configuração precisar ser editada em runtime,
por usuário administrador ou por workspace no banco.

Hoje, a plataforma usa a adaptação em código como camada de transição. Isso é
adequado para o MVP e para validar os contratos.

Migre para tabelas quando:

- houver mais de uma adaptação ativa em produção;
- tipos precisarem ser alterados sem deploy;
- clientes precisarem ter configurações diferentes no mesmo ambiente;
- filtros, permissões ou relatórios dependerem de configuração persistida.

## 6. Checklist para novos clientes

- Definir nome do workspace.
- Definir vocabulário do cliente.
- Mapear tipos de demanda.
- Mapear tipos de OS.
- Mapear tipos de ativo.
- Mapear escalas, turnos e indisponibilidades.
- Mapear papéis de negócio.
- Mapear filas.
- Mapear fluxos de aprovação.
- Mapear modelos de documento e relatório.
- Mapear sistema legado e estratégia de integração.
- Validar quais módulos entram no escopo inicial.

## 7. Checklist antes de entregar

- `npm run lint`
- `npm run build`
- Validar `/workspace-config`
- Validar `/auth/setup` e `/auth/login`
- Validar `/admin`
- Validar `/admin/users`
- Validar `/admin/workspaces`
- Validar `/admin/workflows`
- Validar `/admin/permissions`
- Validar `/admin/queues`
- Validar formulários de demandas
- Validar formulários de escalas
- Validar cadastro de técnicos
- Revisar documentação da adaptação
- Registrar futuras alterações de schema em `docs/base`

## 8. Módulos atualmente ligados ao catálogo do workspace

- WorkItems: tipos de demanda lidos de `work_item_type_definitions`.
- Schedules: tipos de escala lidos de `schedule_type_definitions`.
- Workforce: papéis técnicos compatíveis lidos de `business_role_definitions`.
- Assets: tipos de ativo lidos de `asset_type_definitions`.
- Documents: templates documentais lidos de `document_template_definitions`.
- Reports: templates de relatório lidos de `report_template_definitions`.
- ServiceOrders: tipos de OS lidos de `service_order_type_definitions`.
- Workspace Config: leitura do pacote ativo, catálogo de módulos e configuração.

A adaptação em código continua sendo a origem versionada do bootstrap. Depois
de semeados, os formulários e validations desses módulos passam a consultar o
catálogo persistido no Postgres.

## 9. Próxima evolução recomendada

A plataforma já possui fundação para Auth, RBAC, User Management, Workspace
Admin, Workflow Engine, Comments/Attachments e Queue/SLA. A próxima etapa é
integrar esses blocos profundamente aos fluxos operacionais e migrar
gradualmente enums restantes para tabelas por workspace:

- `work_item_type` para `work_item_types`;
- `schedule_type` para `schedule_types`;
- `technician_level` para `business_roles`;
- status fixos para `workflow_states`;
- templates em código para `document_templates` e `report_templates`.
