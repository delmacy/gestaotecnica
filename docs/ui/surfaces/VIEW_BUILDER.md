---
surface_id: UI-SURF-VIEW-BUILDER
surface_name: View Builder
route_candidate: /builder/view-builder
implementation_status: documented
---

# View Builder

## Purpose
A surface mock/static design-only para definir o contrato visual do futuro builder de views. Serve para simular montagem de list views, detail views, kanban views, calendar views e dashboard cards. Prepara o esquema futuro de UI e as interações sem persistir, realizar queries ou acionar o runtime.

## Persona
System Builder / Admin

## Scope
- Desenhar views mockadas
- Organizar campos, colunas, filtros, sorting, grouping e preview
- Preparar schema futuro
- Relacionar views com forms, capabilities e process steps
- **Fora do escopo:** Salvar views reais, gerar rotas ou componentes, gerar queries reais, conectar a um banco de dados real, acionar runtime ou instalar capabilities reais.

## workspace_or_global
global

## related_capabilities
- organization
- requests
- work_orders

## data_inputs
- Static schema representations dos views (mocked data).
- Dados sintéticos de form blueprints/fields disponíveis.

## data_outputs
- Nenhum. Design-only surface. O estado reside no client side e não é persistido.

## commands
- Select Blueprint
- Select View Type
- Add/Remove Field/Column (simulado)
- Configure Filters, Sorts, Grouping (simulado)
- Preview View (mock)

## empty_state
Mensagem informando que nenhum Blueprint foi selecionado ou não há configurações prontas.

## loading_state
Não aplicável (dados static load instantaneamente).

## error_state
Erro de simulação de binding falho devido a data source faltante.

## success_state
Visualização do preview atualizado baseado nas regras visuais simuladas.

## permissions
System Builder Role (simulada)

## audit_events
Nenhum. Ação design-only.

## evidence_required
Nenhuma (sem alteração do estado operacional).

## frontend_risks
Risco de parecer interativo real se as badges 'mock', 'static' não ficarem claras.

## e2e_test_expectation
O System Builder navega por Blueprints mockados, simula alterações de colunas/filtros, vê o preview renderizar via static schemas e confirma os avisos visuais de readiness.
