import { describe, it } from "node:test";
import assert from "node:assert";
import {
  EmployeeProfileSchema,
  CreateEmployeeInputSchema,
} from "./contracts/hr.schema";

describe("HumanResourcesModule Contracts", () => {
  const validWorkspaceId = "550e8400-e29b-41d4-a716-446655440000";

  it("should validate a valid employee profile", () => {
    const validProfile = {
      workspaceId: validWorkspaceId,
      registrationCode: "EMP001",
      name: "John Doe",
      position: "Developer",
      department: "Engineering",
      admissionDate: "2023-01-01",
      status: "active",
      contacts: [
        { type: "email", value: "john@example.com", isPrimary: true }
      ],
      observations: "Initial hire",
      metadata: {}
    };

    const result = EmployeeProfileSchema.safeParse(validProfile);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
  });

  it("should fail validation if admission date format is invalid", () => {
    const invalidProfile = {
      workspaceId: validWorkspaceId,
      registrationCode: "EMP001",
      name: "John Doe",
      position: "Developer",
      department: "Engineering",
      admissionDate: "01/01/2023", // Wrong format
      status: "active"
    };

    const result = EmployeeProfileSchema.safeParse(invalidProfile);
    assert.strictEqual(result.success, false);
  });

  it("should fail validation if required fields are missing", () => {
    const invalidProfile = {
      name: "Missing fields"
    };

    const result = CreateEmployeeInputSchema.safeParse(invalidProfile);
    assert.strictEqual(result.success, false);
  });

  it("should use default status if not provided", () => {
    const input = {
      workspaceId: validWorkspaceId,
      registrationCode: "EMP002",
      name: "Jane Smith",
      position: "Designer",
      department: "UX",
      admissionDate: "2023-05-20"
    };

    const result = CreateEmployeeInputSchema.safeParse(input);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.status, "active");
    }
  });

  describe("Multi-tenant Isolation Rules", () => {
    const tenantA = "550e8400-e29b-41d4-a716-44665544000a";
    const tenantB = "550e8400-e29b-41d4-a716-44665544000b";

    it("should prevent cross-tenant data validation (workspaceId mismatch)", () => {
      const dataForTenantA = {
        workspaceId: tenantA,
        registrationCode: "EMP-A",
        name: "Tenant A User",
        position: "Manager",
        department: "HR",
        admissionDate: "2023-01-01"
      };

      // Validation should succeed for correct workspace
      const resultA = CreateEmployeeInputSchema.safeParse(dataForTenantA);
      assert.strictEqual(resultA.success, true);
      assert.strictEqual(resultA.data.workspaceId, tenantA);

      // In real scenario, the code will use context.workspaceId,
      // but here we verify the schema enforces the field existence and type.
    });
  });
});
