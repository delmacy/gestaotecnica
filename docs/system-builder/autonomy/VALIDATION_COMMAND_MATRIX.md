# Matriz de Validação Operacional (Validation Command Matrix)

## Regra de Honestidade
**Se não executou, diga que não executou.** Não invente, não presuma e não declare sucesso para validações que você não rodou de fato. Resultados baseados em suposições quebram a confiança do System Builder e invalidam PRs.

## Comandos e Camadas de Validação

| Comando | Finalidade | Pré-requisitos | Evidência Esperada | Quando Usar |
| :--- | :--- | :--- | :--- | :--- |
| `npm run build` | Validar tipagem TS e compilação do Next.js. | Variáveis de ambiente padrão do Next.js (se exigidas em build time) | Saída limpa do terminal sem erros de compilação ou rotas com erro | Sempre que houver qualquer alteração de código fonte, antes do PR. |
| `npm run test:unit` | Executar testes unitários isolados do código. | Node.js instalado, sem necessidade de DB. | Relatório no terminal indicando testes passando, cobertura. | Alterações de regras de negócio puras ou funções isoladas. |
| `npm run test:integration` | Executar testes que integram com o banco de dados (Drizzle, etc). | Banco de dados de testes configurado e rodando. | Terminal apontando testes passando. | Alterações em queries, schemas de banco ou lógica com I/O real. |
| `npm run test:e2e` | Executar fluxos end-to-end simulando o usuário no navegador. | Banco rodando, `npx playwright install` executado, servidor web (`npm run dev`) rodando em background. | Relatório do Playwright passando, evidências de vídeo/screenshot se falhar. | Fluxos visuais, mudanças em páginas completas ou na navegação. |
| `npm run test:agent-work:unit` | Testes unitários do modulo agent-work. | Node.js instalado, sem DB. | Terminal apontando testes de agente passando. | Mudanças na CLI do agent-work ou lógicas independentes de API/DB. |
| `npm run test:agent-work:integration` | Testes de integração do modulo agent-work. | `AGENT_WORK_TEST_DATABASE_URL` configurada, DB de testes. | Terminal com testes passando. | Alterações no contrato de persistência do agent-work. |
| `npm run test:agent-work:launch` | Testar subida ponta-a-ponta de tasks do agent-work. | `AGENT_WORK_TEST_DATABASE_URL` configurada, chaves de API se aplicável. | Execução de task sem crash. | Alterações na orquestração de Agentes. |
| `npm run agent-work db:check` | Validar a integridade estrutural e conexão do DB do Agent Work. | Banco rodando, `DATABASE_URL` ou `AGENT_WORK_DATABASE_URL`. | Saída informando que o banco está alcançável e schema confere. | PRs de código do agente e antes de test:agent-work:integration localmente. |
| `npm run agent-work dry-run` | Simular a execução de um workflow sem causar efeitos colaterais. | Variáveis do workflow de Agent Work. | Logs da simulação apontando sucesso sem mutações. | PRs de código para validar mudanças em steps operacionais. |
| `npm run readiness verify` | Check geral de integridade da branch. | N/A (Este comando valida o todo). | Resumo de readiness com sucesso total. | PRs documentais e PRs de código na etapa final pré-merge. |

## Instruções para Testers e Reviewers

Sempre que a infraestrutura permitir, **Tester e Reviewer devem ler relatórios do GitHub Actions e Checks Automáticos** (quando disponíveis). A automação é a principal fonte de verdade sobre regressões e cobertura global. O log do Actions não mente e não tem viés.

## Diferenças de Ambientes e Permissões

- **Local:** O desenvolvedor tem controle total. Falhas locais geralmente são problemas de dependência (ex: falta de `npm install`), banco desligado ou variáveis `.env` faltando. Se bloquear, resolva na máquina ou registre o bloqueio de forma honesta.
- **GitHub Actions (CI):** Ambiente limpo, sem cache corrompido, e que executa estritamente o workflow definido. Se passa local e quebra na CI, as chances de dependências ausentes no commit ou envs erradas são altas.
- **Bloqueio por falta de Permissão:** Se em um Agent Work ou execução remota você receber `403 Forbidden` ou equivalente (ex: falta de PAT adequado para editar Projects, ou falta de banco para o Agent Work e2e), **não simule sucesso**. Relate o status real de `BLOCKED` ou `NOT_CONFIGURED` como sua evidência.

## Conclusão

Essas validações não são opcionais, mas são contextuais.
Não rache a cabeça para rodar algo que está flagrantemente fora de escopo para sua alteração, mas aquilo que **você decidir não rodar, informe claramente que não rodou** para que o próximo passo saiba que não foi validado.
