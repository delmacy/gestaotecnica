# UX Navigation Extension Tasks

Este plano adiciona duas sprints seriais de 50 tasks para elevar a experiencia completa do System Builder alem de menus e telas isoladas. Ele deve ser materializado depois de `UX-NAV-05`, antes da expansao comercial ampla ou da trilha `FED-*`, salvo decisao explicita de gate.

## Regra de execucao

- Uma task por vez.
- Uma branch e PR por task.
- Toda task deve declarar rotas impactadas, origem da navegacao, acao principal, destino, retorno, estado vazio, loading, erro, permissao e evidencia visual quando houver UI.
- Nenhuma task pode criar mock novo como evidencia de produto real; dados sinteticos devem ficar rotulados.
- Nao introduzir `any` explicito em codigo ou testes.
- Para telas federadas ou de portabilidade, implementar primeiro contrato e leitura visual; operacao remota real exige gate de seguranca.

## UX-NAV-06 - Navigation Intelligence and Builder Decision UX

Objetivo: transformar a navegacao do Builder em uma experiencia explicita, previsivel e auditavel, com capabilities descobriveis, simulacao antes de publicacao, blueprint diff e Policy Studio inicial.

| ID | Titulo | Tipo | Dependencias | Escopo | Aceite |
|---|---|---|---|---|---|
| UX-NAV-06-001 | Definir contrato visual de navegacao | contrato | UX-NAV-05 | docs/ui/**, docs/product-roadmap/** | Cada superficie declara origem, acao, destino, retorno, permissao e estados. |
| UX-NAV-06-002 | Inventariar rotas Builder sem contrato de fluxo | auditoria | UX-NAV-06-001 | docs/ui/**, src/app/(builder)/** | Lista lacunas por rota sem alterar UI. |
| UX-NAV-06-003 | Mapear breadcrumb canonico por superficie | contrato | UX-NAV-06-002 | docs/ui/** | Breadcrumb cobre entrada, detalhe, edicao e retorno. |
| UX-NAV-06-004 | Mapear acoes primarias por superficie | contrato | UX-NAV-06-002 | docs/ui/** | Cada tela possui uma acao primaria e acoes secundarias justificadas. |
| UX-NAV-06-005 | Mapear estados vazios por dominio | contrato | UX-NAV-06-002 | docs/ui/** | Estado vazio diferencia sem dados, sem permissao e setup incompleto. |
| UX-NAV-06-006 | Mapear erros recuperaveis por rota | contrato | UX-NAV-06-002 | docs/ui/** | Erros mostram proxima acao sem stack tecnico. |
| UX-NAV-06-007 | Mapear loading e skeleton por familia de tela | contrato | UX-NAV-06-002 | docs/ui/** | Loading nao desloca layout nem oculta contexto. |
| UX-NAV-06-008 | Criar matriz de retorno seguro | contrato | UX-NAV-06-003 | docs/ui/** | Voltar/cancelar/sair preserva contexto ou explica perda. |
| UX-NAV-06-009 | Criar mapa de permissoes visuais | contrato | UX-NAV-06-004 | docs/ui/**, docs/operations/** | UI mostra escopo do usuario sem vazar recursos. |
| UX-NAV-06-010 | Revisar shell contra contrato visual | review | UX-NAV-06-001..009 | docs/ui/** | Shell aprovado ou lacunas registradas. |
| UX-NAV-06-011 | Definir Capability Marketplace UX | contrato | UX-NAV-06-010 | docs/ui/**, docs/modules/** | Catalogo diferencia instalado, disponivel, bloqueado e incompatível. |
| UX-NAV-06-012 | Projetar discovery de capabilities | UX | UX-NAV-06-011 | docs/ui/** | Busca, filtros, categorias e dependencias planejadas. |
| UX-NAV-06-013 | Projetar pagina de detalhe de capability | UX | UX-NAV-06-011 | docs/ui/** | Detalhe mostra contrato, versao, riscos, permissao e instalacoes. |
| UX-NAV-06-014 | Projetar fluxo de instalacao de capability | UX | UX-NAV-06-013 | docs/ui/** | Fluxo tem preflight, confirmacao, progresso e resultado. |
| UX-NAV-06-015 | Projetar fluxo de desativacao com impacto | UX | UX-NAV-06-014 | docs/ui/** | Impacto em menus, workflows e dados aparece antes da acao. |
| UX-NAV-06-016 | Projetar update de capability | UX | UX-NAV-06-014 | docs/ui/** | Update mostra diff, rollback e checks. |
| UX-NAV-06-017 | Definir badges de compatibilidade | contrato | UX-NAV-06-011 | docs/ui/** | Compatibilidade e blockers usam linguagem consistente. |
| UX-NAV-06-018 | Definir taxonomy de capability cards | contrato | UX-NAV-06-011 | docs/ui/** | Cards nao viram marketing; mostram estado operacional. |
| UX-NAV-06-019 | Criar parity matrix do Marketplace | review | UX-NAV-06-011..018 | docs/ui/reviews/** | Matrix cobre telas e estados esperados. |
| UX-NAV-06-020 | Readiness review do Marketplace | review | UX-NAV-06-019 | docs/ui/reviews/** | Decide ready, blocked ou corrective tasks. |
| UX-NAV-06-021 | Definir Simulation Before Publish UX | contrato | UX-NAV-06-010 | docs/ui/**, docs/workflows/** | Simulacao lista impacto antes de publicar workflow/capability. |
| UX-NAV-06-022 | Projetar painel de impacto em dados | UX | UX-NAV-06-021 | docs/ui/** | Dados criados/alterados/bloqueados aparecem por entidade. |
| UX-NAV-06-023 | Projetar painel de impacto em permissoes | UX | UX-NAV-06-021 | docs/ui/** | Mudancas de role/policy aparecem antes da publicacao. |
| UX-NAV-06-024 | Projetar painel de eventos emitidos | UX | UX-NAV-06-021 | docs/ui/** | Eventos previstos incluem actor, workspace e correlation. |
| UX-NAV-06-025 | Projetar painel de rollback | UX | UX-NAV-06-021 | docs/ui/** | Usuario entende reversibilidade antes de confirmar. |
| UX-NAV-06-026 | Definir diferenca real/sintetico na simulacao | contrato | UX-NAV-06-021 | docs/ui/** | Dados sinteticos nunca aparecem como prova real. |
| UX-NAV-06-027 | Criar matriz de estados da simulacao | contrato | UX-NAV-06-021..026 | docs/ui/** | Idle, running, passed, warning, blocked e failed cobertos. |
| UX-NAV-06-028 | Projetar historico de simulacoes | UX | UX-NAV-06-027 | docs/ui/** | Historico e auditavel sem expor payload sensivel. |
| UX-NAV-06-029 | Criar parity matrix de simulacao | review | UX-NAV-06-021..028 | docs/ui/reviews/** | Matrix cobre impacto, rollback e evidencia. |
| UX-NAV-06-030 | Readiness review de Simulation UX | review | UX-NAV-06-029 | docs/ui/reviews/** | Decide escopo pronto para dev. |
| UX-NAV-06-031 | Definir Blueprint Diff UX | contrato | UX-NAV-06-020 | docs/ui/**, docs/modules/blueprints/** | Diff compara versoes e instalacoes por secao. |
| UX-NAV-06-032 | Projetar diff de capabilities | UX | UX-NAV-06-031 | docs/ui/** | Add/change/remove e blockers visiveis. |
| UX-NAV-06-033 | Projetar diff de forms e views | UX | UX-NAV-06-031 | docs/ui/** | Campos, layout e bindings ficam comparaveis. |
| UX-NAV-06-034 | Projetar diff de workflows e policies | UX | UX-NAV-06-031 | docs/ui/** | Mudancas de processo e regras aparecem com impacto. |
| UX-NAV-06-035 | Projetar diff de seed metadata | UX | UX-NAV-06-031 | docs/ui/** | Seed e identificado como configuracao, nao dado real. |
| UX-NAV-06-036 | Projetar resolucao de conflitos de blueprint | UX | UX-NAV-06-031 | docs/ui/** | Conflitos pedem decisao explicita e auditavel. |
| UX-NAV-06-037 | Projetar review de checksum/provenance | UX | UX-NAV-06-031 | docs/ui/** | Origem, assinatura e integridade ficam visiveis. |
| UX-NAV-06-038 | Criar parity matrix de Blueprint Diff | review | UX-NAV-06-031..037 | docs/ui/reviews/** | Matrix cobre todos os blocos do pacote. |
| UX-NAV-06-039 | Readiness review de Blueprint Diff | review | UX-NAV-06-038 | docs/ui/reviews/** | Decide ready ou corrective tasks. |
| UX-NAV-06-040 | Definir Policy Studio UX | contrato | UX-NAV-06-010 | docs/ui/**, docs/governance/** | Studio cobre policies, limites, aprovacao e visibilidade. |
| UX-NAV-06-041 | Projetar lista de policies | UX | UX-NAV-06-040 | docs/ui/** | Lista mostra escopo, status, versao e risco. |
| UX-NAV-06-042 | Projetar editor de policy seguro | UX | UX-NAV-06-040 | docs/ui/** | Edicao tem preflight e nunca salva regra invalida. |
| UX-NAV-06-043 | Projetar simulacao de policy | UX | UX-NAV-06-040 | docs/ui/** | Usuario ve quem ganha/perde acesso antes de publicar. |
| UX-NAV-06-044 | Projetar trilha de aprovacao de policy | UX | UX-NAV-06-040 | docs/ui/** | Mudancas sensiveis exigem aprovacao e receipt. |
| UX-NAV-06-045 | Projetar rollback de policy | UX | UX-NAV-06-040 | docs/ui/** | Reversao e explicita e auditavel. |
| UX-NAV-06-046 | Criar matriz Policy Studio | review | UX-NAV-06-040..045 | docs/ui/reviews/** | Matrix cobre lista, editor, simulacao e rollback. |
| UX-NAV-06-047 | Revisar consistencia visual das novas superficies | review | UX-NAV-06-020,030,039,046 | docs/ui/reviews/** | Componentes seguem densidade, estados e linguagem do Builder. |
| UX-NAV-06-048 | Atualizar mapa de navegacao completo | contrato | UX-NAV-06-047 | docs/ui/** | Marketplace, Simulation, Blueprint Diff e Policy Studio entram no mapa. |
| UX-NAV-06-049 | Criar checklist e2e de decisao Builder | teste | UX-NAV-06-048 | docs/ui/reviews/** | Caminho de decisao antes de publicar fica verificavel. |
| UX-NAV-06-050 | Closeout UX-NAV-06 | review | UX-NAV-06-049 | docs/product-roadmap/** | Entrega conclusao, riscos e proxima sprint liberavel. |

## UX-NAV-07 - Federation, Support and Portability UX

Objetivo: preparar a experiencia visual e operacional para instancias federadas, suporte remoto auditavel, lineage, handoff e saida sem lock-in.

| ID | Titulo | Tipo | Dependencias | Escopo | Aceite |
|---|---|---|---|---|---|
| UX-NAV-07-001 | Definir UX de Instance Registry | contrato | UX-NAV-06, FED-01 | docs/ui/**, docs/product-roadmap/** | Instancias aparecem com owner, relacao, health e trust. |
| UX-NAV-07-002 | Projetar lista de instancias | UX | UX-NAV-07-001 | docs/ui/** | Lista distingue principal, filha, delegada, peer e emancipada. |
| UX-NAV-07-003 | Projetar detalhe de instancia | UX | UX-NAV-07-001 | docs/ui/** | Detalhe mostra versao, contrato, endpoints e status. |
| UX-NAV-07-004 | Projetar fluxo de registrar instancia | UX | UX-NAV-07-001 | docs/ui/** | Registro exige preflight e chaves publicas. |
| UX-NAV-07-005 | Projetar revogacao de instancia | UX | UX-NAV-07-001 | docs/ui/** | Revogacao bloqueia novas trocas e preserva auditoria. |
| UX-NAV-07-006 | Projetar health federado | UX | UX-NAV-07-001 | docs/ui/** | Health diferencia local, contrato e principal. |
| UX-NAV-07-007 | Criar parity matrix do Instance Registry | review | UX-NAV-07-001..006 | docs/ui/reviews/** | Matrix cobre estados e permissao. |
| UX-NAV-07-008 | Readiness review do Instance Registry | review | UX-NAV-07-007 | docs/ui/reviews/** | Decide ready ou blocker. |
| UX-NAV-07-009 | Definir Federation Contract UX | contrato | UX-NAV-07-008, FED-02 | docs/ui/** | Contrato mostra scopes, validade, issuer e revogacao. |
| UX-NAV-07-010 | Projetar criacao de contrato federado | UX | UX-NAV-07-009 | docs/ui/** | Criacao exige escopo minimo e revisao. |
| UX-NAV-07-011 | Projetar revisao de contrato federado | UX | UX-NAV-07-009 | docs/ui/** | Usuario entende o que sera autorizado. |
| UX-NAV-07-012 | Projetar renovacao de contrato federado | UX | UX-NAV-07-009 | docs/ui/** | Renovacao nao amplia escopo implicitamente. |
| UX-NAV-07-013 | Projetar encerramento de contrato federado | UX | UX-NAV-07-009 | docs/ui/** | Encerramento tem motivo, data e receipt. |
| UX-NAV-07-014 | Projetar timeline de contrato federado | UX | UX-NAV-07-009 | docs/ui/** | Timeline mostra acoes e eventos por contrato. |
| UX-NAV-07-015 | Criar matrix de Federation Contract UX | review | UX-NAV-07-009..014 | docs/ui/reviews/** | Matrix cobre ciclo de vida completo. |
| UX-NAV-07-016 | Readiness review de contrato federado | review | UX-NAV-07-015 | docs/ui/reviews/** | Decide pronto para dev ou corrective. |
| UX-NAV-07-017 | Definir Remote Support UX | contrato | UX-NAV-07-016, FED-04 | docs/ui/**, docs/operations/** | Suporte remoto e temporario, escopado e auditavel. |
| UX-NAV-07-018 | Projetar pedido de suporte remoto | UX | UX-NAV-07-017 | docs/ui/** | Pedido mostra motivo, duracao, escopo e operador. |
| UX-NAV-07-019 | Projetar aprovacao de suporte remoto | UX | UX-NAV-07-017 | docs/ui/** | Cliente aprova explicitamente e pode negar. |
| UX-NAV-07-020 | Projetar sessao ativa de suporte | UX | UX-NAV-07-017 | docs/ui/** | Sessao exibe tempo, escopo e acoes permitidas. |
| UX-NAV-07-021 | Projetar encerramento de suporte | UX | UX-NAV-07-017 | docs/ui/** | Encerramento gera resumo auditavel. |
| UX-NAV-07-022 | Projetar receipts de suporte remoto | UX | UX-NAV-07-017 | docs/ui/** | Receipts mostram actor, instancia, workspace e acao. |
| UX-NAV-07-023 | Criar matrix de Remote Support UX | review | UX-NAV-07-018..022 | docs/ui/reviews/** | Matrix cobre ciclo de sessao. |
| UX-NAV-07-024 | Readiness review de suporte remoto | review | UX-NAV-07-023 | docs/ui/reviews/** | Decide blockers de seguranca. |
| UX-NAV-07-025 | Definir Data Lineage UX | contrato | UX-NAV-06, FED-06 | docs/ui/**, docs/runtime/** | Lineage mostra origem do dado sem expor segredo. |
| UX-NAV-07-026 | Projetar lineage por registro | UX | UX-NAV-07-025 | docs/ui/** | Registro mostra formulario, API, import, workflow ou seed. |
| UX-NAV-07-027 | Projetar lineage por workflow | UX | UX-NAV-07-025 | docs/ui/** | Workflow mostra definicao, versao e eventos. |
| UX-NAV-07-028 | Projetar lineage por integracao | UX | UX-NAV-07-025 | docs/ui/** | Integracao mostra origem, transformacao e receipt. |
| UX-NAV-07-029 | Projetar filtros de lineage | UX | UX-NAV-07-025 | docs/ui/** | Filtros por actor, workspace, fonte, periodo e entidade. |
| UX-NAV-07-030 | Projetar redaction visual de lineage | UX | UX-NAV-07-025 | docs/ui/** | Dados sensiveis ficam ocultos por padrao. |
| UX-NAV-07-031 | Criar matrix de Data Lineage UX | review | UX-NAV-07-026..030 | docs/ui/reviews/** | Matrix cobre origens e redaction. |
| UX-NAV-07-032 | Readiness review de lineage | review | UX-NAV-07-031 | docs/ui/reviews/** | Decide prontidao. |
| UX-NAV-07-033 | Definir Instance Handoff Pack UX | contrato | UX-NAV-07-016, FED-05 | docs/ui/**, docs/product-roadmap/** | Pack lista arquitetura, blueprints, roles, policies e health. |
| UX-NAV-07-034 | Projetar geracao de handoff pack | UX | UX-NAV-07-033 | docs/ui/** | Geracao tem preflight, redaction e checksum. |
| UX-NAV-07-035 | Projetar review de handoff pack | UX | UX-NAV-07-033 | docs/ui/** | Review separa incluido, excluido e bloqueado. |
| UX-NAV-07-036 | Projetar download/export auditavel | UX | UX-NAV-07-033 | docs/ui/** | Export gera receipt e nao contem secrets. |
| UX-NAV-07-037 | Projetar import dry-run de handoff pack | UX | UX-NAV-07-033 | docs/ui/** | Import mostra incompatibilidades antes de aplicar. |
| UX-NAV-07-038 | Criar matrix de Handoff Pack UX | review | UX-NAV-07-034..037 | docs/ui/reviews/** | Matrix cobre export/import. |
| UX-NAV-07-039 | Readiness review de Handoff Pack | review | UX-NAV-07-038 | docs/ui/reviews/** | Decide pronto ou corrective. |
| UX-NAV-07-040 | Definir Exit Readiness UX | contrato | UX-NAV-07-039, FED-05 | docs/ui/** | Painel mede portabilidade e lacunas de saida. |
| UX-NAV-07-041 | Projetar checklist de saida sem lock-in | UX | UX-NAV-07-040 | docs/ui/** | Checklist cobre dados, docs, blueprints, roles e integracoes. |
| UX-NAV-07-042 | Projetar score de portabilidade | UX | UX-NAV-07-040 | docs/ui/** | Score mostra motivos e acoes pendentes. |
| UX-NAV-07-043 | Projetar lacunas de export | UX | UX-NAV-07-040 | docs/ui/** | Lacunas sao acionaveis e priorizadas. |
| UX-NAV-07-044 | Projetar relatorio de emancipacao | UX | UX-NAV-07-040 | docs/ui/** | Relatorio e legivel para cliente e operador. |
| UX-NAV-07-045 | Criar matrix de Exit Readiness | review | UX-NAV-07-041..044 | docs/ui/reviews/** | Matrix cobre portabilidade real. |
| UX-NAV-07-046 | Readiness review de Exit UX | review | UX-NAV-07-045 | docs/ui/reviews/** | Decide blockers comerciais. |
| UX-NAV-07-047 | Integrar mapa visual federado ao Builder Shell | contrato | UX-NAV-07-008,016,024,032,039,046 | docs/ui/** | Menus novos entram com escopo global/federado claro. |
| UX-NAV-07-048 | Criar e2e narrative de instancia gerenciada | teste | UX-NAV-07-047 | docs/ui/reviews/** | Narrativa cobre registrar, contrato, suporte e handoff. |
| UX-NAV-07-049 | Criar e2e narrative de emancipacao | teste | UX-NAV-07-047 | docs/ui/reviews/** | Narrativa cobre readiness, export e import dry-run. |
| UX-NAV-07-050 | Closeout UX-NAV-07 | review | UX-NAV-07-048..049 | docs/product-roadmap/** | Entrega riscos, blockers e recomendacao para materializar FED-01. |

## Gates para abrir desenvolvimento

- `UX-NAV-06` pode entrar logo apos a sprint de navegacao atualmente aberta, desde que nao exista blocker de RD/real-data que impeça evidencia visual.
- `UX-NAV-07` depende de `UX-NAV-06` e do escopo `FEDERATED_INSTANCE_SCOPE.md`.
- `RD-03` e posteriores devem ser remodelados conforme `REAL_DATA_PATH_POST_UX_REMODEL.md`, mantendo IDs existentes, para consumir os contratos de navegacao, decisao, lineage e portabilidade antes de implementar bindings finais.
- Implementacao remota real, suporte federado ativo ou export/import de dados reais dependem de RBAC, audit receipts, redaction e dry-run aprovados.
