import { z } from "zod";

export const LayoutGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  fieldReferences: z.array(z.string()),
  columns: z.number().min(1).max(12).optional(),
});

export type LayoutGroup = z.infer<typeof LayoutGroupSchema>;

export const LayoutSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  groups: z.array(LayoutGroupSchema),
});

export type LayoutSection = z.infer<typeof LayoutSectionSchema>;

export const FormLayoutSchema = z.object({
  sections: z.array(LayoutSectionSchema),
});

export type FormLayout = z.infer<typeof FormLayoutSchema>;
