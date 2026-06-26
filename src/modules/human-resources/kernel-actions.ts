import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  idTitleOutputSchema,
  enumProperty,
  objectProperty
} from "@/platform/actions/schema-presets";
import type { KernelAction } from "@/platform/actions/action-types";
import { createEmployee, updateEmployee } from "./actions";

export const createEmployeeKernelAction: KernelAction = {
  key: "hr.employee.create",
  name: "Criar Colaborador",
  description: "Cria um novo perfil de colaborador no RH",
  inputSchema: actionObjectSchema({
    registrationCode: stringProperty("Matrícula"),
    name: stringProperty("Nome completo"),
    position: stringProperty("Cargo"),
    department: stringProperty("Departamento"),
    admissionDate: stringProperty("Data de admissão (YYYY-MM-DD)"),
    status: enumProperty(["active", "inactive", "suspended", "on_boarding", "off_boarding"], "Situação"),
    managerId: uuidProperty("ID do Gestor"),
    observations: stringProperty("Observações"),
  }, ["registrationCode", "name", "position", "department", "admissionDate"]),
  outputSchema: idTitleOutputSchema,
  handler: async (input: any) => {
    const row = await createEmployee(input);
    return { id: row.id, title: row.name };
  },
};

export const updateEmployeeKernelAction: KernelAction = {
  key: "hr.employee.update",
  name: "Atualizar Colaborador",
  description: "Atualiza um perfil de colaborador existente",
  inputSchema: actionObjectSchema({
    id: uuidProperty("ID do perfil"),
    registrationCode: stringProperty("Matrícula"),
    name: stringProperty("Nome completo"),
    position: stringProperty("Cargo"),
    department: stringProperty("Departamento"),
    admissionDate: stringProperty("Data de admissão (YYYY-MM-DD)"),
    status: enumProperty(["active", "inactive", "suspended", "on_boarding", "off_boarding"], "Situação"),
    managerId: uuidProperty("ID do Gestor"),
    observations: stringProperty("Observações"),
  }, ["id"]),
  outputSchema: idTitleOutputSchema,
  handler: async (input: any) => {
    const row = await updateEmployee(input);
    return { id: row.id, title: row.name };
  },
};
