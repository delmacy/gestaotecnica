import { z } from "zod";

/**
 * Process Definition Key
 * Rules:
 * - 3 to 100 characters
 * - Starts with lowercase letter
 * - Only a-z, 0-9 and hyphen
 * - No trailing hyphen
 * - No consecutive hyphens
 */
export const ProcessDefinitionKeySchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/);

export type ProcessDefinitionKey = z.infer<typeof ProcessDefinitionKeySchema>;
