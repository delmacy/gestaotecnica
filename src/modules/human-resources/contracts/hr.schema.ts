import { z } from "zod";
import { SafeJsonRecordSchema } from "@/platform/contracts/safe-json";

export const EmployeeStatusSchema = z.enum([
  "active",
  "inactive",
  "suspended",
  "on_boarding",
  "off_boarding",
]);
export type EmployeeStatus = z.infer<typeof EmployeeStatusSchema>;

export const EmployeeContactSchema = z.object({
  type: z.enum(["email", "phone", "mobile", "address"]),
  value: z.string().min(1),
  isPrimary: z.boolean().default(false),
}).strict();
export type EmployeeContact = z.infer<typeof EmployeeContactSchema>;

export const EmployeeProfileSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  registrationCode: z.string().min(1), // Matrícula
  name: z.string().min(1),
  position: z.string().min(1), // Cargo
  department: z.string().min(1), // Departamento
  managerId: z.string().uuid().optional(), // Gestor (ID do usuário ou de outro employee)
  managerName: z.string().optional(), // Gestor (Nome para display rápido)
  admissionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Data de admissão (ISO date string)
  status: EmployeeStatusSchema.default("active"), // Situação
  contacts: z.array(EmployeeContactSchema).default([]), // Contatos profissionais
  observations: z.string().optional(), // Observações
  metadata: SafeJsonRecordSchema.default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();
export type EmployeeProfile = z.infer<typeof EmployeeProfileSchema>;

export const CreateEmployeeInputSchema = EmployeeProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).strict();
export type CreateEmployeeInput = z.infer<typeof CreateEmployeeInputSchema>;

export const UpdateEmployeeInputSchema = EmployeeProfileSchema.partial().extend({
  id: z.string().uuid(),
}).strict();
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeInputSchema>;

export const EmployeeHistoryEventSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  eventType: z.string(),
  payload: SafeJsonRecordSchema,
  occurredAt: z.date(),
}).strict();
export type EmployeeHistoryEvent = z.infer<typeof EmployeeHistoryEventSchema>;
