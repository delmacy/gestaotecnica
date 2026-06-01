import { eq, desc, and } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import {
  processDefinitions,
  flowDefinitions,
  processVersions,
  states,
  transitions,
  actions,
} from "@/db/runtime/schema/workflow";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type SaveProcessDefinitionInput = {
  workspaceId: string;
  key: string;
  name: string;
  definition: any;
};

export const saveProcessDefinitionKernelAction: ActionDefinition<SaveProcessDefinitionInput, any> = {
  key: "processes.save_definition",
  moduleKey: "workflow",
  description: "Salva a definição de um processo de negócio (BPM).",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace dono."),
      key: stringProperty("Chave do processo."),
      name: stringProperty("Nome do processo."),
      definition: { type: "object", description: "Diagrama do processo." },
    },
    ["workspaceId", "key", "name", "definition"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [saved] = await db
      .insert(processDefinitions)
      .values({
        workspaceId: input.workspaceId,
        key: input.key,
        name: input.name,
      })
      .onConflictDoUpdate({
        target: [processDefinitions.workspaceId, processDefinitions.key],
        set: { name: input.name, updatedAt: new Date() },
      })
      .returning();

    // Upsert version and states/transitions
    const [version] = await db
      .insert(processVersions)
      .values({
        processDefinitionId: saved.id,
        version: 1,
        definition: input.definition,
        status: "published",
      })
      .onConflictDoUpdate({
        target: [processVersions.processDefinitionId, processVersions.version],
        set: { definition: input.definition, updatedAt: new Date() },
      })
      .returning();

    // Simple state/transition persistence from UI definition
    const nodes = input.definition.nodes || [];
    const edges = input.definition.edges || [];

    // Clear existing for this version (simplified)
    await db.delete(actions).where(eq(actions.processVersionId, version.id));
    await db.delete(transitions).where(eq(transitions.processVersionId, version.id));
    await db.delete(states).where(eq(states.processVersionId, version.id));

    const stateMap = new Map();

    for (const node of nodes) {
      if (node.type === "process" || node.type === "state") {
        const [state] = await db
          .insert(states)
          .values({
            processVersionId: version.id,
            key: node.id,
            name: node.data?.label || node.id,
            isInitial: nodes.indexOf(node) === 0 ? "true" : "false",
          })
          .returning();
        stateMap.set(node.id, state.id);
      }
    }

    for (const edge of edges) {
      const fromId = stateMap.get(edge.source);
      const toId = stateMap.get(edge.target);
      if (fromId && toId) {
        const [trans] = await db
          .insert(transitions)
          .values({
            processVersionId: version.id,
            fromStateId: fromId,
            toStateId: toId,
            key: edge.id,
            name: edge.label || "Transition",
          })
          .returning();

        // Create a default action for each transition
        await db.insert(actions).values({
          processVersionId: version.id,
          transitionId: trans.id,
          key: `action_${edge.id}`,
          name: edge.label || "Executar Transição",
          type: "manual",
        });
      }
    }

    return {
      success: true,
      data: saved,
    };
  },
};

export const getProcessDefinitionKernelAction: ActionDefinition<{ key: string }, any> = {
  key: "processes.get_definition",
  moduleKey: "workflow",
  description: "Recupera a definição de um processo.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema({ key: stringProperty("Chave do processo") }, ["key"]),
  async handler(input) {
    const db = getRuntimeDb();
    const [proc] = await db.select().from(processDefinitions).where(eq(processDefinitions.key, input.key)).limit(1);
    // For now we don't have a definition column in processDefinitions (only in flow), adding it would be better.
    // Let's return mock or adjust schema.
    return { success: true, data: proc };
  }
};

type SaveFlowDefinitionInput = {
  workspaceId: string;
  key: string;
  name: string;
  definition: any;
};

export const saveFlowDefinitionKernelAction: ActionDefinition<SaveFlowDefinitionInput, any> = {
  key: "flows.save_definition",
  moduleKey: "workflow",
  description: "Salva a definição de um fluxo de automação.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace dono."),
      key: stringProperty("Chave do fluxo."),
      name: stringProperty("Nome do fluxo."),
      definition: { type: "object", description: "Diagrama do fluxo." },
    },
    ["workspaceId", "key", "name", "definition"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [saved] = await db
      .insert(flowDefinitions)
      .values({
        workspaceId: input.workspaceId,
        key: input.key,
        name: input.name,
        definition: input.definition,
        status: "draft",
      })
      .onConflictDoUpdate({
        target: [flowDefinitions.workspaceId, flowDefinitions.key],
        set: {
          name: input.name,
          definition: input.definition,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      success: true,
      data: saved,
    };
  },
};

export const publishFlowKernelAction: ActionDefinition<{ workspaceId: string; key: string }, any> = {
  key: "flows.publish",
  moduleKey: "workflow",
  description: "Publica um fluxo de automação para execução.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace."),
      key: stringProperty("Chave do fluxo."),
    },
    ["workspaceId", "key"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [published] = await db
      .update(flowDefinitions)
      .set({ status: "published", updatedAt: new Date() })
      .where(
        and(
          eq(flowDefinitions.workspaceId, input.workspaceId),
          eq(flowDefinitions.key, input.key),
        ),
      )
      .returning();

    return {
      success: true,
      data: published,
    };
  },
};

export const deleteFlowKernelAction: ActionDefinition<{ workspaceId: string; key: string }, any> = {
  key: "flows.delete",
  moduleKey: "workflow",
  description: "Remove um fluxo de automação.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace."),
      key: stringProperty("Chave do fluxo."),
    },
    ["workspaceId", "key"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    await db
      .delete(flowDefinitions)
      .where(
        and(
          eq(flowDefinitions.workspaceId, input.workspaceId),
          eq(flowDefinitions.key, input.key),
        ),
      );

    return {
      success: true,
      data: { key: input.key },
    };
  },
};

export const getFlowDefinitionKernelAction: ActionDefinition<{ key: string }, any> = {
  key: "flows.get_definition",
  moduleKey: "workflow",
  description: "Recupera a definição de um fluxo.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema({ key: stringProperty("Chave do fluxo") }, ["key"]),
  async handler(input) {
    const db = getRuntimeDb();
    const [flow] = await db
      .select()
      .from(flowDefinitions)
      .where(eq(flowDefinitions.key, input.key))
      .limit(1);
    return { success: true, data: flow || null };
  },
};
