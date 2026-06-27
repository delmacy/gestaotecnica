# SB-S01-T04 — Auditar escopo, duplicidades e consistência do catálogo

## Tipo
Review independente.

## Estado inicial
`blocked` até `SB-S01-T02` e `SB-S01-T03` estarem aprovadas ou mergeadas.

## Objetivo de negócio
Verificar, por uma perspectiva independente da elaboração do inventário e do mapeamento, se o novo catálogo realmente representa o trabalho existente sem duplicidades, lacunas, ciclos ocultos ou escopos que provoquem colisões futuras entre agentes.

## Contexto atual
A T01 produz o inventário; a T02 cria o mapeamento canônico; a T03 automatiza verificações estruturais. Esta task não repete esses trabalhos nem corrige silenciosamente os artefatos. Ela revisa evidências, compara fontes e publica findings verificáveis.

## Resultado esperado
Criar `docs/product-roadmap/sprint-01-backlog-governance/SPRINT_REVIEW.md` com:

- resumo executivo;
- artefatos e SHAs revisados;
- resultado do validador;
- findings por severidade;
- duplicidades confirmadas ou descartadas;
- tasks sem cobertura;
- dependências incorretas;
- conflitos de diretório e paralelismo;
- estados divergentes do GitHub real;
- recomendações objetivas;
- decisão: approve, approve-with-follow-ups ou request-changes.

## Dependências

- `SB-S01-T01` concluída;
- `SB-S01-T02` concluída;
- `SB-S01-T03` concluída;
- artefatos publicados remotamente e revisáveis.

## Regra de independência

Sempre que houver executor separado disponível, esta task não deve ser executada pelo mesmo agente que produziu T01–T03. Caso isso seja impossível, a limitação deve constar no relatório.

## Diretórios permitidos

- `docs/product-roadmap/sprint-01-backlog-governance/SPRINT_REVIEW.md`
- anexos documentais da review dentro da pasta da sprint.

## Diretórios proibidos

- todos os arquivos produzidos por T01–T03;
- `src/**`;
- `scripts/**`;
- `tests/**`;
- `TASK_INDEX.md`;
- issues, PRs e estados externos.

## Regras obrigatórias

1. Não implementar correções no mesmo PR.
2. Cada finding deve conter severidade, evidência, impacto e recomendação.
3. A severidade deve seguir:
   - blocker: impede descoberta ou execução correta;
   - high: pode gerar duplicação, colisão ou entrega incorreta;
   - medium: degrada rastreabilidade ou manutenção;
   - low: melhoria editorial sem impacto operacional imediato.
4. Comparar descrição com diff e estado real.
5. Rodar o validador sem alterar o catálogo.
6. Distinguir ausência de evidência de evidência de ausência.

## Checklist mínimo de review

- inventário cobre as fontes obrigatórias;
- PRs fechados sem merge estão classificados corretamente;
- mappings possuem justificativa;
- IDs são únicos;
- dependências não formam ciclos;
- paralelismo não sobrepõe diretórios;
- tasks de review/teste não incluem implementação indevida;
- prompts apontam para arquivos existentes;
- nenhuma task ready contém placeholder crítico;
- regras globais e contexto da sprint são coerentes.

## Cenários obrigatórios

- um item histórico mapeado para task errada;
- duas tasks com mesmo resultado esperado;
- dependência técnica omitida;
- task marcada paralela com conflito de arquivos;
- estado do documento divergente do GitHub;
- finding sem evidência suficiente.

## Critérios de aceite

- review cobre T01–T03 e o catálogo global afetado;
- findings são reproduzíveis;
- nenhuma correção funcional ou documental é misturada;
- decisão final é sustentada pelas evidências;
- blockers impedem aprovação explícita.

## Evidências obrigatórias no PR

- base e head SHAs revisados;
- comando e resultado do validador;
- lista de arquivos consultados;
- links ou identificadores dos artefatos externos usados;
- declaração de independência ou limitação.

## Fora de escopo

- corrigir findings;
- reorganizar outras sprints;
- mudar estados de issues/PRs;
- aprovar implementações funcionais do produto.

## Rollback
Reverter apenas o relatório de review.

## Prompt Jules
Busque a task `SB-S01-T04` em `docs/product-roadmap/sprint-01-backlog-governance/04-auditar-escopo-duplicidades.md` e execute somente a review independente, sem corrigir os artefatos revisados.