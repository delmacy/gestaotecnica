import { z } from 'zod';

export const BlueprintDependencySchema = z.object({
  packageId: z.string({
    message: "MISSING_DEPENDENCY_PACKAGE_ID"
  }).min(1, { message: "EMPTY_DEPENDENCY_PACKAGE_ID" }),
  version: z.string({
    message: "MISSING_DEPENDENCY_VERSION"
  }).min(1, { message: "EMPTY_DEPENDENCY_VERSION" })
});

export type BlueprintDependency = Readonly<z.infer<typeof BlueprintDependencySchema>>;

const SENSITIVE_KEYS = [
  "password",
  "passwd",
  "secret",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "cookie",
  "set-cookie",
  "apikey",
  "api_key",
  "privatekey",
  "clientsecret",
  "connectionstring"
];

function containsSecret(obj: unknown, stack = new Set<unknown>()): boolean {
  if (obj === null || obj === undefined) return false;

  if (stack.has(obj)) return false;
  stack.add(obj);

  if (Array.isArray(obj)) {
    const res = obj.some(item => containsSecret(item, stack));
    stack.delete(obj);
    return res;
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const lower = key.toLowerCase();
      if (SENSITIVE_KEYS.some(sensitive => lower.includes(sensitive))) {
        stack.delete(obj);
        return true;
      }
      if (containsSecret((obj as Record<string, unknown>)[key], stack)) {
        stack.delete(obj);
        return true;
      }
    }
  }

  stack.delete(obj);
  return false;
}

export const BlueprintPackageManifestSchema = z.object({
  packageId: z.string({
    message: "MISSING_PACKAGE_ID"
  }).min(1, { message: "EMPTY_PACKAGE_ID" }),
  version: z.string({
    message: "MISSING_PACKAGE_VERSION"
  }).min(1, { message: "EMPTY_PACKAGE_VERSION" }),
  dependencies: z.array(BlueprintDependencySchema).optional(),
  capabilities: z.array(z.string()).optional(),
  forms: z.array(z.string()).optional(),
  views: z.array(z.string()).optional(),
  workflows: z.array(z.string()).optional(),
  policies: z.array(z.string()).optional(),
  seedMetadata: z.record(z.string(), z.unknown()).optional()
}).superRefine((data, ctx) => {
  if (containsSecret(data)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "FORBIDDEN_SECRET_FIELD"
    });
  }
});

export type BlueprintPackageManifest = Readonly<z.infer<typeof BlueprintPackageManifestSchema>>;
