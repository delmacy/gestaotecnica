# Adaptacao: Secao Tecnica

## 1. Objetivo

Esta e a primeira adaptacao real da plataforma. Ela representa a gestao
operacional de uma secao tecnica, incluindo demandas, ordens de servico,
ativos, mao de obra, escalas, livro de turno, documentos tecnicos, sistema
legado, planejamento e aquisicoes.

## 2. Workspace

- Chave: `secao-tecnica`
- Nome da adaptacao: `Secao Tecnica`
- Nome do workspace: `Sala Tecnica`

## 3. Arquivos

- `src/adaptations/secao-tecnica/terminology.ts`
- `src/adaptations/secao-tecnica/demand-types.ts`
- `src/adaptations/secao-tecnica/service-order-types.ts`
- `src/adaptations/secao-tecnica/asset-types.ts`
- `src/adaptations/secao-tecnica/shift-types.ts`
- `src/adaptations/secao-tecnica/roles.ts`
- `src/adaptations/secao-tecnica/queues.ts`
- `src/adaptations/secao-tecnica/workflows.ts`
- `src/adaptations/secao-tecnica/report-templates.ts`
- `src/adaptations/secao-tecnica/document-templates.ts`
- `src/adaptations/secao-tecnica/legacy.ts`

## 4. Tipos de demanda

- Incidente
- Solicitacao
- Vistoria
- Manutencao
- Pendencia de Turno
- Atividade Planejada
- Administrativo

## 5. Tipos de OS

- Manutencao
- Vistoria
- Atividade Administrativa
- Apoio Operacional

## 6. Tipos de escala

- Expediente
- Plantao
- Sobreaviso
- Ausencia

## 7. Papeis

- Tecnico Trainee
- Tecnico Pleno
- Tecnico Especialista
- Supervisor Tecnico
- Secretario Tecnico-Operacional
- Chefe Interino

## 8. Filas

- Operacional N1
- Triagem Tecnica
- Supervisao Tecnica
- Secretaria Tecnica
- Livro de Turno
- Planejamento Tecnico

## 9. Legado

O legado esta configurado como `Sistema Oficial` em modo `manual-first`.
A automacao futura deve considerar n8n, RPA ou API conforme disponibilidade.

## 10. O que ainda esta hardcoded

Alguns enums ainda existem no schema Drizzle por compatibilidade do MVP:

- `work_item_type`
- `schedule_type`
- `technician_level`
- status operacionais

Eles devem migrar para tabelas configuraveis quando houver necessidade real de
edicao por workspace no banco.
