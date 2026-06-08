import { asc, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  authAccounts,
  businessRoleDefinitions,
  permissionDefinitions,
  rolePermissionGrants,
  userRoleAssignments,
  users,
  workflowTemplates,
  workspaceModuleConfigs,
} from "@/db/schema";
import { organizations, workspaces } from "@/db/runtime/schema/workspace";
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

type OrganizationRow = typeof organizations.$inferSelect;
type WorkspaceRow = typeof workspaces.$inferSelect;

export type OrganizationOverview = OrganizationRow & {
  workspaceCount: number;
  activeWorkspaceCount: number;
};

export type OrganizationWorkspacePanel = {
  organization: OrganizationRow;
  workspaces: WorkspaceRow[];
};

export async function getAdminSummary() {
  const db = getDb();
  const workspace = await ensureActiveWorkspaceConfig();
  const [usersRow] = await db.select({ value: count() }).from(users);
  const [modulesRow] = await db
    .select({ value: count() })
    .from(workspaceModuleConfigs)
    .where(eq(workspaceModuleConfigs.workspaceId, workspace.id));
  const [rolesRow] = await db
    .select({ value: count() })
    .from(businessRoleDefinitions)
    .where(eq(businessRoleDefinitions.workspaceId, workspace.id));
  const [workflowsRow] = await db
    .select({ value: count() })
    .from(workflowTemplates)
    .where(eq(workflowTemplates.workspaceId, workspace.id));

  return [
    { label: "Usuarios", value: usersRow.value },
    { label: "Modulos", value: modulesRow.value },
    { label: "Papeis", value: rolesRow.value },
    { label: "Workflows", value: workflowsRow.value },
  ];
}

export async function getAdminUsers() {
  const db = getDb();

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      hasAuth: authAccounts.id,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(authAccounts, eq(authAccounts.userId, users.id))
    .orderBy(desc(users.createdAt))
    .limit(100);
}

export async function getOrganizationsOverview(): Promise<OrganizationOverview[]> {
  const db = getDb();

  const [organizationRows, workspaceRows] = await Promise.all([
    db.select().from(organizations).orderBy(asc(organizations.name)),
    db
      .select({
        id: workspaces.id,
        organizationId: workspaces.organizationId,
        status: workspaces.status,
      })
      .from(workspaces),
  ]) as [OrganizationRow[], Array<Pick<WorkspaceRow, "id" | "organizationId" | "status">>];

  return organizationRows.map((organization: OrganizationRow) => {
    const ownedWorkspaces = workspaceRows.filter((workspace) => workspace.organizationId === organization.id);

    return {
      ...organization,
      workspaceCount: ownedWorkspaces.length,
      activeWorkspaceCount: ownedWorkspaces.filter((workspace) => workspace.status === "active").length,
    };
  });
}

export async function getOrganizationWorkspacePanel(organizationId: string): Promise<OrganizationWorkspacePanel | null> {
  const db = getDb();

  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  if (!organization) return null;

  const workspaceRows = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.organizationId, organizationId))
    .orderBy(asc(workspaces.name));

  return {
    organization,
    workspaces: workspaceRows,
  };
}

export async function getWorkspaceAdminData() {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();
  const modules = await db
    .select()
    .from(workspaceModuleConfigs)
    .where(eq(workspaceModuleConfigs.workspaceId, workspace.id))
    .orderBy(asc(workspaceModuleConfigs.sortOrder), asc(workspaceModuleConfigs.name));

  return { modules, workspace };
}

export async function getWorkflowAdminData() {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  return db
    .select()
    .from(workflowTemplates)
    .where(eq(workflowTemplates.workspaceId, workspace.id))
    .orderBy(asc(workflowTemplates.sortOrder), asc(workflowTemplates.label));
}

export async function getPermissionMatrix() {
  const workspace = await ensureActiveWorkspaceConfig();
  const db = getDb();

  const [roles, permissions, grants] = await Promise.all([
    db
      .select()
      .from(businessRoleDefinitions)
      .where(eq(businessRoleDefinitions.workspaceId, workspace.id))
      .orderBy(asc(businessRoleDefinitions.sortOrder), asc(businessRoleDefinitions.label)),
    db
      .select()
      .from(permissionDefinitions)
      .orderBy(asc(permissionDefinitions.moduleKey), asc(permissionDefinitions.action)),
    db.select().from(rolePermissionGrants),
  ]);

  return { roles, permissions, grants };
}

export async function getUserRoleAssignments() {
  const db = getDb();

  return db
    .select({
      id: userRoleAssignments.id,
      userId: userRoleAssignments.userId,
      roleId: userRoleAssignments.roleId,
      workspaceId: userRoleAssignments.workspaceId,
      assignedAt: userRoleAssignments.assignedAt,
      revokedAt: userRoleAssignments.revokedAt,
    })
    .from(userRoleAssignments)
    .orderBy(desc(userRoleAssignments.assignedAt));
}
