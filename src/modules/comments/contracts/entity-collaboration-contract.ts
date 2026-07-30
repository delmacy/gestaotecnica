import { z } from "zod";

export const EntityCommentSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1),
  createdAt: z.date(),
  authorName: z.string().nullable(),
});

export type EntityComment = z.infer<typeof EntityCommentSchema>;

export const CreateEntityCommentInputSchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  body: z.string().min(1),
  returnTo: z.string().optional(),
});

export type CreateEntityCommentInput = z.infer<typeof CreateEntityCommentInputSchema>;

export const EntityAttachmentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  fileUrl: z.string().url(),
  mimeType: z.string().nullable(),
  createdAt: z.date(),
  authorName: z.string().nullable(),
});

export type EntityAttachment = z.infer<typeof EntityAttachmentSchema>;

export const CreateEntityAttachmentInputSchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  title: z.string().min(1),
  fileUrl: z.string().url(),
  mimeType: z.string().optional().nullable(),
  returnTo: z.string().optional(),
});

export type CreateEntityAttachmentInput = z.infer<typeof CreateEntityAttachmentInputSchema>;
