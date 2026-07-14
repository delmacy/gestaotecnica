import { z } from 'zod';

export const BlueprintImportRequestSchema = z.object({
  sourceMetadata: z.record(z.string(), z.unknown()),
  checksum: z.string().min(1, { message: "EMPTY_CHECKSUM" }),
  dryRun: z.boolean().default(true),
  targetWorkspace: z.string().min(1, { message: "EMPTY_TARGET_WORKSPACE" }),
});

export type BlueprintImportRequest = Readonly<z.infer<typeof BlueprintImportRequestSchema>>;
