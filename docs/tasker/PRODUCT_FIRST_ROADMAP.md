# Product-First Roadmap

## 1. Objetivo do replanejamento
Reposicionar o projeto para garantir que o desenvolvimento da fundação do **System Builder (Plataforma)** não seja paralisado pela indisponibilidade atual de fontes reais do seu primeiro piloto (Gestão Técnica).

## 2. Diferença entre System Builder e Gestão Técnica
- **System Builder (Plataforma):** O motor central. Compreende ferramentas agnósticas, como o Shell administrativo, o Board de tasks, Capability Explorer, Intake de dados, e o Builder de formulários e workflows. Pode ser construído e testado com dados genéricos.
- **Gestão Técnica (Cliente/Piloto):** Um caso de uso específico a ser implementado no Builder. Requer dados operacionais e espelhos reais do mundo (As-Is) para que o processo resultante seja válido e útil, mas não é um pré-requisito para que a plataforma exista.

## 3. O que pode desenvolver agora
As seguintes funcionalidades estruturais da plataforma **podem avançar** usando dados sintéticos (fixtures, mocks) claramente identificados (`SIMULATED_OBSERVATION`):
- Builder Shell
- Tasker Board
- Capability Explorer
- Registry e Docs Viewers
- Process Mirroring Intake
- Source Intake
- Gap Tracker

## 4. O que deve esperar fontes reais
Qualquer validação de modelo operacional, match de capabilities específico, ou mapa empresarial relacionado ao processo real da **Gestão Técnica**.
*(Tasks: REAL-SRC-002, CAP-VAL-002, GT-PILOT-001, GT-RUNTIME-001)*

## 5. Ordem recomendada das próximas fases
1. **Grupo A (Imediato):** Preparação documental e contratual das interfaces do System Builder.
2. **Grupo A (Desenvolvimento):** Liberação de código para as tasks do Grupo A (após readiness matrix autorizar).
3. **Grupo B:** Planejamento e contratos dos construtores dinâmicos (Form Builder, Workflow Builder).
4. **Grupo C:** Definição final dos contratos de Runtime e Integrações externas.
5. **Grupo D (Gestão Técnica):** Assim que as fontes reais chegarem e a plataforma base (Grupo A e B) estiver minimamente madura, iniciar o Process Mirroring real do cliente piloto.

## 6. Gates de desenvolvimento
- **Product Gate:** Contratos e planning documentados nas tasks.
- **Readiness Gate:** Aprovação na `DEV_READINESS_MATRIX.md`, atestando que a task específica possui todas as definições estruturais necessárias para implementação.
- **Code Gate:** Paridade de frontend, testes, e uso de dados simulados (se módulo base) confirmados via Pull Request e pre-commit checks.

## 7. Critérios para liberar Jules Dev
O Jules Dev será autorizado a implementar código (UI, schemas, componentes) **exclusivamente** para tarefas que:
1. Pertençam aos Grupos A ou B do backlog da plataforma;
2. Tenham seus contratos de UI (`VIEW_CONTRACT.md`) revisados e aprovados;
3. Estejam marcadas como `READY_FOR_DEV` na DEV_READINESS_MATRIX;
4. Não dependam de fontes operacionais reais bloqueadas.

## 8. Critérios para retomar Gestão Técnica como cliente piloto
A execução das tarefas do Grupo D será retomada mediante:
1. O recebimento efetivo das fontes reais pelo cliente.
2. O preenchimento da checklist de anonimização.
3. A conclusão funcional (deployed/testable) de um escopo mínimo da plataforma (Shell, Explorer, Tasker) que permita que os fluxos reais do cliente sejam cadastrados diretamente no sistema, ao invés de apenas em planilhas/markdown temporários.
