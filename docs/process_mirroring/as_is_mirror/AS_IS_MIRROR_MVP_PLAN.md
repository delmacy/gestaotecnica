# As-Is Mirror MVP Plan

## 1. Objetivo do MVP
Criar uma superfície mock/sintética para visualizar o espelho do processo atual (As-Is) e suas incertezas, integrada ao Builder Shell e ao Process Mirroring, de forma estática sem depender de backend real, para validar a estrutura visual.

## 2. O que o módulo faz
- Visualizar processos As-Is (lista).
- Visualizar mapa de etapas do processo.
- Visualizar handoffs entre papéis/setores.
- Visualizar entradas e saídas por etapa.
- Visualizar sistemas/documentos usados (touchpoints).
- Visualizar evidências vinculadas.
- Visualizar gaps sobrepostos ao fluxo.
- Visualizar riscos/certeza/incerteza por etapa.
- Visualizar candidates de capabilities por etapa.
- Visualizar status de validação sintética.
- Diferenciar dados sintéticos, reais pendentes, reais bloqueados e futuros.

## 3. O que o módulo não faz
- Não executa workflow runtime.
- Não cria Ordem de Serviço real.
- Não resolve gap real.
- Não valida Gestão Técnica real.
- Não desbloqueia dependências reais (REAL-SRC-002, CAP-VAL-002).
- Não persiste dados no banco.
- Não chama APIs.

## 4. Personas
- Process Analyst
- Platform Admin
- Validator (Cliente simulado)

## 5. Entidades mínimas
- `AsIsProcessMirror`
- `AsIsProcessStep`
- `AsIsHandoff`
- `AsIsActorRole`
- `AsIsInput`
- `AsIsOutput`
- `AsIsSystemTouchpoint`
- `AsIsDocumentTouchpoint`
- `AsIsEvidenceLink`
- `AsIsGapOverlay`
- `AsIsRiskFlag`
- `AsIsCapabilityCandidate`
- `AsIsValidationStatus`
- `AsIsDataConfidence`

## 6. Telas/seções mínimas
- Process Mirror List
- Process Mirror Detail
- Step Map
- Step Detail
- Handoffs
- Inputs and Outputs
- Systems and Documents
- Evidence Links
- Gap Overlay
- Risk and Confidence
- Capability Candidates
- Validation Status

## 7. Fluxo de uso
1. Usuário acessa `/builder/process-mirroring/as-is`.
2. Visualiza lista de mirrors sintéticos.
3. Seleciona um mirror.
4. Visualiza mapa de fluxo As-Is e clica nas etapas.
5. Usa painéis laterais/inferiores para ver detalhes, handoffs, evidências, gaps e capabilities.

## 8. Dados sintéticos permitidos
- Dados fixos e mockados localmente nos arquivos `.ts`, sem PII, com labels claros como `synthetic`, `mock`, e avisos de `Not a runtime workflow`.

## 9. Dados reais futuros
- Integração com dados reais a partir do intake aprovado futuramente, após unblocking de permissões e infra.

## 10. Regras de incerteza
- Exibição de flags de risco/incerteza nas etapas, indicando onde falta confirmação ("confidence: low", "unknown").

## 11. Regras de evidência
- Exibir placeholders simulando links ou imagens/documentos que comprovam a etapa, mas sem links de upload/download reais.

## 12. Regras de gap overlay
- Destacar partes do fluxo/etapas que possuem gaps conhecidos com overlays de aviso/alerta.

## 13. Regras de capability mapping
- Mostrar quais capabilities poderiam resolver a etapa (ex: "Scheduling", "Audit"), mas apenas visualmente.

## 14. Gaps conhecidos
- Sem banco, runtime, api, rbac real, edicao markdown. Fica em modo Read-Only Sintetico.

## 15. Critérios de aceite
- Todos os itens da "Telas/seções mínimas" renderizados em tela com dados mockados.
- Nenhuma chamada de rede ou banco efetuada.
- Warning claro de "Synthetic Mode" visível na interface.
- Nenhum dado de PII presente.

## 16. Próximas tasks
- Revisão de prontidão (`DEV-READINESS-AS-IS-MIRROR-001`).
- Desenvolvimento com mocks (`DEV-AS-IS-MIRROR-001`).
