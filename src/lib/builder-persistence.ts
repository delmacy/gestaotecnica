import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  organizations,
  workspaces,
  workspaceMembers,
} from "@/db/runtime/schema/workspace";
import { users as legacyUsers } from "@/db/legacy/schema";
import { builderWorkspaceSelections } from "@/db/runtime/schema/builder";

export type BuilderIdentity = {
  userId: string;
  name: string;
  email: string;
  accessProfile: "builder" | "admin" | "operador";
};

export type PortfolioWorkspace = {
  id: string;
  key: string;
  name: string;
  adaptationKey: string | null;
  organizationId: string;
  organizationName: string;
  organizationKey: string;
  role: "workspace_member" | "workspace_admin" | "platform_admin";
  isSelected: boolean;
};

export type OrganizationPortfolio = {
  id: string;
  key: string;
  name: string;
  workspaces: PortfolioWorkspace[];
};

export type BuilderPortfolio = {
  identity: BuilderIdentity;
  selectedWorkspaceId: string | null;
  organizations: OrganizationPortfolio[];
};

export type WorkspaceSelectionRecord = {
  id: string;
  userId: string;
  workspaceId: string;
  organizationId: string | null;
  selectedAt: Date;
};

export type PersistSelectionResult =
  | { ok: true; selection: WorkspaceSelectionRecord }
  | { ok: false; reason: "not_a_member" | "workspace_not_found" };

/**
 * The `userId` parameter MUST be resolved server-side from the authenticated
 * session by the domain/contract layer (never a client-supplied value). This
 * module only enforces membership: a selection is persisted only when the
 * authenticated user is a member of the target workspace.
 */

export async function resolveBuilderIdentity(
  userId: string,
): Promise<BuilderIdentity | null> {
  const db = getDb();

  const [row] = await db
    .select({
      id: legacyUsers.id,
      name: legacyUsers.name,
      email: legacyUsers.email,
      accessProfile: legacyUsers.accessProfile,
    })
    .from(legacyUsers)
    .where(eq(legacyUsers.id, userId))
    .limit(1);

  if (!row) return null;

  return {
    userId: row.id,
    name: row.name,
    email: row.email,
    accessProfile: row.accessProfile,
  };
}

export async function resolveWorkspacePortfolio(
  userId: string,
): Promise<OrganizationPortfolio[]> {
  const db = getDb();

  const rows = await db
    .select({
      workspaceId: workspaces.id,
      workspaceKey: workspaces.key,
      workspaceName: workspaces.name,
      adaptationKey: workspaces.adaptationKey,
      organizationId: organizations.id,
      organizationKey: organizations.key,
      organizationName: organizations.name,
    })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .innerJoin(organizations, eq(workspaces.organizationId, organizations.id))
    .where(eq(workspaceMembers.userId, userId));

  const selected = await resolveSelectedWorkspace(userId);
  const selectedWorkspaceId = selected?.workspaceId ?? null;

  const orgMap = new Map<string, OrganizationPortfolio>();

  for (const row of rows) {
    const orgEntry = orgMap.get(row.organizationId) ?? {
      id: row.organizationId,
      key: row.organizationKey,
      name: row.organizationName,
      workspaces: [] as PortfolioWorkspace[],
    };

    orgEntry.workspaces.push({
      id: row.workspaceId,
      key: row.workspaceKey,
      name: row.workspaceName,
      adaptationKey: row.adaptationKey,
      organizationId: row.organizationId,
      organizationName: row.organizationName,
      organizationKey: row.organizationKey,
      role: "workspace_member",
      isSelected: row.workspaceId === selectedWorkspaceId,
    });

    orgMap.set(row.organizationId, orgEntry);
  }

  return Array.from(orgMap.values());
}

export async function resolveSelectedWorkspace(
  userId: string,
): Promise<WorkspaceSelectionRecord | null> {
  const db = getDb();

  const [row] = await db
    .select({
      id: builderWorkspaceSelections.id,
      userId: builderWorkspaceSelections.userId,
      workspaceId: builderWorkspaceSelections.workspaceId,
      organizationId: builderWorkspaceSelections.organizationId,
      selectedAt: builderWorkspaceSelections.selectedAt,
    })
    .from(builderWorkspaceSelections)
    .where(eq(builderWorkspaceSelections.userId, userId))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    userId: row.userId,
    workspaceId: row.workspaceId,
    organizationId: row.organizationId,
    selectedAt: row.selectedAt,
  };
}

export async function resolveBuilderPortfolio(
  userId: string,
): Promise<BuilderPortfolio | null> {
  const identity = await resolveBuilderIdentity(userId);

  if (!identity) return null;

  const organizationsList = await resolveWorkspacePortfolio(userId);

  const selectedWorkspaceId =
    organizationsList
      .flatMap((org) => org.workspaces)
      .find((ws) => ws.isSelected)?.id ?? null;

  return {
    identity,
    selectedWorkspaceId,
    organizations: organizationsList,
  };
}

export async function persistWorkspaceSelection(
  userId: string,
  workspaceId: string,
): Promise<PersistSelectionResult> {
  const db = getDb();

  const [workspace] = await db
    .select({
      id: workspaces.id,
      organizationId: workspaces.organizationId,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (!workspace) {
    return { ok: false, reason: "workspace_not_found" };
  }

  const [membership] = await db
    .select({ id: workspaceMembers.id })
    .from(workspaceMembers)
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.workspaceId, workspaceId),
      ),
    )
    .limit(1);

  if (!membership) {
    return { ok: false, reason: "not_a_member" };
  }

  const [selection] = await db
    .insert(builderWorkspaceSelections)
    .values({
      userId,
      workspaceId,
      organizationId: workspace.organizationId,
    })
    .onConflictDoUpdate({
      target: builderWorkspaceSelections.userId,
      set: {
        workspaceId,
        organizationId: workspace.organizationId,
        selectedAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning({
      id: builderWorkspaceSelections.id,
      userId: builderWorkspaceSelections.userId,
      workspaceId: builderWorkspaceSelections.workspaceId,
      organizationId: builderWorkspaceSelections.organizationId,
      selectedAt: builderWorkspaceSelections.selectedAt,
    });

  return { ok: true, selection: selection };
}
