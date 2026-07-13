import { z } from 'zod';

export const BlueprintPackageManifestSchema = z.object({
  packageId: z.string().min(1),
  version: z.string().min(1),
  capabilities: z.array(z.string()).optional(),
  forms: z.array(z.string()).optional(),
  views: z.array(z.string()).optional(),
  workflows: z.array(z.string()).optional(),
  policies: z.array(z.string()).optional(),
  seedMetadata: z.record(z.string(), z.unknown()).optional()
});

export type BlueprintPackageManifest = Readonly<z.infer<typeof BlueprintPackageManifestSchema>>;
