# Frontend Parity Gate — System Builder

Este documento estabelece a política obrigatória de Frontend Parity Gate para o
desenvolvimento do System Builder.

## Objetivo

Garantir que cada avanço de backend, domínio, banco, workflow, capability,
formulário, regra, integração ou governança seja refletido em uma superfície
de uso correspondente.

O System Builder não deve evoluir como um backend invisível. A plataforma deve
ser operável por usuários autenticados, com separação clara entre:

- administração global da plataforma;
- seleção e configuração de organizações e workspaces/clientes;
- operação sensível dentro do workspace ativo;
- capabilities globais reutilizáveis;
- dados operacionais isolados por workspace.

## Princípio Fundamental

Nenhuma fase que altere backend, banco de dados, domínio, workflow, capability,
form, rule, aprovação, integração ou governança deve ser marcada como completa
sem:

1. UI correspondente;
2. ou fase frontend imediatamente vinculada no roadmap;
3. ou gap frontend explícito e justificado temporariamente.

## Direção de Produto

- A plataforma global administra tenants, workspaces, usuários, capabilities globais e governança.
- Gestão Técnica é operacional e feita por workspace/tenant.
- Processos, dashboards, demandas, formulários, aprovações e dados operacionais são estritamente isolados por workspace.
- Toda a operação e construção do System Builder deve rodar dentro de área autenticada, exceto rotas de `/auth/*`.
- Capabilities são globais e reutilizáveis; instalações e configurações são por workspace.

## Regra Mestra

Toda fase nova deve responder explicitamente:

```text
1. Quem usa esta capacidade?
2. Em qual área autenticada ela aparece?
3. Ela pertence à plataforma global ou a um workspace específico?
4. Que dados precisam ser visualizados, criados, editados, aprovados ou auditados?
5. Qual tela, painel, fluxo ou estado vazio precisa existir?
6. Que teste E2E comprova que um usuário consegue operar ou visualizar isso?
```

Se a fase for estritamente backend, ela deve documentar o motivo e criar ao
menos um item de backlog frontend vinculado.

## Estratégias de Organização de Fases

Para garantir esse princípio, o roadmap adota três abordagens:

1. Backend sprint seguido de frontend sprint. Exemplo: 28 e 28B.
2. Backend + frontend na mesma fase para escopos pequenos.
3. Bloco backend de consolidação seguido por frontend de consolidação. Exemplo: 31, 32 e 32B.

## Escopo Obrigatório por Tipo de Fase

### Backend/domínio

Se a fase cria service, repository, schema, action, endpoint ou regra de
negócio, deve incluir:

- leitura visível no Control Plane ou no workspace;
- estado vazio;
- estado de erro;
- carregamento ou feedback operacional;
- teste E2E mínimo quando houver rota/tela.

### Banco de dados

Se a fase cria ou altera tabelas, deve declarar:

- se a entidade é global ou workspace-scoped;
- como aparece na interface;
- qual filtro por `workspace_id` é obrigatório;
- qual usuário pode visualizar ou operar os dados.

### Capabilities

Capabilities são globais e reutilizáveis. Instalações são por workspace.

Toda fase que mexer em capabilities deve refletir:

- catálogo global;
- tela de instalação por workspace;
- estado instalado/desinstalado;
- impacto no menu/rotas do workspace.

### Workflows/processos

Toda fase que mexer em processos deve refletir:

- lista de processos do workspace;
- versão/status;
- origem/rastreabilidade;
- ações possíveis conforme status;
- eventos/auditoria quando suportado.

### Forms/rules/approvals

Toda fase que criar forms, regras ou aprovações deve refletir:

- preview ou builder de configuração;
- validação visual;
- erros de regra compreensíveis;
- trilha de aprovação quando existir;
- teste E2E do fluxo principal.

### Integrações/agentes

Toda fase de integração deve refletir:

- inbox/status operacional;
- logs/correlation id;
- recibo de submissão;
- falhas de autenticação/autorização;
- separação entre proposta de agente e aprovação humana.

## Critérios de Aceite Adicionais

Uma fase só pode ser considerada completa se incluir no relatório:

```text
Frontend impact:
- Área afetada:
- Rota(s):
- Usuário/persona:
- Workspace/global:
- Estados cobertos:
- Teste visual/E2E:
- Gap frontend pendente:
```

Se o campo `Gap frontend pendente` não estiver vazio, a decisão final da fase
deve ser no máximo:

```text
APROVADO COM RESSALVA DE UI
```

Para ser:

```text
APROVADO PARA PRÓXIMA FASE
```

a fase precisa comprovar que a interface acompanha o avanço técnico, salvo
quando a fase for declaradamente documental, infra invisível ou possuir fase
frontend imediatamente vinculada e autorizada.

## Aplicação

Este gate vale para:

- fases futuras do bloco Alpha;
- bloco Beta;
- fases corretivas;
- prompts de Jules Dev;
- prompts de Jules Tester;
- revisões feitas pelo ChatGPT/Codex.
