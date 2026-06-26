// Re-exporting all from legacy but we need to handle name collisions if they exist
// The CI complained about 'users' and 'fieldDefinitions'
export * from "./legacy/schema";

// Specifically re-export inventory
export * from "./runtime/schema/inventory";

// For other schemas, we might want to avoid export * if they collide with legacy
// src/db/runtime/schema/workspace.ts has 'fieldDefinitions' which collides with src/db/runtime/schema/workflow.ts
// src/db/runtime/schema/identity.ts has 'users' which collides with src/db/legacy/schema.ts

export {
    organizations,
    workspaces,
    workspaceMembers,
    entityDefinitions,
    dynamicRecords,
    fieldDefinitions as workspaceFieldDefinitions // Aliasing to avoid collision
} from "./runtime/schema/workspace";

export {
    processDefinitions,
    flowDefinitions,
    processVersions,
    states,
    transitions,
    actions,
    processInstances,
    processPayloads,
    events,
    fieldDefinitions as workflowFieldDefinitions, // Aliasing to avoid collision
    forms,
    formFields,
    actionRegistry,
    actionExecutions,
    outboxEvents
} from "./runtime/schema/workflow";

export {
    usersTable,
    users as identityUsers, // Aliasing to avoid collision with legacy users
    roles,
    permissions
} from "./runtime/schema/identity";

export * from "./runtime/schema/traceability";
