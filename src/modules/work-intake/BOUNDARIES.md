# Boundaries: Work Intake Module

## Propósito
Capturar solicitações e observações operacionais para triagem, qualificação e conversão futura em processos ou ordens de serviço.

## Escopo Autorizado
- Gestão de solicitações (Intake Requests).
- Histórico de eventos de entrada.
- UI isolada para listagem, captura e detalhamento.
- Transições de estado internas (new -> triage -> qualified -> converted -> closed).

## Proibições e Limites
- **Core Platform:** Não altera `src/platform/kernel.ts` diretamente (registrado como GAP).
- **Runtime Engine:** Não executa workflows complexos; apenas transições de estado simples.
- **Service Orders:** Não cria OS diretamente; o módulo apenas qualifica para que outros módulos (ex: Service Orders) realizem a conversão.
- **Auth:** Não altera permissões ou perfis de acesso.
- **Migrations:** Não cria tabelas novas; utiliza `builder.process_candidates` para persistência genérica.

## Isolamento
- O módulo reside inteiramente em `src/modules/work-intake/`.
- Depende de `src/platform/` para ações, eventos e contexto de workspace.
- Utiliza contratos Zod estritos para todas as entradas e saídas.
