# Context Pack: Builder

## 1. Objetivo do Domínio
O Builder é a camada visual (Shell, Canvas, Inspector, Timeline) voltada para o arquiteto/Platform Manager. Ele é responsável por modelar o estado operacional via uma experiência UX fluida (inspirada em n8n e Vercel), sem possuir responsabilidade sobre regras rígidas de backend ou execução em runtime.

## 2. Arquivos Principais
- `src/app/(builder)/builder/page.tsx`
- `src/components/builder/`
- `src/features/builder/canvas/builder-flow-adapter.ts`
- `src/features/builder/types/`
- `src/features/builder/draft-actions/`

## 3. Decisões Ativas
- React Flow (`@xyflow/react`) é usado exclusivamente como adaptador visual.
- Os modelos de negócio e domínio canônico são mantidos em TypeScipt puro independentes do canvas localmente via hook `useBuilderEditorState`.
- O Builder implementa real-time sync local do Inspector para a Tree Explorer sem chamar back-end.

## 4. Anti-Escopo
- Não implementar lógica real de execução do processo visualizado no Builder. O Preview é puramente de simulação e navegação entre edges.
- O builder não acessa bancos ou Next.js server components de maneira ad-hoc sem transacionar pelas Actions do Servidor.

## 5. Próximas Fases Relacionadas
- Integração do Inspector com componentes do novo Runtime.
- Mapeamento avançado com instâncias publicadas reais.