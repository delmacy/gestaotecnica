# View Builder Surface Inventory

This document outlines the routes, components, and types involved in the View Builder MVP surface.

## Routes

- `src/app/(builder)/builder/view-builder/page.tsx`: The main View Builder Studio page, providing the top-level layout and entry point to the MVP application. It hosts the `ViewBuilderStudio` component.

## Components

The UI components reside in `src/components/builder/view-builder/`.

- `ViewBuilderStudio.tsx`: The orchestrator and main container for the View Builder experience.
- `ViewBlueprintList.tsx`: Lists predefined (mock/synthetic) view blueprints for selection.
- `ViewTypeSelector.tsx`: Component to select the type of the view.
- `ViewCanvas.tsx`: Central area to preview the constructed view based on its configuration.
- `ViewFieldPalette.tsx`: Palette to manage fields and columns.
- `ViewFiltersPanel.tsx`: Panel to build and manage mock filters.
- `ViewSortingPanel.tsx`: Panel to handle sorting and grouping rules.
- `ViewActionsPanel.tsx`: Panel to manage view actions.
- `ViewBindingsPanel.tsx`: Displays mock bindings to forms, processes, and capabilities.
- `ViewGovernancePanel.tsx`: Shows governance warnings and readiness status.

## Data & Types

- `view-builder-data.ts`: Contains the hardcoded static mock data used across the View Builder MVP.
- `view-builder-types.ts`: Defines the TypeScript types and structures modeling the View Builder entities (e.g., `ViewBlueprint`, `ViewType`, `ViewField`, `ViewColumn`, `ViewFilter`, etc.).

## Key Characteristics

- **Design-Only / Mock Mode:** The View Builder MVP is strictly an offline simulation. It uses static local schemas for its blueprints and interactions. It does not claim real data binding or publication.
- **No Persistence:** There are no backend calls to save views, no database interactions, and no actual capabilities or server actions are invoked. A future persistence handoff phase will integrate these systems.
- **Real-Time Client Reaction:** The interface immediately reflects state changes within the client, resetting on page refresh.
