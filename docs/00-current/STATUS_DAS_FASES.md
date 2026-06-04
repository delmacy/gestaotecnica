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
|   16 | ⚪      | Publicar versão          | Ainda não iniciado                                       |
|   17 | ⚪      | Runtime mínimo           | Ainda não iniciado                                       |
|   18 | ⚪      | Execução de etapas       | Ainda não iniciado                                       |
|   19 | ⚪      | Eventos/rastreabilidade  | Ainda não iniciado                                       |
|   20 | ⚪      | Hardening MVP            | Ainda não iniciado                                       |

## 4. Última fase validada

```text
Última fase técnica validada: Fase 15
Fase atual de documentação/contexto: Concluída (Fase 12B)
Próxima fase técnica planejada: Fase 16
```

## 5. Regra

> Nenhuma fase deve ser considerada concluída apenas porque foi implementada. Ela deve ser revisada contra o escopo e registrada neste documento.
