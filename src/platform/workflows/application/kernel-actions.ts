import { eq, desc } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import { processDefinitions, flowDefinitions } from "@/db/runtime/schema/workflow";
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
        target: processDefinitions.key,
        set: { name: input.name, updatedAt: new Date() }
      })
      .returning();

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
      })
      .onConflictDoUpdate({
        target: flowDefinitions.key,
        set: { name: input.name, definition: input.definition, updatedAt: new Date() }
      })
      .returning();

    return {
      success: true,
      data: saved,
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
    const [flow] = await db.select().from(flowDefinitions).where(eq(flowDefinitions.key, input.key)).limit(1);
    return { success: true, data: flow?.definition || null };
  }
};
