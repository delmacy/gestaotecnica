import { z } from 'zod';

export const BlueprintExportRequestSchema = z.object({
  packageId: z.string({
    message: "MISSING_PACKAGE_ID"
  }).min(1, { message: "EMPTY_PACKAGE_ID" }),
  version: z.string({
    message: "MISSING_PACKAGE_VERSION"
  }).min(1, { message: "EMPTY_PACKAGE_VERSION" }),
  requestedSections: z.array(z.string()).optional(),
  redactionOptions: z.record(z.string(), z.unknown()).optional()
});

export type BlueprintExportRequest = Readonly<z.infer<typeof BlueprintExportRequestSchema>>;
