# Checklist MVP — System Builder & Runtime

## Visão Geral
Este checklist destina-se a garantir que as Fases 1 a 20 do MVP do System Builder e Runtime Engine foram entregues de forma satisfatória e atendem às especificações core.

## 1. Blocos de Editor e Canvas (Fases 1-16)
- [x] O usuário consegue acessar a rota `/builder` e ver o Canvas do React Flow vazio ou populado.
- [x] O usuário consegue adicionar nós (Start, End, Human Task, etc) na tela.
- [x] O Painel de Inspetor à direita abre ao clicar em um nó, permitindo editar parâmetros específicos de cada tipo.
- [x] O usuário pode alterar metadados do draft local e utilizar autosave transparente.
- [x] O usuário consegue Exportar e Importar definições JSON localmente sem backend.
- [x] O usuário consegue Salvar Oficialmente a definição no DB e obter um `processDefinitionId`.
- [x] O usuário consegue Publicar uma Versão e transformá-la em status `published`.

## 2. Blocos de Runtime Engine (Fases 17-18)
- [x] A camada de Service consegue instanciar processos a partir de uma "Process Version".
- [x] Existe uma blindagem explícita de validação impedindo rodar processos com status "draft".
- [x] Os repositórios escrevem corretamente em `process_instances` e seus payloads.
- [x] A engine síncrona manual é capaz de calcular qual é o próximo Action Node analisando as `edges` na tree.
- [x] A interface visual permite instanciar e "Avançar Step" nas instâncias mockadas diretamente pelo cliente.

## 3. Blocos de Event Log e Audit (Fase 19)
- [x] Todo processo iniciado (`process.started`) gera log no PostgreSQL.
- [x] Toda conclusão de etapa (`step.completed`) e avanço (`step.started`) gera registro transacional.
- [x] Todo fechamento linear de edges gera evento de encerramento (`process.completed`).
- [x] O sistema de trace pode resgatar timeline de maneira tipada e serializada para APIs futuras.

## 4. Segurança e Tenants
- [x] Todas as consultas Drizzle impõem filtragem cruzada `and(..., eq(table.workspaceId, workspaceId))`.
- [x] O repasse de contextos entre UI -> Action -> Service está bem estabelecido, utilizando fallback seguro ou Auth context apropriado.

**Status Final:** Bloco Técnico 1-20 Encerrado e validado logicamente. Pronto para Alpha.
