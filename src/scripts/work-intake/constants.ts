export const WORK_INTAKE_SEED = {
  organization: {
    key: "org_work_intake",
    name: "Work Intake Organization",
  },
  workspace: {
    key: "ws_work_intake",
    name: "Work Intake Workspace",
  },
  user: {
    email: "operator@workintake.local",
    name: "Intake Operator",
  },
  module: {
    key: "mod_work_intake",
    name: "Work Intake Module",
  },
  capabilities: [
    {
      key: "cap_work_intake_view",
      name: "View Work Intake",
      description: "Allow viewing work intakes",
    },
    {
      key: "cap_work_intake_manage",
      name: "Manage Work Intake",
      description: "Allow managing work intakes",
    }
  ],
  candidate: {
    name: "Equipamento de TI Falho - Intake Seed",
    description: "Solicitação para conserto de equipamento de TI com defeito.",
  }
};
