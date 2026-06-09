# Process Candidates (Módulo)

O `Process Candidate` é a principal entidade transacional entre o mundo da informalidade (sinais, agentes, propostas manuais) e a formalidade da produção (Workflows publicados).

## Atributos Conceituais
- `status`: draft | under_analysis | waiting_review | approved | rejected | published
- `origin`: manual | agent | integration | imported
- `evidence`: Sinais coletados que justificam a criação do processo.
- Elementos Propostos: states, transitions, forms, rules, risks.

Qualquer alteração ou novo fluxo sugerido passa a existir como um candidato. Após a aprovação do dono do processo, ele é "compilado" em um `Workflow Template` oficial.
