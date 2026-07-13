import { z } from 'zod';

export const BlueprintPackageManifestSchema = z.object({
  packageId: z.string({
    message: "MISSING_PACKAGE_ID"
  }).min(1, { message: "EMPTY_PACKAGE_ID" }),
  version: z.string({
    message: "MISSING_PACKAGE_VERSION"
  }).min(1, { message: "EMPTY_PACKAGE_VERSION" }),
  capabilities: z.array(z.string()).optional(),
  forms: z.array(z.string()).optional(),
  views: z.array(z.string()).optional(),
  workflows: z.array(z.string()).optional(),
  policies: z.array(z.string()).optional(),
  seedMetadata: z.record(z.string(), z.unknown()).optional()
});

export type BlueprintPackageManifest = Readonly<z.infer<typeof BlueprintPackageManifestSchema>>;
