# Context Pack: Runtime Events

## 1. Objetivo do Domínio
Introduzir a primeira camada mínima de rastreabilidade (logs acionáveis) para o ciclo de vida das instâncias do processo. Estabelecer contratos iniciais de eventos (`process.started`, `step.completed`, `process.completed`) que alimentam o comprovante básico da execução do fluxo.

## 2. Arquivos Principais
- Tipos a definir na arquitetura de Runtime (ex: `src/features/workflow/runtime/events/`).
- Repository e Service de Runtime, onde os eventos são acoplados.

## 3. Decisões Ativas
- Rastreamento simples acoplado diretamente aos métodos do Runtime Service (ex: gerar um registro sincrono no BD ao iniciar/concluir step).
- Formação de um "Trace Receipt" simplificado.

## 4. Anti-Escopo
- Não criar Event Bus assíncrono (Pub/Sub).
- Não criar arquitetura de Outbox isolada.
- Não implementar webhook ou integração com n8n real.

## 5. Próximas Fases Relacionadas
- **Bloco 19 (A, B, C, D)**: Injeção dos eventos mínimos de rastreabilidade no ciclo do runtime já estabelecido no Bloco 18.