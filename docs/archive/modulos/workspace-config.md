# Modulo: Workspace Config

## 1. Objetivo

Exibir e documentar a configuracao ativa do workspace/cliente.

## 2. Responsabilidades

- Mostrar qual adaptacao esta ativa.
- Listar modulos do ecossistema.
- Mostrar contagens de tipos, filas, papeis, workflows e templates.
- Servir como painel de conferencia para novas adaptacoes.

## 3. Universalidade

O modulo e reutilizavel porque qualquer cliente precisa saber qual pacote de
configuracao esta ativo e quais modulos compoem seu escopo.

## 4. Pontos de adaptacao

- nome do workspace;
- pacote ativo;
- catalogo de modulos habilitados;
- filas;
- tipos;
- papeis;
- templates.

## 5. Entidades e tabelas atuais

Nesta etapa, a configuracao e lida de `src/adaptations/active.ts`.

## 6. Actions / use cases

- consultar configuracao ativa;
- validar cobertura do pacote de adaptacao;
- orientar edicao por cliente.

## 7. Queries principais

- `getWorkspaceConfigOverview`

## 8. Eventos emitidos

Nenhum evento nesta primeira versao.

## 9. Dependencias

- `src/adaptations/active.ts`
- `src/platform/workspaces/types.ts`
- componentes shadcn de interface

## 10. Limitacoes atuais

Ainda nao ha edicao em runtime. A configuracao e alterada em codigo, versionada
e validada por build.

## 11. Evolucao futura

- habilitar/desabilitar modulos por workspace;
- persistir configuracoes no banco;
- editar filas e tipos via UI administrativa;
- versionar adaptacoes por cliente.

## 12. Possiveis alteracoes de base

O modulo deve futuramente se conectar a `workspaces`,
`workspace_module_configs`, `work_item_types`, `schedule_types`,
`business_roles`, `document_templates` e `report_templates`.
