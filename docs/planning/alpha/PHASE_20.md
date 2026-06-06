# Fase 20 — Builder Control Plane Shell

## Objetivo
Evoluir a interface raiz do Builder para atuar como um Control Plane.

## Contexto
O System Builder não é apenas um canvas visual; ele deve gerenciar Process Candidates, Workflows, Formulários e Integrações em um layout administrativo robusto.

## Arquivos permitidos
- `src/app/(builder)/layout.tsx`
- `src/components/builder/shell/**`

## Arquivos proibidos
- `src/app/(runtime)/**`
- Alterações no canvas React Flow (`@xyflow`).

## Regras
- O Shell deve conter Sidebar fixa, Topbar com Breadcrumbs e área central.
- Implementar UI limpa usando Tailwind sem dependências desnecessárias.

## Etapas
1. Refatorar o `layout.tsx` do builder para incluir uma Sidebar expansível.
2. Criar menu de navegação lateral (Process Candidates, Workflows, Integrations).
3. Adicionar área superior com Breadcrumb contextual.

## Validações
- Verificar responsividade básica (mobile/desktop).
- Garantir que a navegação não quebra o estado local dos drafts.

## Relatório final esperado
- Arquivos do shell criados e configurados corretamente.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 20 — Builder Control Plane Shell

Objetivo:
Evoluir a interface raiz do Builder para atuar como um Control Plane.

Escopo:
Permitido criar componentes de navegação em `src/components/builder/shell/`.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Desenvolva o layout administrativo padrão.
2. Insira os links vazios/placeholders para as futuras telas.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Builder Control Plane Shell. Pare e solicite review.
```
