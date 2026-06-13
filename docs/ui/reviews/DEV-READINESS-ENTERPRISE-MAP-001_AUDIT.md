# Enterprise Map Dev Readiness Audit

## Avaliação
1. **princípio process-driven**: Mapeado (entidades Process, Value Stream).
2. **objetivo**: Mock visual de Enterprise Architecture corporativa.
3. **rota atual**: `/builder/enterprise-map` documentada.
4. **rota futura**: `/[workspace_id]/enterprise-map` documentada.
5. **Builder Shell**: Será acoplado no shell global do Builder.
6. **personas**: Platform Admin, Enterprise Architect, Workspace Admin.
7-23. **Entidades/Layers/Nodes/Governance/Gaps**: Tudo especificado nos contratos sintéticos.
24. **static data**: Contratos exigem modo sintético/mock local, arrays JS.
25. **graph library existente**: O `package.json` possui `@xyflow/react` (versão já instalada), portanto podemos reutilizar.
26-27. **riscos**: Complexidade visual e parecer arquitetura real foram endereçados adicionando avisos de tela "Synthetic / Design-only" e limitando estado apenas à memória local.
28-31. **restrições**: Sem workspace real, sem db local, sem API, sem fontes reais (ok, garantido nas boundaries).
32. **testes**: Unidade e Linting necessários após o componente.
33. **decisão**: Pronta para desenvolvimento com limitações (static apenas).

## Decisão
READY_FOR_DEV_WITH_LIMITS
