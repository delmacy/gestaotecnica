# Operator Guide - Readiness Checklist

## Etapa 1 - Contratos
- [ ] O contrato `OPERATOR_GUIDE.md` foi criado com os campos obrigatórios?
- [ ] O plano `OPERATOR_GUIDE_MVP_PLAN.md` foi estabelecido?
- [ ] O modelo visual `OPERATOR_GUIDE_VISUAL_MODEL.md` foi definido?
- [ ] O index estático `OPERATOR_GUIDE_STATIC_INDEX_CONTRACT.md` foi documentado?
- [ ] Boundaries `OPERATOR_GUIDE_BOUNDARIES.md` restringe uso dinâmico/persistente?
- [ ] Regras de interação `OPERATOR_GUIDE_INTERACTION_RULES.md` estão definidas?

## Etapa 2 - DEV Readiness
- [ ] A matriz de paridade `OPERATOR-GUIDE-001_PARITY_MATRIX.md` está completa?
- [ ] O VIEW_CONTRACT foi atualizado?
- [ ] O DEV_READINESS_MATRIX e os Boards do Tasker foram atualizados?
- [ ] A auditoria `DEV-READINESS-OPERATOR-GUIDE-001_AUDIT.md` liberou o Dev?

## Etapa 3 - Dev
- [ ] Componente `OperatorGuideStudio` (e filhos) implementado?
- [ ] O index estático `operator-guide-data.ts` possui os 12 guias mínimos?
- [ ] Todos os checklists marcam localmente sem erro TypeScript?
- [ ] Rota `/builder/operator-guide` foi conectada ao Shell?

## Etapa 4 - Review
- [ ] Review Audit aprovado?
- [ ] Testes rodados sem erros (`lint`, `build`, `test:unit`)?
- [ ] Nenhum segredo/PII na base mockada?
- [ ] Próximas tasks liberadas no Tasker?
