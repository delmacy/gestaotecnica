# Workspace and Client Context Switching Contract

This document acts as the master contract clarifying the route contract, data contract, role/scope rules, states, and acceptance gates for Workspace and client context switching within the navigation and execution areas of the System Builder platform, fulfilling task UX-NAV-02-021.

## Overview
The System Builder platform allows users to switch between different Workspaces (client contexts) to access specific business operational data and configurations. This document defines how workspace switching is handled via navigation, UI states, and data contexts.

## Navigation Experience
1. **Where the user came from**:
    - Users typically originate from a logged-in state within a default or previously selected Workspace (`/builder`). They may interact with a global "Workspace Switcher" UI component usually located in the top navigation or sidebar.
2. **What they do here**:
    - When engaging the Workspace Switcher, users view a list of available workspaces they are authorized to access.
    - Users select a different workspace to switch context. The system resolves the destination URL and state payload for the new workspace.
3. **Where they go next**:
    - Upon selection, the user is seamlessly routed to the root or a safe landing area of the selected workspace (e.g., `/builder` re-initialized with the new `workspaceId` context).
4. **How they return**:
    - The Workspace Switcher remains persistent and accessible. The user can return to their previous workspace by re-engaging the switcher and selecting their former workspace from the list.

## Data and Route Contract
The contract requires a defined schema for resolving the available workspaces and the target route upon switching.

### State Rules
- **Empty State**: If a user has access to only one workspace, the switcher may be disabled or hidden, showing the single active workspace name (e.g., "Company A Workspace").
- **Blocked State**: Workspaces the user does not have permission to access are completely excluded from the switcher list to prevent unauthorized access attempts.
- **Demo State**: If the environment is in demo mode, the available workspaces may be limited to specific demonstration client contexts.
- **Synthetic Data State**: Synthetically generated workspace contexts must be clearly labeled (e.g., "Beta Tester (Synthetic)") in the switcher list.
- **Real-Data State**: Real client workspaces are listed with their official commercial names (e.g., "Acme Corp Operations").

## Role/Scope rules
- Users must only see workspaces they are explicitly authorized as `workspace_member` or `workspace_admin`.
- Switching a workspace strictly updates the `WorkspaceContext` without polluting the global `PlatformContext`.

## Acceptance Gates and Test Expectations
1. **E2E Path Verification**: Automated tests must ensure a user can click the workspace switcher, view available workspaces, select one, and be routed to the correct context.
2. **Authorization Verification**: Tests must assert that a user only sees workspaces they are explicitly authorized for.
3. **State Visibility**: Ensure demo and synthetic labels are appropriately applied in non-production modes.
