import { z } from "zod";

/**
 * UnknownRecord - safe alternative to Record<string, any>.
 */
export const UnknownRecordSchema = z.record(z.string(), z.unknown());
export type UnknownRecord = z.infer<typeof UnknownRecordSchema>;

/**
 * SchemaVersion - semver-like version string (major.minor.patch).
 */
export const SchemaVersionSchema = z.string().regex(/^\d+\.\d+\.\d+$/);
export type SchemaVersion = z.infer<typeof SchemaVersionSchema>;
