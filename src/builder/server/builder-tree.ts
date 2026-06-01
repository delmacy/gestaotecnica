import { asc, eq } from "drizzle-orm";
import { getPlatformDb, getRuntimeDb } from "@/db";
import { capabilities } from "@/db/platform/schema/registry";
import { organizations, workspaces, entityDefinitions } from "@/db/runtime/schema/workspace";
import { flowDefinitions, forms, processDefinitions } from "@/db/runtime/schema/workflow";
import { workspaceModuleConfigs } from "@/db/schema";
import { initializePlatformKernel } from "@/platform/kernel";
import { listActions } from "@/platform/actions";
import { ecosystemModules } from "@/platform/workspaces/module-catalog";
import type { TreeItem } from "@/builder/explorer";

type BuilderData = {
  treeData: TreeItem[];
  initialWorkspaceId: string | null;
};

type ActionSummary = {
  key: string;
  description?: string;
  moduleKey?: string;
};

type OrganizationRow = typeof organizations.$inferSelect;
type WorkspaceRow = typeof workspaces.$inferSelect;
type InstalledModuleRow = typeof workspaceModuleConfigs.$inferSelect;
type ProcessRow = typeof processDefinitions.$inferSelect;
type FlowRow = typeof flowDefinitions.$inferSelect;
type FormRow = typeof forms.$inferSelect;
type EntityRow = typeof entityDefinitions.$inferSelect;
type CapabilityRow = typeof capabilities.$inferSelect;

function actionSummariesFor(moduleKey: string, actions: ActionSummary[]) {
  return actions.filter((action) => action.moduleKey === moduleKey || action.key.startsWith(`${moduleKey}.`));
}

function emptyGroup(id: string, label: string, iconName: string): TreeItem {
  return {
    id,
    label,
    type: "group",
    iconName,
    children: [],
    metadata: { source: "empty" },
  };
}

function fallbackBuilderData(error: unknown): BuilderData {
  const message = error instanceof Error ? error.message : "Fonte de dados indisponível";
  const actions = listActions().map((action) => ({
    key: action.key,
    description: action.description,
    moduleKey: action.moduleKey,
  }));
  const catalogItems: TreeItem[] = ecosystemModules.map((module) => ({
    id: `registry-fallback-${module.key}`,
    label: module.name,
    type: "catalog_item",
    iconName: "Library",
    metadata: {
      source: "module-catalog",
      key: module.key,
      description: module.description,
      layer: module.layer,
      status: module.status,
      isActive: true,
      actions: actionSummariesFor(module.key, actions),
      unavailableReason: message,
    },
  }));

  return {
    initialWorkspaceId: null,
    treeData: [
      {
        id: "orgs",
        label: "Organizações",
        iconName: "Building2",
        type: "group" as const,
        children: [
          {
            ...emptyGroup("orgs-empty", "Nenhuma organização disponível", "Info"),
            metadata: { source: "error", message },
          },
        ],
        metadata: { source: "error", message },
      },
      {
        id: "catalog",
        label: "Capability Registry",
        iconName: "Library",
        type: "group" as const,
        children: catalogItems,
        metadata: { source: "error", message },
      },
    ],
  };
}

