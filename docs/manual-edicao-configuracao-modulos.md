# Manual de Edicao e Configuracao de Modulos por Cliente

Este manual explica como adaptar a plataforma para um cliente sem quebrar o core.

## 1. Regra principal

O core fornece capacidades universais; os modulos fornecem blocos reutilizaveis
de dominio; a adaptacao configura vocabulario, fluxos, papeis e regras locais
de cada cliente.

Antes de alterar codigo, classifique a mudanca:

- Core: capacidade reutilizavel por varios clientes.
- Modulo: comportamento de dominio reutilizavel.
- Adaptacao: vocabulario, tipos, filas, templates, papeis e regras locais.
- Base: schema ou persistencia necessaria para sustentar configuracao real.

## 2. Onde editar cada coisa

Use `src/adaptations/secao-tecnica` para a primeira adaptacao:

- `terminology.ts`: nomes exibidos para entidades.
- `demand-types.ts`: tipos de demanda e comportamento de triagem.
- `service-order-types.ts`: tipos de ordem de servico.
- `asset-types.ts`: familias de ativos.
- `shift-types.ts`: tipos de escala e regras simples.
- `roles.ts`: papeis de negocio.
- `queues.ts`: filas operacionais.
- `workflows.ts`: estados iniciais por entidade.
- `report-templates.ts`: modelos de relatorio.
- `document-templates.ts`: modelos documentais.
- `legacy.ts`: configuracao do sistema oficial/legado.

O app deve importar `activeAdaptation` de `src/adaptations/active.ts`.
Componentes e actions nao devem importar `secao-tecnica` diretamente.

## 3. Como criar uma nova adaptacao

1. Crie uma pasta em `src/adaptations/<cliente>`.
2. Copie a estrutura de `src/adaptations/secao-tecnica`.
3. Ajuste labels, tipos, filas, papeis, workflows e templates.
4. Troque `src/adaptations/active.ts` para exportar a nova adaptacao.
5. Rode lint e build.
6. Teste os modulos que usam selects e labels configuraveis.

Exemplo:

```ts
export { clienteXAdaptation as activeAdaptation } from "./cliente-x";
```

## 4. Como editar um modulo existente

Quando um modulo precisar de uma nova opcao configuravel:

1. Evite adicionar um array fixo dentro de `src/modules/<modulo>`.
2. Adicione a configuracao na adaptacao ativa.
3. Exponha um helper ou constante no modulo que leia `activeAdaptation`.
4. Preserve os contratos do modulo.
5. Documente a configuracao em `docs/modulos`.

Exemplo:

```ts
import { activeAdaptation } from "@/adaptations/active";

export const workItemTypes = activeAdaptation.demandTypes.map((item) => ({
  value: item.key,
  label: item.label,
}));
```

## 5. Quando alterar a base

Altere o schema apenas quando a configuracao precisar ser editada em runtime,
por usuario administrador ou por workspace no banco.

Hoje, a plataforma usa a adaptacao em codigo como camada de transicao. Isso e
adequado para o MVP e para validar os contratos.

Migre para tabelas quando:

- houver mais de uma adaptacao ativa em producao;
- tipos precisarem ser alterados sem deploy;
- clientes precisarem ter configuracoes diferentes no mesmo ambiente;
- filtros, permissoes ou relatorios dependerem de configuracao persistida.

## 6. Checklist para novos clientes

- Definir nome do workspace.
- Definir vocabulario do cliente.
- Mapear tipos de demanda.
- Mapear tipos de OS.
- Mapear tipos de ativo.
- Mapear escalas, turnos e indisponibilidades.
- Mapear papeis de negocio.
- Mapear filas.
- Mapear fluxos de aprovacao.
- Mapear modelos de documento e relatorio.
- Mapear sistema legado e estrategia de integracao.
- Validar quais modulos entram no escopo inicial.

## 7. Checklist antes de entregar

- `npm run lint`
- `npm run build`
- Validar `/workspace-config`
- Validar formularios de demandas
- Validar formularios de escalas
- Validar cadastro de tecnicos
- Revisar documentacao da adaptacao
- Registrar futuras alteracoes de schema em `docs/base`

## 8. Modulos atualmente ligados ao catalogo do workspace

- WorkItems: tipos de demanda lidos de `work_item_type_definitions`.
- Schedules: tipos de escala lidos de `schedule_type_definitions`.
- Workforce: papeis tecnicos compativeis lidos de `business_role_definitions`.
- Workspace Config: leitura do pacote ativo, catalogo de modulos e configuracao.

A adaptacao em codigo continua sendo a origem versionada do bootstrap. Depois
de semeados, os formularios e validations desses modulos passam a consultar o
catalogo persistido no Postgres.

## 9. Proxima evolucao recomendada

A proxima etapa e migrar gradualmente enums para tabelas por workspace:

- `work_item_type` para `work_item_types`;
- `schedule_type` para `schedule_types`;
- `technician_level` para `business_roles`;
- status fixos para `workflow_states`;
- templates em codigo para `document_templates` e `report_templates`.
