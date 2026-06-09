# DDD Feature Contract Addendum

## Introdução
Com a adoção do DDD Pragmático no System Builder, o `FEATURE_CONTRACT_TEMPLATE.md` passa a contar com uma nova seção obrigatória: **4. Domínio / DDD**. Este adendo explica como preencher essa seção, tanto para fases de Backend quanto de Frontend.

## Regra Geral
Toda fase (a partir das regras ativas do Alpha) deve preencher a seção de domínio, esclarecendo o impacto arquitetural da entrega antes do código ser escrito.

## Para Fases de Backend
Toda fase de backend deve declarar claramente os elementos estruturais da sua lógica de negócio:
- **Bounded Context:** Em qual contexto do sistema esta funcionalidade reside? (ex: Agent Gateway Context, Runtime Context).
- **Aggregate/Entity principal:** Qual é a entidade ou agregado central que está sendo criado ou modificado?
- **Invariants:** Quais regras de negócio absolutas devem ser protegidas? (ex: "Processo publicado não pode ser editado", "Idempotency key deve ser única por requisição").
- **Application Use Case:** Qual é a ação (Use Case) que orquestra a lógica? Evite termos genéricos como "Criar", prefira intenções claras (ex: `RegisterAgentSubmissionWithIdempotency`).
- **Repository Port:** Qual é a interface que define a persistência dessa entidade?
- **Infrastructure Adapter:** Qual é a implementação concreta do repositório? (ex: `DrizzleAgentGatewaySubmissionRepository`).
- **Domain/Application Events:** Que eventos são disparados como resultado da operação? Ou que receipts (recibos) são gerados?
- **Transaction Boundary:** Quais operações devem ocorrer dentro da mesma transação de banco de dados para garantir consistência?
- **Consistency/Idempotency:** Se aplicável, como a funcionalidade lida com tentativas repetidas ou consistência de dados?

## Para Fases de Frontend
Toda fase de frontend (frequentemente as fases com sufixo "B", como 30B, 31B) deve declarar como torna a lógica de negócio operável:
- **Application Use Case:** Qual caso de uso do backend esta UI permite que o usuário execute?
- **Persona:** Quem está executando esta ação? (ex: Administrador do Workspace, Sistema, Usuário final).
- **Decisão Humana:** Onde há uma escolha ou aprovação obrigatória do usuário?
- **Estados da Entidade:** Quais estados (status) a UI precisa interpretar e exibir de forma diferente? (ex: Draft = Botão cinza, Published = Badge verde).
- **Erros de Domínio Visíveis:** Como a interface reage a violações de invariantes ou erros de domínio? (ex: Toast informando que "Agente não pode publicar").
- **Audit Trail / Receipt:** Quando aplicável, como o rastro da operação é exibido para o usuário?