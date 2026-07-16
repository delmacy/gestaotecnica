import { z } from "zod";

export const SaveBuilderDraftOfficialInputSchema = z.object({
  workspaceId: z.string(),
  draft: z.any(), // Uses BuilderDraft in runtime
  createdBy: z.string().optional(),
}).strict();
export type SaveBuilderDraftOfficialInput = Readonly<z.infer<typeof SaveBuilderDraftOfficialInputSchema>>;

export const SaveBuilderDraftOfficialResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      processDefinitionId: z.string(),
      versionId: z.string(),
      version: z.number(),
      savedAt: z.string(),
    }).strict(),
  }).strict(),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
      issues: z.array(z.unknown()).optional(),
    }).strict(),
  }).strict(),
]);
export type SaveBuilderDraftOfficialResult = Readonly<z.infer<typeof SaveBuilderDraftOfficialResultSchema>>;

export const ListSavedProcessesInputSchema = z.object({
  workspaceId: z.string(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
}).strict();
export type ListSavedProcessesInput = Readonly<z.infer<typeof ListSavedProcessesInputSchema>>;

export const SavedProcessListItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
}).strict();
export type SavedProcessListItem = Readonly<z.infer<typeof SavedProcessListItemSchema>>;

export const ListSavedProcessesResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      items: z.array(SavedProcessListItemSchema),
    }).strict(),
  }).strict(),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }).strict(),
  }).strict(),
]);
export type ListSavedProcessesResult = Readonly<z.infer<typeof ListSavedProcessesResultSchema>>;

export const LoadSavedProcessInputSchema = z.object({
  workspaceId: z.string(),
  processDefinitionId: z.string(),
}).strict();
export type LoadSavedProcessInput = Readonly<z.infer<typeof LoadSavedProcessInputSchema>>;

export const LoadSavedProcessResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      processDefinition: z.any(),
      latestVersion: z.any().optional(),
      draft: z.any().optional(),
    }).strict(),
  }).strict(),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }).strict(),
  }).strict(),
]);
export type LoadSavedProcessResult = Readonly<z.infer<typeof LoadSavedProcessResultSchema>>;

export const PublishBuilderProcessInputSchema = z.object({
  workspaceId: z.string(),
  processDefinitionId: z.string(),
  processVersionId: z.string(),
  publishedBy: z.string().optional(),
}).strict();
export type PublishBuilderProcessInput = Readonly<z.infer<typeof PublishBuilderProcessInputSchema>>;

export const PublishBuilderProcessResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.object({
      processDefinitionId: z.string(),
      processVersionId: z.string(),
      status: z.literal("published"),
      publishedAt: z.string(),
    }).strict(),
  }).strict(),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string(),
    }).strict(),
  }).strict(),
]);
export type PublishBuilderProcessResult = Readonly<z.infer<typeof PublishBuilderProcessResultSchema>>;
