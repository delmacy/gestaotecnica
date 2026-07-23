# Federated Instance Scope

Este documento projeta a abertura de escopo para federacao de instancias do System Builder. A intencao e permitir que a plataforma opere com a mesma simplicidade de um acesso remoto a notebook/servidor: uma instancia principal pode governar, distribuir, observar ou delegar capacidades para instancias isoladas, sem prender o cliente a um unico operador.

## Objetivo

Criar um modelo em que clientes, parceiros ou operadores possam ter uma instancia propria do System Builder com graus diferentes de autonomia:

- **Managed child instance:** instancia isolada do cliente, operada como filha da plataforma principal.
- **Delegated operator instance:** instancia de parceiro/dev/superuser autorizado, com governanca propria limitada por contrato.
- **Emancipated instance:** instancia que recebe export completo, credenciais, blueprints, dados e trilhas de auditoria para operar independentemente.
- **Federated peer:** instancia que nao e subordinada, mas troca pacotes, eventos ou capacidades por contratos assinados.

## Principios

1. Federacao nao substitui isolamento tenant/workspace; ela adiciona uma camada acima de instalacoes e ownership.
2. Nenhuma instancia remota recebe superuser global da plataforma principal.
3. Toda relacao entre instancias deve ser explicitamente registrada como contrato: origem, destino, escopo, capacidades autorizadas, validade, revogacao e trilha de auditoria.
4. Blueprints, forms, views, workflows, policies e seeds devem ser portaveis por pacote versionado, com checksum e redaction.
5. Dados operacionais do cliente so atravessam instancias por export/import autorizado, evento federado ou replicacao contratada.
6. O cliente deve poder sair do modo gerenciado sem perder seus dados, configuracoes, historico essencial e capacidade de operar.
7. A instancia principal governa catalogo, updates e observabilidade compartilhada; a instancia local governa runtime, credenciais locais e dados do cliente.

## Modelo de relacao

| Relacao | Quem opera | O que sincroniza | O que nao sincroniza automaticamente |
|---|---|---|---|
| Principal -> filha gerenciada | Plataforma principal | catalogo, blueprints aprovados, politicas de baseline, health signals | dados sensiveis sem consentimento, credenciais locais |
| Principal -> parceiro delegado | Parceiro/dev autorizado | pacotes aprovados, licencas, capability manifests, eventos de auditoria combinados | superuser da principal, dados de outros clientes |
| Filha -> principal | Cliente ou operador local | recibos de instalacao, telemetria sanitizada, status de compliance | banco bruto, segredos, anexos privados |
| Instancia emancipada | Cliente | export de configuracao e dados autorizados no momento da saida | dependencia operacional obrigatoria da principal |
| Peer federado | Duas plataformas | pacotes e eventos assinados por contrato | ownership implicito ou administracao cruzada |

## Capacidades planejadas

### FED-01 - Instance Registry

Catalogar instancias conhecidas com `instanceId`, tipo de relacao, owner, regiao, versao, status, chaves publicas, endpoints e politica de trust.

Aceite minimo:
- nenhuma instancia federada opera sem registro ativo;
- chaves e endpoints sao versionados;
- revogacao bloqueia novas trocas sem apagar auditoria historica.

### FED-02 - Federation Contract

Definir contrato assinado entre instancias com escopos como `catalog_read`, `blueprint_receive`, `blueprint_publish`, `health_report`, `support_session`, `data_export` e `data_import`.

Aceite minimo:
- contrato possui validade, issuer, subject, scopes, constraints e revocation reason;
- contrato nao concede acesso amplo por padrao;
- toda acao federada aponta para o contrato usado.

### FED-03 - Blueprint Distribution Channel

Evoluir o canal de blueprints para distribuicao entre instancias, mantendo checksum, dry-run, compatibilidade, redaction e provenance.

Aceite minimo:
- pacote informa instancia de origem, assinatura, versao do emissor e matriz de compatibilidade;
- instalacao em instancia filha passa por preflight local;
- import nao executa migracao destrutiva sem plano de rollback.

### FED-04 - Remote Support and Delegated Operations

Permitir sessoes de suporte remoto com escopo temporario, auditavel e revogavel, sem compartilhar credenciais permanentes.

Aceite minimo:
- suporte usa contrato temporario e permissao explicita;
- toda acao remota gera receipt com actor, instancia, workspace, escopo e correlation id;
- cliente consegue encerrar a sessao e revisar o que foi feito.

### FED-05 - Emancipation and Portability

Criar caminho de saida para cliente levar configuracoes, blueprints, dados autorizados e historico operacional essencial para uma instancia independente.

Aceite minimo:
- export separa configuracao, dados operacionais, anexos e auditoria;
- secrets nao sao exportados em claro;
- import em nova instancia faz dry-run, reconciliacao e relatorio de lacunas.

### FED-06 - Federated Observability

Definir telemetria sanitizada entre instancias para health, versao, jobs, filas, erros e compliance, sem vazar dados do cliente.

Aceite minimo:
- payloads sao minimizados e redigidos;
- instancia filha pode operar offline e sincronizar status depois;
- alertas distinguem falha local, falha de contrato e falha da principal.

## Impacto arquitetural

- **Platform/Builder:** passa a governar tambem contratos de instancia, distribuicao de pacotes e politicas de trust.
- **Runtime:** continua tenant/workspace-scoped e nao deve depender de conectividade permanente com a principal.
- **Blueprints:** viram unidade central de portabilidade entre instancias, nao apenas instalacao local.
- **RBAC/DB roles:** precisam separar operador local, operador federado, suporte temporario, migracao e break-glass.
- **Eventos:** devem carregar `instanceId`, `sourceInstanceId`, `federationContractId` e provenance quando cruzarem fronteiras.
- **API Gateway:** deve expor dominios de uso publicados por contrato, nao acesso generico ao banco.

## Ordem sugerida de materializacao

1. Fechar Real Data Path e UX Navigation para o produto demonstrar trabalho real local.
2. Executar `UX-NAV-06` e `UX-NAV-07` em `UX_NAVIGATION_EXTENSION_TASKS.md` para desenhar a experiencia de marketplace, simulacao, blueprint diff, policies, instancias, suporte, lineage, handoff e exit readiness.
3. Materializar FED-01/FED-02 como fase documental e contratos tipados, sem execucao remota.
4. Ligar FED-03 ao fluxo de blueprint packaging/import-export.
5. Implementar FED-04 somente depois de RBAC, audit receipts e support diagnostics estarem maduros.
6. Implementar FED-05 antes de vender isolamento forte como promessa comercial.
7. Implementar FED-06 para operacao multi-instancia recorrente.

## Fora de escopo inicial

- Replicacao automatica bidirecional de banco inteiro.
- Administracao remota irrestrita.
- Compartilhamento de credenciais de superuser.
- Lock-in contratual que impeça export/import do cliente.
- Misturar dados de clientes em uma instancia principal para conveniencia operacional.
