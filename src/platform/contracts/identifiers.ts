import { z } from "zod";

/**
 * UUID Schema (v4 compatible)
 */
export const UUIDSchema = z.string().uuid();
export type UUID = z.infer<typeof UUIDSchema>;

/**
 * WorkspaceId - must be a valid UUID
 */
export const WorkspaceIdSchema = UUIDSchema;
export type WorkspaceId = z.infer<typeof WorkspaceIdSchema>;

/**
 * EntityId - generic non-empty string identifier.
 * Not every entity ID is assumed to be a UUID.
 */
export const EntityIdSchema = z.string().min(1);
export type EntityId = z.infer<typeof EntityIdSchema>;
