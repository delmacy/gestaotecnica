import { z } from "zod";

/**
 * Workflow Definition Version
 * Represents a stable version identifier (major.minor.patch)
 */
export const WorkflowDefinitionVersionSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export type WorkflowDefinitionVersion = z.infer<typeof WorkflowDefinitionVersionSchema>;
