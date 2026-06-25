# Runbook de Higiene de Pull Requests e Branches

Este documento estabelece as diretrizes operacionais de "Git Hygiene" e o fluxo de decisão e limpeza aplicável a Pull Requests e branches para evitar acúmulo de artefatos obsoletos e bloqueios de integração (orquestração Codex + Jules).

## 1. Regra de Ouro da Decisão e Entrega

A orquestração deve separar a avaliação do código da execução do repositório. O destino de um Pull Request obedece a regras rígidas para impedir ciclos infinitos de correções.

### 1.1 Fluxo Base
1.  **PR Correto (100% de aderência ao gate):** Aprovado e *Mergeado* imediatamente.
2.  **PR Ajustável:** Recebe comentário detalhado exigindo correção do agente. A branch permanece ativa aguardando novo push.
3.  **PR Contaminado (Violação grave de arquitetura/diretriz):** Rejeitado. Fechar o PR e instruir reinício.
4.  **A Regra das 3 Tentativas:** Se um PR sofre 3 rodadas consecutivas de correções e continua apresentando falhas, regressões ou alucinações, **o PR deve ser fechado permanentemente**.
    *   *Ação pós-fechamento:* Uma nova issue/task deve ser aberta com contexto reformulado para a próxima iteração.
    *   *Propósito:* Impedir que um contexto de agente fique viciado e trave o board.

## 2. Política de Retenção de Branches

Branches de features, tarefas automáticas e testes devem ter ciclo de vida idêntico ao seu PR atrelado. Branches abandonadas são consideradas ruído operacional.

1.  **Após Merge:** A branch que deu origem ao PR deve ser deletada imediatamente após o merge na `main`.
2.  **Após Fechamento Definitivo:** Se um PR for fechado devido à Regra das 3 Tentativas, rejeição ou descarte de escopo, a branch que deu origem a ele **deve ser deletada**.
3.  **Manutenção Padrão:** O repositório só deve reter a branch `main` e branches com Pull Requests ativamente abertos ou designados para a rodada atual.

## 3. Aplicação Automática vs Manual

*   Agentes (como o *Jules Git Manager* ou *Codex Orchestrator*) que atuam gerindo repositório não devem hesitar em executar a deleção das branches fechadas e encerrar ciclos travados.
*   Os agentes nunca devem forçar push em branches que contenham artefatos manuais únicos não reconciliados (conforme políticas de sincronização e recovery).

---
*Runbook originado da Task de Higiene Fase 1 Consolidação.*
