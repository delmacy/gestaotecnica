# Operator Guide - MVP Plan

## 1. Objetivo
Criar uma superfície de orientação operacional da plataforma (Operator Guide) para ensinar usuários (Builder, Admin e Operator) a navegar e utilizar as superfícies já implementadas do System Builder.

## 2. Personas
- Platform Admin
- Builder Architect
- Process Analyst
- Capability Architect
- UX Architect
- Reviewer
- Client Viewer
- Operator

## 3. Escopo
- Interface `read-only` baseada em mock/static index.
- Guias orientados a procedimentos de uso das superfícies.
- Busca, filtros (por perfil, superfície, dificuldade).
- Detalhes do guia: pré-requisitos, passos numerados, resultado esperado, warnings, troubleshooting, rotas relacionadas.
- Checklist de progresso em estado apenas local (client-side).
- Cópia de comandos ou rotas como texto.

## 4. Fora de Escopo
- Edição real da documentação no sistema.
- Leitura dinâmica do filesystem ou de Markdown em runtime.
- Persistência do progresso do usuário em banco de dados.
- Quaisquer chamadas de API, server actions, webhooks ou integrações.
- Autenticação avançada, RBAC real ou telemetria.

## 5. Entidades Mínimas (Documentais/Sintéticas)
- `OperatorGuide`
- `OperatorGuideCategory`
- `OperatorGuideAudience`
- `OperatorGuideSurface`
- `OperatorProcedure`
- `OperatorProcedureStep`
- `OperatorPrerequisite`
- `OperatorExpectedOutcome`
- `OperatorWarning`
- `OperatorTroubleshootingItem`
- `OperatorRelatedRoute`
- `OperatorGuideChecklist`
- `OperatorGuideReadinessStatus`
- `OperatorGuideDataSourceMode`

## 6. Telas
Apenas a página principal `/builder/operator-guide` contendo:
- Lista/Árvore de guias.
- Painel de filtros e busca.
- Painel de detalhes do guia selecionado.

## 7. Navegação
- Integrado na Sidebar do `BuilderShell` (Módulo ativo do Grupo A/B).
- Links diretos seguros de "rotas relacionadas" sem alterar estado.

## 8. Estrutura dos Procedimentos
- Procedimentos divididos em passos sequenciais e marcáveis localmente, contendo descrições e ações (comandos de texto).

## 9. Dificuldade
- Classificação: `beginner`, `intermediate`, `advanced`, `reference`.

## 10. Pré-requisitos
- Exigidos antes da execução (ex: "Estar logado como Platform Admin").

## 11. Resultados Esperados
- O que deve acontecer após a conclusão do procedimento (ex: "Visualização do shell principal do builder").

## 12. Warnings
- Avisos essenciais e restrições.

## 13. Troubleshooting
- Seção de diagnóstico de problemas e soluções rápidas.

## 14. Superfícies Relacionadas
- Links/referências para `Tasker Board`, `Capability Explorer`, etc.

## 15. Acessibilidade
- Textos legíveis, hierarquia clara, uso do padrão Shadcn/Lucide. Aviso visível de "Read-Only / Static Guide".

## 16. Critérios de Aceite
- Rota acessível no shell.
- 12 guias mínimos (incluindo Superusuário, PM Intake, etc) presentes nos dados sintéticos.
- Navegação entre guias fluida.
- Checklists operam localmente.
- Nenhuma chamada ao backend ou persistência ativa.
- Nenhum segredo exposto.

## 17. Próximos Passos
- Avançar para a Dev Readiness Audit (`DEV-READINESS-OPERATOR-GUIDE-001`).
