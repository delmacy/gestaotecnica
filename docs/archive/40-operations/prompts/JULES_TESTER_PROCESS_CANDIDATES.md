# Prompt - Jules Tester: Gate profundo da Fase 23

```text
Antes de iniciar, sincronize sua branch com a main e leia:

- AGENTS.md
- docs/foundation/MANIFESTO.md
- docs/foundation/AI_CONSTITUTION.md
- docs/foundation/ONTOLOGY.md
- docs/architecture/PLATFORM_VS_CLIENT.md
- docs/database/SCHEMA_STRATEGY.md
- docs/40-operations/JULES_TESTER_PLAYBOOK.md
- docs/40-operations/PROCESS_CANDIDATES_TEST_PLAN.md
- docs/phases/PHASE_22.md
- docs/phases/PHASE_23.md
- docs/planning/alpha/PHASE_23.md

Atue como Jules Tester e execute uma auditoria profunda da Fase 23. Seu papel
não é presumir que a implementação está correta: tente provar que os fluxos,
contratos e limites falham antes de aprová-los.

OBJETIVO

Validar Process Candidates ponta a ponta e emitir um relatório formal que
conclua exatamente uma das decisões:

- CORRETIVA NECESSÁRIA: existem falhas que impedem avançar.
- APROVADO PARA A PRÓXIMA FASE: todos os gates obrigatórios passaram e os
  riscos residuais são aceitáveis e documentados.

Não avance para outra fase, não faça merge e não declare aprovação parcial.

ESCOPO OBRIGATÓRIO

1. Arquitetura e contratos
   - Confirme a separação Platform/Runtime definida no AGENTS.md.
   - Confirme schema PostgreSQL explícito e isolamento por workspace_id.
   - Compare schema Drizzle, migration, tipos, repository, service, action e UI.
   - Verifique campos canônicos, status, origens, nulabilidade e timestamps.
   - Procure mocks, IDs fixos, any, TODO/FIXME, fallbacks silenciosos e dados
     iniciais que possam mascarar ausência de integração real.

2. Domínio e persistência
   - Teste payload válido, inválido, incompleto e com valores-limite.
   - Teste isolamento entre pelo menos dois workspaces.
   - Teste ausência, duplicidade e volume de dados.
   - Verifique tratamento de erros sem exposição de SQL ou dados sensíveis.
   - Analise a migration sem executar db:push.

3. Comportamento da interface
   - Teste carregamento, sucesso, vazio, erro e recuperação.
   - Teste busca por nome, descrição, acentos, caixa, espaços e ausência de
     resultados.
   - Teste todos os status, busca + filtro e limpeza da seleção.
   - Teste seleção, detalhes, evidências e definição proposta.
   - Teste teclado, foco, semântica acessível e viewport desktop/mobile.
   - Verifique se erros de backend são compreensíveis e recuperáveis.

4. Integração ponta a ponta
   - Confirme o fluxo real UI -> action -> service -> repository -> banco.
   - Não considere mocks como prova de integração real.
   - Teste regressões nos fluxos Builder e Runtime relacionados.
   - Verifique console do navegador, respostas de rede e erros de hidratação.

5. Qualidade e regressão
   - Revise os testes existentes e identifique falsos positivos.
   - Crie ou ajuste testes unitários, de integração e Playwright necessários.
   - Execute a suíte completa, não apenas os testes da Fase 23.
   - Execute build de produção para reproduzir o gate do Vercel.

REGRAS DE EXECUÇÃO

- Use dados controlados e independentes entre testes.
- Prefira seletores acessíveis.
- Registre passos exatos e evidências para toda falha.
- Não remova ou enfraqueça testes para obter resultado verde.
- Não altere regras de negócio, schema, migration ou arquitetura para fazer um
  teste passar.
- Correções pequenas e inequívocas em testes podem ser feitas e documentadas.
- Para defeitos de produção, registre a corretiva proposta e preserve a
  evidência. Não faça correção ampla sem revisão.
- Não execute db:push nem aplique migrations em banco compartilhado.

COMANDOS MÍNIMOS

Execute e registre o resultado de:

- npm test
- npm run lint
- npm run build
- npx playwright test
- git diff --check

Execute também testes específicos descobertos no package.json ou na estrutura
do repositório. Se algum comando não puder ser executado, explique o bloqueio e
considere o gate reprovado quando a ausência impedir comprovação.

CLASSIFICAÇÃO DAS DESCOBERTAS

- Bloqueadora: perda/vazamento de dados, quebra do fluxo principal, build
  falhando, isolamento por workspace violado ou migration insegura.
- Alta: comportamento essencial incorreto, contrato divergente, erro sem
  recuperação ou teste crítico ausente.
- Média: fluxo secundário incorreto, acessibilidade relevante ou cobertura
  insuficiente com risco conhecido.
- Baixa: melhoria não impeditiva, dívida técnica localizada ou inconsistência
  cosmética.

DECISÃO DO GATE

Marque CORRETIVA NECESSÁRIA quando houver:

- qualquer descoberta Bloqueadora ou Alta aberta;
- build, teste obrigatório ou fluxo principal falhando;
- isolamento por workspace não comprovado;
- contrato ou migration sem validação suficiente;
- evidência insuficiente para afirmar que a integração é real.

Marque APROVADO PARA A PRÓXIMA FASE somente quando:

- não houver descobertas Bloqueadoras ou Altas abertas;
- todos os comandos obrigatórios passarem;
- os critérios de aceite da Fase 23 forem comprovados;
- riscos Médios/Baixos estiverem registrados com recomendação;
- o relatório possuir evidências reproduzíveis.

RELATÓRIO OBRIGATÓRIO

Crie:

docs/40-operations/reports/PHASE_23_TEST_GATE_REPORT.md

Use exatamente esta estrutura:

# Relatório de Gate - Fase 23

## Decisão
CORRETIVA NECESSÁRIA | APROVADO PARA A PRÓXIMA FASE

Justificativa curta e objetiva.

## Escopo analisado
Arquivos, contratos, fluxos e ambientes avaliados.

## Evidências executadas
| ID | Camada | Cenário | Resultado | Evidência |

## Descobertas
| ID | Severidade | Problema | Reprodução | Esperado | Impacto |

Para cada descoberta, inclua arquivos/linhas envolvidos e uma proposta de
correção sem esconder riscos.

## Matriz de critérios de aceite
| Critério | Status | Evidência |

Use PASSOU, FALHOU ou NÃO COMPROVADO.

## Comandos e resultados
| Comando | Resultado | Observações |

## Correções realizadas nos testes
Liste somente ajustes feitos em testes e explique por que não alteram a regra
de negócio.

## Corretivas recomendadas
Ordene por severidade e dependência. Para cada item, descreva escopo mínimo,
arquivos prováveis e teste de aceite.

## Riscos residuais
Liste os riscos aceitos, impacto e recomendação.

## Próximo passo
Declare apenas uma ação:
- Abrir corretiva antes da próxima fase; ou
- Autorizar início da próxima fase.

Ao finalizar:

1. Salve o relatório obrigatório.
2. Acrescente uma entrada de teste no histórico de docs/phases/PHASE_23.md sem
   apagar registros existentes.
3. Apresente no resumo final a decisão, descobertas por severidade, comandos
   executados e o caminho do relatório.
4. Pare para revisão humana.
```