export async function getBuilderTreeData(): Promise<BuilderData> {
  initializePlatformKernel();

  const actions = listActions().map((action) => ({
    key: action.key,
    description: action.description,
    moduleKey: action.moduleKey,
  }));

  let organizationRows: OrganizationRow[];
  let workspaceRows: WorkspaceRow[];
  let installedModuleRows: InstalledModuleRow[];
  let processRows: ProcessRow[];
  let flowRows: FlowRow[];
  let formRows: FormRow[];
  let entityRows: EntityRow[];
  let capabilityRows: CapabilityRow[];

  try {
    const runtimeDb = getRuntimeDb();
    const platformDb = getPlatformDb();

    [
      organizationRows,
      workspaceRows,
      installedModuleRows,
      processRows,
      flowRows,
      formRows,
      entityRows,
      capabilityRows,
    ] = await Promise.all([
      runtimeDb.select().from(organizations).orderBy(asc(organizations.name)),
      runtimeDb.select().from(workspaces).orderBy(asc(workspaces.name)),
      runtimeDb.select().from(workspaceModuleConfigs).orderBy(asc(workspaceModuleConfigs.sortOrder), asc(workspaceModuleConfigs.name)),
      runtimeDb.select().from(processDefinitions).orderBy(asc(processDefinitions.name)),
      runtimeDb.select().from(flowDefinitions).orderBy(asc(flowDefinitions.name)),
      runtimeDb.select().from(forms).orderBy(asc(forms.name)),
      runtimeDb.select().from(entityDefinitions).orderBy(asc(entityDefinitions.name)),
      platformDb.select().from(capabilities).where(eq(capabilities.isActive, true)).orderBy(asc(capabilities.name)),
    ]) as [
      OrganizationRow[],
      WorkspaceRow[],
      InstalledModuleRow[],
      ProcessRow[],
      FlowRow[],
      FormRow[],
      EntityRow[],
      CapabilityRow[],
    ];
  } catch (error) {
    return fallbackBuilderData(error);
  }

  const initialWorkspaceId = workspaceRows[0]?.id ?? null;

  const workspaceChildren = (workspaceId: string): TreeItem[] => {
    const installedCapabilities: TreeItem[] = installedModuleRows
      .filter((moduleConfig) => moduleConfig.workspaceId === workspaceId && moduleConfig.isEnabled)
      .map((moduleConfig): TreeItem => ({
        id: `installed-capability-${moduleConfig.id}`,
        label: moduleConfig.name,
        type: "capability",
        iconName: "Layers",
        metadata: {
          source: "workspace_module_configs",
          workspaceId,
          key: moduleConfig.moduleKey,
          description: moduleConfig.description,
          layer: moduleConfig.layer,
          status: moduleConfig.status,
          config: moduleConfig.config,
          actions: actionSummariesFor(moduleConfig.moduleKey, actions),
          createdAt: moduleConfig.createdAt?.toISOString(),
          updatedAt: moduleConfig.updatedAt?.toISOString(),
        },
      }));

    const processes: TreeItem[] = processRows
      .filter((process) => process.workspaceId === workspaceId)
      .map((process): TreeItem => ({
        id: `process-${process.id}`,
        label: process.name,
        type: "process",
        iconName: "Workflow",
        metadata: {
          source: "workflow.process_definitions",
          workspaceId,
          key: process.key,
          description: process.description,
          blueprintKey: process.blueprintKey,
          blueprintVersion: process.blueprintVersion,
          isActive: process.isActive,
          createdAt: process.createdAt?.toISOString(),
          updatedAt: process.updatedAt?.toISOString(),
        },
      }));

    const flows: TreeItem[] = flowRows
      .filter((flow) => flow.workspaceId === workspaceId)
      .map((flow): TreeItem => ({
        id: `flow-${flow.id}`,
        label: flow.name,
        type: "flow",
        iconName: "Zap",
        metadata: {
          source: "workflow.flow_definitions",
          workspaceId,
          key: flow.key,
          description: flow.description,
          status: flow.status,
          isActive: flow.isActive,
          definition: flow.definition,
          createdAt: flow.createdAt?.toISOString(),
          updatedAt: flow.updatedAt?.toISOString(),
        },
      }));

    const views: TreeItem[] = formRows
      .filter((form) => form.workspaceId === workspaceId)
      .map((form): TreeItem => ({
        id: `view-${form.id}`,
        label: form.name,
        type: "view",
        iconName: "Layout",
        metadata: {
          source: "workflow.forms",
          workspaceId,
          key: form.key,
          description: form.description,
          createdAt: form.createdAt?.toISOString(),
        },
      }));

    const entities: TreeItem[] = entityRows
      .filter((entity) => entity.workspaceId === workspaceId)
      .map((entity): TreeItem => ({
        id: `entity-${entity.id}`,
        label: entity.name,
        type: "entity",
        iconName: "Database",
        metadata: {
          source: "workspace.entity_definitions",
          workspaceId,
          key: entity.key,
          description: entity.description,
          createdAt: entity.createdAt?.toISOString(),
          updatedAt: entity.updatedAt?.toISOString(),
        },
      }));

    return [
      { id: `caps-${workspaceId}`, label: "Capacidades Instaladas", type: "group", iconName: "Layers", children: installedCapabilities },
      { id: `procs-${workspaceId}`, label: "Processos de Negócio", type: "group", iconName: "Workflow", children: processes },
      { id: `flows-${workspaceId}`, label: "Automações (Flows)", type: "group", iconName: "Zap", children: flows },
      { id: `views-${workspaceId}`, label: "Telas e Formulários", type: "group", iconName: "Layout", children: views },
      { id: `entities-${workspaceId}`, label: "Entidades Dinâmicas", type: "group", iconName: "Database", children: entities },
    ];
  };

  const organizationChildren: TreeItem[] = organizationRows.map((organization): TreeItem => ({
    id: organization.id,
    label: organization.name,
    type: "organization",
    iconName: "Building2",
    metadata: {
      source: "workspace.organizations",
      key: organization.key,
      status: organization.status,
      raw: organization.metadata,
      createdAt: organization.createdAt?.toISOString(),
      updatedAt: organization.updatedAt?.toISOString(),
    },
    children: workspaceRows
      .filter((workspace) => workspace.organizationId === organization.id)
      .map((workspace): TreeItem => ({
        id: workspace.id,
        label: workspace.name,
        type: "workspace",
        iconName: "Globe",
        metadata: {
          source: "workspace.workspaces",
          key: workspace.key,
          status: workspace.status,
          adaptationKey: workspace.adaptationKey,
          config: workspace.config,
          organizationId: workspace.organizationId,
          createdAt: workspace.createdAt?.toISOString(),
          updatedAt: workspace.updatedAt?.toISOString(),
        },
        children: workspaceChildren(workspace.id),
      })),
  }));

  const orphanWorkspaces: TreeItem[] = workspaceRows
    .filter((workspace) => !workspace.organizationId)
    .map((workspace): TreeItem => ({
      id: workspace.id,
      label: workspace.name,
      type: "workspace",
      iconName: "Globe",
      metadata: {
        source: "workspace.workspaces",
        key: workspace.key,
        status: workspace.status,
        adaptationKey: workspace.adaptationKey,
        config: workspace.config,
        createdAt: workspace.createdAt?.toISOString(),
        updatedAt: workspace.updatedAt?.toISOString(),
      },
      children: workspaceChildren(workspace.id),
    }));

  const catalogItems: TreeItem[] = (capabilityRows.length
    ? capabilityRows.map((capability) => ({
      id: `registry-${capability.id}`,
      label: capability.name,
      key: capability.key,
      description: capability.description,
      isActive: capability.isActive,
      createdAt: capability.createdAt?.toISOString(),
      updatedAt: capability.updatedAt?.toISOString(),
    }))
    : ecosystemModules.map((module) => ({
      id: `registry-fallback-${module.key}`,
      label: module.name,
      key: module.key,
      description: module.description,
      isActive: true,
      layer: module.layer,
      status: module.status,
      createdAt: undefined,
      updatedAt: undefined,
    }))
  ).map((capability): TreeItem => ({
    id: capability.id,
    label: capability.label,
    type: "catalog_item",
    iconName: "Library",
    metadata: {
      source: capability.id.startsWith("registry-fallback-") ? "module-catalog" : "registry.capabilities",
      key: capability.key,
      description: capability.description,
      isActive: capability.isActive,
      actions: actionSummariesFor(capability.key, actions),
      layer: "layer" in capability ? capability.layer : undefined,
      status: "status" in capability ? capability.status : undefined,
      createdAt: capability.createdAt,
      updatedAt: capability.updatedAt,
    },
  }));

  const treeData: TreeItem[] = [
    {
      id: "orgs",
      label: "Organizações",
      iconName: "Building2",
      type: "group" as const,
      children: organizationChildren.length ? organizationChildren : [emptyGroup("orgs-empty", "Nenhuma organização cadastrada", "Info")],
    },
    {
      id: "workspaces-orphan",
      label: "Workspaces sem organização",
      iconName: "Globe",
      type: "group" as const,
      children: orphanWorkspaces,
    },
    {
      id: "catalog",
      label: "Capability Registry",
      iconName: "Library",
      type: "group" as const,
      children: catalogItems.length ? catalogItems : [emptyGroup("catalog-empty", "Nenhuma capability ativa no registry", "Info")],
    },
  ].filter((item) => item.id !== "workspaces-orphan" || item.children?.length);

  return {
    initialWorkspaceId,
    treeData,
  };
}
