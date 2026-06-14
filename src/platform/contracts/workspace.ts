import { z } from "zod";
import { WorkspaceIdSchema } from "./identifiers";

/**
 * WorkspaceContext - represents the workspace where the action or event occurs.
 */
export const WorkspaceContextSchema = z.object({
  workspaceId: WorkspaceIdSchema,
});

export type WorkspaceContext = z.infer<typeof WorkspaceContextSchema>;
