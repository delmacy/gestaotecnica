# MVP Implementavel

Objetivo do MVP: provar o fluxo central da secao tecnica com o menor numero de modulos, mantendo o esqueleto arquitetural correto para crescer depois.

## Fluxo principal

```text
Abrir demanda
→ classificar WorkItem
→ gerar OS
→ atribuir tecnico/equipe
→ registrar execucao e tempo
→ vincular ativo
→ gerar eventos
→ aparecer no livro de turno
→ gerar relatorio basico
```

## Modulos que entram no MVP

1. Foundation
2. Workforce basico
3. WorkItems / Demandas
4. Service Orders / OS
5. Assets basico
6. Event Log
7. Shift Log simples
8. Reports basico

## Fora do MVP

Estes pontos ficam planejados, mas nao devem bloquear a primeira versao:

- escala completa;
- sobreaviso;
- workflow documental complexo;
- assinatura;
- integracao automatica com legado;
- aquisicoes;
- planejamento anual;
- dashboards avancados;
- automacoes externas;
- permissoes muito granulares.

## Entidades minimas

- users
- technician_profiles
- teams
- work_items
- service_orders
- service_order_assignments
- time_entries
- assets
- evidences
- event_logs
- shifts
- shift_log_entries
- reports

## Regras iniciais

- WorkItem representa a necessidade.
- ServiceOrder representa a execucao autorizada.
- Toda acao relevante deve gerar EventLog.
- Ativos podem existir de forma simples no inicio.
- Livro de turno deve ser uma consolidacao operacional, nao apenas texto solto.
- Relatorio basico pode ser gerado a partir de eventos, OS e apontamentos de tempo.
- `.env`, `.vercel/` e ferramentas locais devem permanecer fora do Git.

## Roadmap sugerido

### Fase 1 - Nucleo operacional

- criar projeto Next.js;
- configurar TypeScript;
- configurar PostgreSQL;
- criar schema inicial;
- implementar CRUD de WorkItems, OS, Ativos e Tecnicos;
- criar modulo WorkItems com listagem, formulario de demanda e evento `work_item.created`;
- criar modulo Assets com listagem, cadastro, detalhe e eventos `asset.created`/`asset.status_changed`;
- criar modulo Service Orders com criacao de OS a partir de WorkItem e eventos operacionais;
- registrar eventos;
- criar livro de turno simples;
- gerar relatorio basico.

### Fase 2 - Governanca operacional

- aprovacoes;
- revisoes;
- secretaria tecnico-operacional;
- estados documentais;
- anexos e evidencias mais robustas;
- vinculo manual com sistema legado.

### Fase 3 - Planejamento e inteligencia

- escalas;
- sobreaviso;
- planejamento de manutencao;
- necessidades de aquisicao;
- dashboards;
- alertas;
- automacoes via n8n;
- integracao controlada com legado.
