# View Contract: Process Mirroring Intake

- surface_id: UI-SURF-PROCESS-MIRRORING-INTAKE
- surface_name: Process Mirroring Intake
- route_candidate: /builder/process-mirroring
- implementation_status: documented

## Purpose
The Process Mirroring Intake is the first practical module to structure the collection and organization of information about observed processes.

## Persona
System Builder Platform Admin / Process Analyst

## Scope
Provides a synthetic/mock interface to manage process pilots, view synthetic sources, observations, evidence, gaps, As-Is drafts, validation decisions, and capability candidates.

## workspace_or_global
Global (Platform level)

## related_capabilities
- process_mirroring

## data_inputs
- Process Pilots
- Source Inventory
- Observations
- Evidence
- Gaps
- As-Is Drafts
- Validation Decisions
- Capability Candidates

## data_outputs
- Read-only views of the mock data
- Simulated state transitions

## commands
- Select Pilot
- Filter Pilots
- View details

## empty_state
- No pilots found

## loading_state
- Skeleton loader for pilots and details

## error_state
- Error loading pilot data

## success_state
- Pilot loaded successfully

## permissions
- Read-only for mock data

## audit_events
- None in this phase

## evidence_required
- UI must render without errors
- Mock data must be visible

## frontend_risks
- Coupling with real backend

## e2e_test_expectation
- Should render the list of pilots and details for a selected pilot
