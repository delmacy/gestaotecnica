# Feature Contract — Fase 33B
## 1. Identificação
- Fase: 33B
- Nome: Living Procedures UI
- Tipo: Frontend
- Dependências: Fase 33
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Exibição read-only em Markdown de procedimentos em `/procedures`.

## 3. Problema que resolve
Frontend Parity Gate de procedimentos documentais.

## 4. Domínio / DDD
- Application Use Case: ViewLivingProcedure (Leitura)
- Persona: Usuário do Workspace
- Decisão Humana: N/A
- Estados da Entidade: published (único estado visível para usuários normais).
- Erros de Domínio Visíveis: Procedimento não encontrado.
- Audit Trail / Receipt: N/A

## 5. Escopo permitido
- `/procedures` página.

## 6. Fora de escopo
- Editor complexo/Rico.

## 7. Entidades e contratos
N/A

## 8. Estados e transições
- Detalhe markdown.

## 9. Services, repositories e actions esperados
N/A

## 10. UI esperada
- Rota: `/procedures`.
- Detalhe de markdown renderizado.
- Estados de loading/erro e empty.

## 11. Testes obrigatórios
- Visual e E2E.

## 12. Frontend impact
- `/procedures`.

## 13. Critérios de aceite
- Markdown renderizado corretamente com markdown parser.

## 14. Regra de parada
Leitura concluída.

## 15. Prompt para Jules Dev
`Criar a interface visual read-only para Living Procedures (Fase 33B).`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- Começamos read-only.
