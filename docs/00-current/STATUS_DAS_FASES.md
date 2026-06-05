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
|  17A | ⚪      | Runtime schema/contratos | Preparação do schema para instâncias operacionais        |
|  17B | ⚪      | Runtime repository       | Leitura e escrita isolada de runtime de instâncias       |
|  17C | ⚪      | Runtime service          | Business logic do runner e instanciador                  |
|  17D | ⚪      | Runtime server action    | Exposição server-side de comandos de instâncias          |
|  17E | ⚪      | UI Mínima para instância | Visual para instanciar as execuções de um processo       |
|  18A | ⚪      | Execução: Contratos      | Modelagem TS para processar as transições de etapas      |

## 4. Última fase validada

```text
Última fase técnica validada: Fase 16 (Pendente possível revisão de 16B)
Fase atual de documentação/contexto: Concluída (Fase 16C)
Próxima fase técnica planejada: Fase 17A
```

## 5. Regra

> Nenhuma fase deve ser considerada concluída apenas porque foi implementada. Ela deve ser revisada contra o escopo e registrada neste documento.
