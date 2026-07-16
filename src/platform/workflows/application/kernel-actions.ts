import { instantiateFromPublication } from "../infra/flow-runner-service";
import { PublicationResultEnvelope } from "../contracts";
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
  definition: {
    nodes?: any[];
    edges?: any[];
  } | unknown;
};

export const saveProcessDefinitionKernelAction: ActionDefinition<SaveProcessDefinitionInput, unknown> = {
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
    const nodes = (input.definition as { nodes?: any[] })?.nodes || [];
    const edges = (input.definition as { edges?: any[] })?.edges || [];

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


    const publication: PublicationResultEnvelope = {
      ok: true,
      data: {
        processDefinitionId: saved.id,
        processVersionId: version.id,
        status: "published",
        publishedAt: new Date().toISOString(),
      },
    };

    const instantiationResult = instantiateFromPublication(publication, input.workspaceId, (input as unknown as { actorId?: string }).actorId);

    return {
      success: true,
      data: {
        ...saved,
        instance: instantiationResult.instance,
        timeline: instantiationResult.timeline,
      },
    };
  },
};


export const getProcessDefinitionKernelAction: ActionDefinition<{ key: string }, unknown> = {
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
  definition: unknown;
};

export const saveFlowDefinitionKernelAction: ActionDefinition<SaveFlowDefinitionInput, unknown> = {
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

export const publishFlowKernelAction: ActionDefinition<{ workspaceId: string; key: string }, unknown> = {
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

export const deleteFlowKernelAction: ActionDefinition<{ workspaceId: string; key: string }, unknown> = {
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

type GetFlowDefinitionInput = {
  key: string;
  workspaceId?: string;
};

export const getFlowDefinitionKernelAction: ActionDefinition<GetFlowDefinitionInput, unknown> = {
  key: "flows.get_definition",
  moduleKey: "workflow",
  description: "Recupera a definição de um fluxo.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema({
    key: stringProperty("Chave do fluxo"),
    workspaceId: uuidProperty("Workspace dono."),
  }, ["key"]),
  async handler(input) {
    const db = getRuntimeDb();
    const [flow] = await db
      .select()
      .from(flowDefinitions)
      .where(
        input.workspaceId
          ? and(eq(flowDefinitions.workspaceId, input.workspaceId), eq(flowDefinitions.key, input.key))
          : eq(flowDefinitions.key, input.key),
      )
      .limit(1);
    return { success: true, data: flow || null };
  },
};
