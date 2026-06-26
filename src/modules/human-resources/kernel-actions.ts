import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  idTitleOutputSchema,
  enumProperty,
} from "@/platform/actions/schema-presets";
import type { ActionDefinition } from "@/platform/actions";
import { createEmployee, updateEmployee } from "./actions";

export const createEmployeeKernelAction: ActionDefinition<any, any> = {
  key: "hr.employee.create",
  moduleKey: "human-resources",
  description: "Cria um novo perfil de colaborador no RH",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema({
    registrationCode: stringProperty("Matrícula"),
    name: stringProperty("Nome completo"),
    position: stringProperty("Cargo"),
    department: stringProperty("Departamento"),
    admissionDate: stringProperty("Data de admissão (YYYY-MM-DD)"),
    status: enumProperty(["active", "inactive", "suspended", "on_boarding", "off_boarding"], "Situação"),
    managerId: uuidProperty("ID do Gestor"),
    managerName: stringProperty("Nome do Gestor"),
    observations: stringProperty("Observações"),
  }, ["registrationCode", "name", "position", "department", "admissionDate"]),
  outputSchema: idTitleOutputSchema,
  handler: async (input: any, context) => {
    const row = await createEmployee({
      ...input,
      workspaceId: context.workspaceId,
    });

    return {
      success: true,
      data: { id: row.id, title: row.name },
      events: [
        {
          eventType: "hr.employee.created",
          entityType: "employee",
          entityId: row.id,
          payload: {
            employeeId: row.id,
            name: row.name,
            registrationCode: input.registrationCode
          },
        }
      ]
    };
  },
};

export const updateEmployeeKernelAction: ActionDefinition<any, any> = {
  key: "hr.employee.update",
  moduleKey: "human-resources",
  description: "Atualiza um perfil de colaborador existente",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema({
    id: uuidProperty("ID do perfil"),
    registrationCode: stringProperty("Matrícula"),
    name: stringProperty("Nome completo"),
    position: stringProperty("Cargo"),
    department: stringProperty("Departamento"),
    admissionDate: stringProperty("Data de admissão (YYYY-MM-DD)"),
    status: enumProperty(["active", "inactive", "suspended", "on_boarding", "off_boarding"], "Situação"),
    managerId: uuidProperty("ID do Gestor"),
    managerName: stringProperty("Nome do Gestor"),
    observations: stringProperty("Observações"),
  }, ["id"]),
  outputSchema: idTitleOutputSchema,
  handler: async (input: any, context) => {
    const row = await updateEmployee({
      ...input,
      workspaceId: context.workspaceId,
    });

    return {
      success: true,
      data: { id: row.id, title: row.name },
      events: [
        {
          eventType: "hr.employee.updated",
          entityType: "employee",
          entityId: row.id,
          payload: {
            employeeId: row.id,
            changes: input,
          },
        }
      ]
    };
  },
};
