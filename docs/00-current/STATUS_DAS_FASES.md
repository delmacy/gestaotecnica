# Status das Fases — System Builder

## 1. Como usar este documento

Este arquivo registra o andamento fase a fase. Deve ser atualizado ao final de cada fase.

## 2. Legenda

```text
✅ Concluída
🟡 Em andamento
⚪ Pendente
🔴 Bloqueada
```

## 3. Status atual

| Fase | Status | Resumo                   | Observações                                              |
| ---: | ------ | ------------------------ | -------------------------------------------------------- |
|    1 | ✅      | Documentação fundacional | MVP, glossário, referência n8n e anti-escopo             |
|    2 | ✅      | Bootstrap de schemas     | Schemas lógicos garantidos antes do Drizzle              |
|    3 | ✅      | Tipos e catálogo Builder | Modelo interno independente de React Flow                |
|    4 | ✅      | Shell visual corrigido   | `/builder` usa `src/features/builder`                    |
|    5 | ✅      | Canvas React Flow        | React Flow isolado em `canvas`                           |
|    6 | ✅      | Inspector por tipo       | Configs específicas em `node.config`                     |
|    7 | ✅      | Validação visual         | Errors/warnings usando `validateBuilderDraft`            |
|    8 | ✅      | Ações locais de draft    | Export/import/reset/rename                               |
|    9 | ✅      | Autosave local           | localStorage com restauração                             |
|   10 | ✅      | Preview local            | Simulação sem runtime real                               |
|   11 | ✅      | Schema de persistência   | Definitions/versions preparados                          |
|  12B | ✅      | Organização documental   | Criar memória do projeto e porta de entrada para agentes |
|   12 | ✅      | Service de persistência  | Service/repository para definitions/versions             |
|   13 | ✅      | API/server action        | Criar/listar/carregar processo via servidor              |
|   14 | ✅      | Salvar pela UI           | Adicionar botão salvar oficialmente na interface         |
|   15 | ✅      | Abrir processos salvos   | Listar e carregar definições salvas                      |
|   16 | ✅      | Publicar versão          | Transformar versão draft em published                    |
|  16C | ✅      | Context Packs e Board    | Consolidação da gestão governamental (Jules Documental)  |
|  17A | ✅      | Runtime contracts        | Análise do schema de runtime existente e contratos TS    |
|  17B | ✅      | Runtime repository       | Leitura e escrita isolada de runtime de instâncias       |
|  17C | ✅      | Runtime service          | Business logic do runner e instanciador                  |
|  17D | ✅      | Runtime server action    | Exposição server-side de comandos de instâncias          |
|  17E | ✅      | UI Mínima para instância | Visual para instanciar as execuções de um processo       |
|  18A | ✅      | Execução: Contratos      | Modelagem TS para processar as transições de etapas      |
|  18B | ✅      | Execução: Repository     | Operações de busca e finalização de steps                |
|  18C | ✅      | Execução: Service        | Regra de avanço de step simples                          |
|  18D | ✅      | Execução: API/UI         | Exposição de actions para transição da UI                |
|  19A | ✅      | Eventos: Contratos       | Tipos mínimos de eventos (`started`, `completed`)        |
|  19B | ✅      | Eventos: Repository      | Escrita de eventos base                                  |
|  19C | ✅      | Eventos: Integração      | Injetar disparo no Runtime service                       |
|  19D | ✅      | Eventos: Trace Receipt   | Estrutura de rastreio/comprovante simples                |
|  20A | ⚪      | Hardening: Smoke Tests   | Validação do fluxo (Criar -> Instanciar -> Concluir)     |
|  20B | ⚪      | Hardening: Any Cleanup   | Remoção de `any` críticos na tipagem                     |
|  20C | ⚪      | Hardening: Checklist MVP | Relatório consolidado do fim da primeira jornada técnica |
|  20D | ⚪      | Hardening: Demo E2E      | Documentação visual e prova de operação fluida           |
|   21 | ⚪      | Runtime lifecycle        | Fase 21 Alfa Planejada                                   |
|   22 | ⚪      | Runtime timeline         | Fase 22 Alfa Planejada                                   |
|   23 | ⚪      | Runtime detail UI        | Fase 23 Alfa Planejada                                   |
|   24 | ⚪      | Auditoria mínima         | Fase 24 Alfa Planejada                                   |
|   25 | ⚪      | Trace receipt v2         | Fase 25 Alfa Planejada                                   |
|   26 | ⚪      | Outbox contract          | Fase 26 Alfa Planejada                                   |
|   27 | ⚪      | Outbox dispatcher        | Fase 27 Alfa Planejada                                   |
|   28 | ⚪      | Action registry types    | Fase 28 Alfa Planejada                                   |
|   29 | ⚪      | Action registry CRUD     | Fase 29 Alfa Planejada                                   |
|   30 | ⚪      | Built-in human task      | Fase 30 Alfa Planejada                                   |
|   31 | ⚪      | Built-in form action     | Fase 31 Alfa Planejada                                   |
|   32 | ⚪      | Built-in webhook         | Fase 32 Alfa Planejada                                   |
|   33 | ⚪      | Capability contract      | Fase 33 Alfa Planejada                                   |
|   34 | ⚪      | Capability registry      | Fase 34 Alfa Planejada                                   |
|   35 | ⚪      | Blueprint contract       | Fase 35 Alfa Planejada                                   |
|   36 | ⚪      | Blueprint import/export  | Fase 36 Alfa Planejada                                   |
|   37 | ⚪      | Blueprint apply flow     | Fase 37 Alfa Planejada                                   |
|   38 | ⚪      | Blueprint Gestão Técnica | Fase 38 Alfa Planejada                                   |
|   39 | ⚪      | Helpdesk módulo alfa     | Fase 39 Alfa Planejada                                   |
|   40 | ⚪      | Workforce/OS módulo alfa | Fase 40 Alfa Planejada                                   |

Fases 17A–20D formam a fila do MVP técnico.
Fases 21–40 formam a fila Alfa (planejadas, não iniciadas).

## 4. Última fase validada

```text
Última fase técnica validada: Fase 19D
Fase atual de documentação/contexto: Concluída
Próxima fase técnica planejada: Fase 20A
```

## 5. Regra

> Nenhuma fase deve ser considerada concluída apenas porque foi implementada. Ela deve ser revisada contra o escopo e registrada neste documento. O planejamento das fases de 17A a 20D é uma fila de execução futura, e a Fase 20D marca o fechamento documental do MVP técnico.
