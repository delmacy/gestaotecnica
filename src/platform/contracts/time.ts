import { z } from "zod";

/**
 * ISODateTime - valid ISO 8601 datetime string.
 */
export const ISODateTimeSchema = z.string().datetime();
export type ISODateTime = z.infer<typeof ISODateTimeSchema>;
