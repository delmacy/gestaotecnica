import { eq, and } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import {
  organizations,
  workspaces,
  entityDefinitions,
  fieldDefinitions,
  dynamicRecords,
} from "@/db/runtime/schema/workspace";
import { workspaceModuleConfigs } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  booleanProperty,
} from "@/platform/actions/schema-presets";

type CreateOrganizationInput = {
  key: string;
  name: string;
};

export const createOrganizationKernelAction: ActionDefinition<CreateOrganizationInput, { id: string; key: string }> = {
  key: "organizations.create",
  moduleKey: "workspace",
  description: "Cria um novo tenant organizacional.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      key: stringProperty("Chave única da organização."),
      name: stringProperty("Nome amigável da organização."),
    },
    ["key", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [org] = await db
      .insert(organizations)
      .values({
        key: input.key,
        name: input.name,
      })
      .returning({
        id: organizations.id,
        key: organizations.key,
      });

    return {
      success: true,
      data: org,
    };
  },
};

type CreateWorkspaceInput = {
  organizationId: string;
  key: string;
  name: string;
};

export const createWorkspaceKernelAction: ActionDefinition<CreateWorkspaceInput, { id: string; key: string }> = {
  key: "workspaces.create",
  moduleKey: "workspace",
  description: "Cria um novo ambiente operacional (workspace) dentro de uma organização.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      organizationId: uuidProperty("ID da organização pai."),
      key: stringProperty("Chave única do workspace."),
      name: stringProperty("Nome do ambiente."),
    },
    ["organizationId", "key", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [workspace] = await db
      .insert(workspaces)
      .values({
        organizationId: input.organizationId,
        key: input.key,
        name: input.name,
        adaptationKey: "secao-tecnica", // Default
      })
      .returning({
        id: workspaces.id,
        key: workspaces.key,
      });

    return {
      success: true,
      data: workspace,
    };
  },
};

type InstallCapabilityInput = {
  workspaceId: string;
  capabilityKey: string;
  name: string;
};

export const installCapabilityKernelAction: ActionDefinition<InstallCapabilityInput, any> = {
  key: "workspaces.install_capability",
  moduleKey: "workspace",
  description: "Instala uma capacidade do Registry em um workspace específico.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace destino."),
      capabilityKey: stringProperty("Chave da capacidade no Registry."),
      name: stringProperty("Nome da capacidade."),
    },
    ["workspaceId", "capabilityKey", "name"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [installed] = await db
      .insert(workspaceModuleConfigs)
      .values({
        workspaceId: input.workspaceId,
        moduleKey: input.capabilityKey,
        name: input.name,
        isEnabled: true,
      })
      .onConflictDoUpdate({
        target: [workspaceModuleConfigs.workspaceId, workspaceModuleConfigs.moduleKey],
        set: { isEnabled: true, updatedAt: new Date() }
      })
      .returning();

    return {
      success: true,
      data: installed,
    };
  },
};

type PublishWorkspaceInput = {
  workspaceId: string;
};

export const publishWorkspaceKernelAction: ActionDefinition<PublishWorkspaceInput, any> = {
  key: "workspaces.publish",
  moduleKey: "workspace",
  description: "Publica e finaliza a configuração de um workspace para uso em produção.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
       workspaceId: uuidProperty("ID do workspace.")
    },
    ["workspaceId"]
  ),
  async handler(input) {
    const db = getRuntimeDb();
    const [updated] = await db
      .update(workspaces)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(workspaces.id, input.workspaceId))
      .returning();

    return {
      success: true,
      data: updated,
    };
  },
};

type CreateEntityInput = {
  workspaceId: string;
  key: string;
  name: string;
  fields: Array<{ key: string; name: string; type: string }>;
};

export const createEntityKernelAction: ActionDefinition<CreateEntityInput, any> = {
  key: "entities.create",
  moduleKey: "workspace",
  description: "Define uma nova entidade de dados dinâmica no workspace.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace."),
      key: stringProperty("Chave da entidade."),
      name: stringProperty("Nome da entidade."),
      fields: { type: "array", description: "Campos da entidade." },
    },
    ["workspaceId", "key", "name", "fields"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [entity] = await db
      .insert(entityDefinitions)
      .values({
        workspaceId: input.workspaceId,
        key: input.key,
        name: input.name,
      })
      .returning();

    for (const field of input.fields) {
      await db.insert(fieldDefinitions).values({
        entityId: entity.id,
        key: field.key,
        name: field.name,
        type: field.type,
      });
    }

    return {
      success: true,
      data: entity,
    };
  },
};

type SaveRecordInput = {
  workspaceId: string;
  entityKey: string;
  data: any;
};

export const saveDynamicRecordKernelAction: ActionDefinition<SaveRecordInput, any> = {
  key: "records.save",
  moduleKey: "workspace",
  description: "Salva um registro de uma entidade dinâmica.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      workspaceId: uuidProperty("Workspace."),
      entityKey: stringProperty("Chave da entidade."),
      data: { type: "object", description: "Dados do registro." },
    },
    ["workspaceId", "entityKey", "data"],
  ),
  async handler(input) {
    const db = getRuntimeDb();

    const [record] = await db
      .insert(dynamicRecords)
      .values({
        workspaceId: input.workspaceId,
        entityKey: input.entityKey,
        data: input.data,
      })
      .returning();

    return {
      success: true,
      data: record,
    };
  },
};
