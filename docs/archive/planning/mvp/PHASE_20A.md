# Fase 20A — Testes smoke do fluxo principal

## Objetivo
- validar e confirmar a funcionalidade do fluxo completo (criar processo, salvar, publicar, iniciar, avançar etapa, concluir).
- gerar um teste manual documentado ou automatizado super simples.

## Contexto
O MVP está construído. A primeira parte do hardening é ter um "caminho feliz" estritamente comprovado para não ter quebras silenciosas.

## Arquivos permitidos
- Scripts de teste local no root (`/e2e` se existente) ou documentação de log (`docs/`).

## Arquivos proibidos
- Códigos da aplicação (Features, UI, DB). Não se faz refatoração nesta fase de teste base.

## Regras
- Teste apenas o fluxo vital que comprova o " Understand -> Model -> Stabilize -> Execute ".

## Etapas
1. Modele um Processo Draft com Start e End Nodes.
2. Salve e Publique.
3. Chame a Action Instanciar.
4. Chame a Action Avançar até completar.
5. Verifique o Trace log.

## Validações
- Confirmação do fluxo de estado nos logs/Banco.

## Relatório final esperado
O resultado do script de verificação ou script manual anexado ao commit.

## Regra de parada
Smoke tests documentados e aprovados.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/mvp-hardening.md

Fase 20A — Testes smoke do fluxo principal

Objetivo:
Comprovar através de um percurso controlado (Smoke Test) que todas as Fases da 1 até a 19 operam sem quebras no caminho feliz end-to-end.

Escopo:
- Arquivos: Novo arquivo de teste local/E2E e/ou documentação do log da execução.

Não alterar:
Aplicação central. Você é apenas um QA neste momento.

Regras:
Crie o fluxo na UI/API local:
- Draft
- Publish
- Instantiate
- Step complete
- Track.

Etapas:
1. Monte o script ou execute-o listando as passagens com sucesso.

Validações:
Isolamento em tenant, e base zerada antes/depois se cabível no teste.

Relatório final:
Os logs consolidados do percurso de Smoke.

Regra de parada:
Script validado/documentado na raiz ou test folder.
```