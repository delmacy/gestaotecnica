# Tasks — F23 Process Mirroring Engine

Execução bloqueada até F22. Antes de implementar cada task, classificar componentes existentes como `reuse`, `extend` ou `replace`.

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| SB-PM-01 | Fontes de observação | F22 | planned | sinais manuais, eventos, webhooks e documentos preservam origem e consentimento |
| SB-PM-02 | Criar Process Candidate a partir de observação | PM-01 | planned | candidato estruturado, revisável e nunca publicado automaticamente |
| SB-PM-03 | Workflow de revisão do candidato | PM-02, F25 contracts | planned | draft, submit, approve/reject e publish com autorização e eventos |
| SB-PM-04 | Modelo As-Is | PM-02 | planned | atores, estados, transições, sistemas e formulários versionados |
| SB-PM-05 | Análise de gaps | PM-04, F24 contracts | planned | diferenças explicáveis entre As-Is e referência |
| SB-PM-06 | Extração de padrões | PM-01..04 | planned | repetição gera proposta com evidência, não verdade automática |
| SB-PM-07 | Versionamento e rollback | PM-03..04 | planned | diff, changelog, versão estável e recuperação |
| SB-PM-08 | Grafo de dependências de processos | PM-04, PM-07 | planned | dependências navegáveis e ciclos identificados |
| SB-PM-09 | Métricas de processo | PM-04, runtime events | planned | cycle time, throughput e gargalos derivados de eventos reais |
| SB-PM-10 | Publicação no registry | PM-03, PM-07, F25 | planned | candidato aprovado vira definição publicada e auditável |

## Reconciliações obrigatórias

- revisar contratos e pilotos existentes em `docs/process_mirroring/**`;
- reaproveitar Gateway, Candidate Evidence UI e contratos de runtime quando aplicável;
- não duplicar Process Candidate ou publicação já implementados parcialmente;
- separar claramente captura de sinal, interpretação e decisão humana.
