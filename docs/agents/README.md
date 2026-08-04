# Trabalho com agentes

Esta pasta define como agentes planejam, implementam, revisam, integram e documentam o System Builder.

## Leitura obrigatória

1. `../../AGENTS.md`
2. `../current/STATUS.md`
3. `../current/ROADMAP.md`
4. `../phases/<FASE>/README.md`
5. `../phases/<FASE>/TASKS.md`
6. `OPERATING_MODEL.md`
7. contrato específico do papel

## Arquivos

| Arquivo | Finalidade |
|---|---|
| `OPERATING_MODEL.md` | ciclo completo de execução e separação de papéis |
| `TASK_CONTRACT.md` | campos mínimos de uma task executável |
| `EVIDENCE_CONTRACT.md` | provas necessárias para mudar estados |

## Regra central

Agentes não escolhem livremente o próximo trabalho. Eles recebem uma task `ready`, atuam somente no escopo permitido e devolvem evidência verificável para revisão independente.
