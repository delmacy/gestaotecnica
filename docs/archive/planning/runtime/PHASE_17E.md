# Fase 17E — UI mínima para iniciar instância

## Objetivo
- adicionar botão ou painel mínimo para iniciar instância de processo publicado;
- não criar tela operacional completa;
- não criar execução de etapas;
- não criar events.

## Contexto
Demonstrar na prática que o Bloco 17 inteiro funciona desde a API até o Banco. Usaremos um shell ou botão para injetar o comando start e possivelmente ver o retorno (ok/error) via toast/log, sem a complexidade de desenhar árvores ou timelines ainda.

## Arquivos permitidos
- Alteração visual pontual em `src/app/(builder)/builder/page.tsx` ou em Painel auxiliar do Explorer (`src/components/builder/`).
- Componentes UI (React).

## Arquivos proibidos
- Camadas server (`actions.ts`, `service.ts`, `repository.ts`). O backend deve ser tratado como intocável nesta fase.

## Regras
- Design mínimo usando classes Tailwind existentes ou componentes neutros do React Flow Canvas panel se adequado.
- Utilização de `useTransition` para loading state na interface.

## Etapas
1. Selecione um processo "Published" no Painel existente do sistema (Inspector/Saved Processes).
2. Adicione botão "Instanciar" conectando à `startProcessInstanceAction`.
3. Mostre status de sucesso com a resposta.

## Validações
- Teste E2E de compilação Front/Back integrado rodando com `npm run build`.

## Relatório final esperado
Demonstração dos logs UI em screenshot (se mockado/previewed localmente).

## Regra de parada
Botão aciona API; Retorna Success na Tela. Não avance para o fluxo da Fase 18 (steps/avanços do diagrama).

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/builder.md

Fase 17E — UI mínima para iniciar instância

Objetivo:
Ligar a funcionalidade construída no Back-end com o shell visual do Builder/Platform para provar a comunicação End-to-End da ação de instanciar sem necessitar modelar o visual completo do executor da etapa.

Escopo:
- Arquivos a alterar:
  Componentes da UI onde liste ou mostre um "Process Version" (Inspector, Explorer ou Modal).

Não alterar:
Backend, Services, Actions.

Regras:
1. Se a Definition atual no Editor é um processo salvo com a Tag "Published", um botão ou hint deverá permitir acionar a Server Action (startProcessInstanceAction).
2. Não construa timelines ou telas modais gigantescas. Apenas a integração para instanciar (Proof of concept visual).

Etapas:
1. Engate o disparo num `onClick` / `formAction` acionando Action 17D.

Validações:
Loading de UX tratado para evitar duplo clique em network assíncrona.

Relatório final:
Onde o botão foi adicionado e captura da alteração visual (pode relatar qual component tree ele está).

Regra de parada:
Finalize no fechar do Pull Request apenas com as edições do client.
```