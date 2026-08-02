import { z } from "zod";

export const SearchResultItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  subtitle: z.string().optional(),
  type: z.string(),
  url: z.string(),
});

export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;

export const GlobalSearchDataSchema = z.object({
  workItems: z.array(SearchResultItemSchema),
  serviceOrders: z.array(SearchResultItemSchema),
  assets: z.array(SearchResultItemSchema),
  technicians: z.array(SearchResultItemSchema),
});

export type GlobalSearchData = z.infer<typeof GlobalSearchDataSchema>;

export const GlobalSearchDTOSchema = z.discriminatedUnion("state", [
  z.object({ state: z.literal("real"), data: GlobalSearchDataSchema }),
  z.object({ state: z.literal("synthetic"), data: GlobalSearchDataSchema, label: z.string() }),
  z.object({ state: z.literal("demo"), message: z.string().optional() }),
  z.object({ state: z.literal("empty"), message: z.string().optional() }),
  z.object({ state: z.literal("blocked"), message: z.string().optional() }),
]);

export type GlobalSearchDTO = z.infer<typeof GlobalSearchDTOSchema>;
