// Canonical seed constants for the UX-NAV-04 Builder persistence foundation.
//
// "Evidence reuses or replaces the probe organization deliberately."
// This deliberate probe fixture provides exactly ONE organization with
// THREE workspaces so the durable-selection acceptance (selecting any of the
// three created workspaces must persist) maps 1:1 to real records.

export const BUILDER_PROBE_NAMESPACE = "builder_probe";

export const BUILDER_PROBE = {
  organization: {
    key: "org_builder_probe",
    name: "Builder Probe Organization",
  },
  workspaces: [
    { key: "ws_builder_probe_core", name: "Core Operations" },
    { key: "ws_builder_probe_support", name: "Support Operations" },
    { key: "ws_builder_probe_field", name: "Field Maintenance" },
  ],
  user: {
    email: "builder.probe@system-builder.local",
    name: "Builder Probe User",
  },
  defaultWorkspaceKey: "ws_builder_probe_core",
} as const;

export const ACCESS_PROFILE_BUILDER = "builder";
