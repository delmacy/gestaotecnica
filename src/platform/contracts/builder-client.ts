import { z } from "zod";

export const SaveBuilderDraftInputSchema = z.object({
  workspaceId: z.string(),
  draft: z.unknown(),
  createdBy: z.string().optional()
});
export type SaveBuilderDraftInputContract = Readonly<z.infer<typeof SaveBuilderDraftInputSchema>>;

export const SaveBuilderDraftResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      processDefinitionId: z.string(),
      versionId: z.string(),
      version: z.number(),
      savedAt: z.string()
    })
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
      issues: z.array(z.unknown()).optional()
    })
  })
]);
export type SaveBuilderDraftResultContract = Readonly<z.infer<typeof SaveBuilderDraftResultSchema>>;

export const ListSavedProcessesInputSchema = z.object({
  workspaceId: z.string(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  limit: z.number().optional(),
  offset: z.number().optional()
});
export type ListSavedProcessesInputContract = Readonly<z.infer<typeof ListSavedProcessesInputSchema>>;

export const SavedProcessListItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional()
});
export type SavedProcessListItemContract = Readonly<z.infer<typeof SavedProcessListItemSchema>>;

export const ListSavedProcessesResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      items: z.array(SavedProcessListItemSchema)
    })
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string()
    })
  })
]);
export type ListSavedProcessesResultContract = Readonly<z.infer<typeof ListSavedProcessesResultSchema>>;

export const LoadSavedProcessInputSchema = z.object({
  workspaceId: z.string(),
  processDefinitionId: z.string()
});
export type LoadSavedProcessInputContract = Readonly<z.infer<typeof LoadSavedProcessInputSchema>>;

export const LoadSavedProcessResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      processDefinition: z.unknown(),
      latestVersion: z.unknown().optional(),
      draft: z.unknown().optional()
    })
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string()
    })
  })
]);
export type LoadSavedProcessResultContract = Readonly<z.infer<typeof LoadSavedProcessResultSchema>>;

export const PublishBuilderProcessInputSchema = z.object({
  workspaceId: z.string(),
  processDefinitionId: z.string(),
  processVersionId: z.string(),
  publishedBy: z.string().optional()
});
export type PublishBuilderProcessInputContract = Readonly<z.infer<typeof PublishBuilderProcessInputSchema>>;

export const PublishBuilderProcessResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      processDefinitionId: z.string(),
      processVersionId: z.string(),
      status: z.literal("published"),
      publishedAt: z.string()
    })
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string()
    })
  })
]);
export type PublishBuilderProcessResultContract = Readonly<z.infer<typeof PublishBuilderProcessResultSchema>>;
