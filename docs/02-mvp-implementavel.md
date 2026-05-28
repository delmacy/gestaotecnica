# MVP Implementável

Objetivo do MVP: provar o ciclo central da system builder platform com o menor
número de módulos, mantendo a arquitetura correta para replicar a solução em
outros clientes. A Seção Técnica entra como primeira adaptação real do MVP.

## Fluxo principal

```text
Abrir demanda
→ classificar WorkItem
→ gerar OS
→ atribuir técnico/equipe
→ registrar execução e tempo
→ vincular ativo
→ gerar eventos
→ aparecer no livro de turno
→ gerar relatório básico
```

## Módulos que entram no MVP

1. Foundation
2. Workforce básico
3. WorkItems / Demandas
4. Service Orders / OS
5. Assets básico
6. Event Log
7. Shift Log simples
8. Reports básico

## Fora do MVP

Estes pontos ficam planejados, mas não devem bloquear a primeira versão:

- escala completa;
- sobreaviso;
- workflow documental complexo;
- assinatura;
- integração automática com legado;
- aquisições;
- planejamento anual;
- dashboards avançados;
- automações externas;
- permissões muito granulares.

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
- ServiceOrder representa a execução autorizada.
- Toda ação relevante deve gerar EventLog.
- Ativos podem existir de forma simples no início.
- Livro de turno deve ser uma consolidação operacional, não apenas texto solto.
- Relatório básico pode ser gerado a partir de eventos, OS e apontamentos de tempo.
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
