import { z } from 'zod';

export const WorkspaceSwitchingRequestSchema = z.object({
  currentWorkspaceId: z.string().min(1),
  targetWorkspaceId: z.string().min(1),
  organizationId: z.string().min(1),
  userId: z.string().min(1),
});

export type WorkspaceSwitchingRequest = z.infer<typeof WorkspaceSwitchingRequestSchema>;

export const WorkspaceSwitchingResponseSchema = z.object({
  status: z.enum(['success', 'forbidden', 'not-found']),
  redirectUrl: z.string().optional(),
  message: z.string().optional(),
});

export type WorkspaceSwitchingResponse = z.infer<typeof WorkspaceSwitchingResponseSchema>;

export const WorkspaceListRequestSchema = z.object({
  organizationId: z.string().min(1),
  userId: z.string().min(1),
});

export type WorkspaceListRequest = z.infer<typeof WorkspaceListRequestSchema>;

export const WorkspaceInfoSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(['workspace_member', 'workspace_admin', 'platform_admin']),
  isDemo: z.boolean().default(false),
  isSynthetic: z.boolean().default(false),
});

export type WorkspaceInfo = z.infer<typeof WorkspaceInfoSchema>;

export const WorkspaceListResponseSchema = z.object({
  workspaces: z.array(WorkspaceInfoSchema),
});

export type WorkspaceListResponse = z.infer<typeof WorkspaceListResponseSchema>;
