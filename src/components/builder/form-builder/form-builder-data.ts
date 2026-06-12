import { FormBuilderStaticData } from "./form-builder-types";

export const MOCK_FORM_BUILDER_DATA: FormBuilderStaticData = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  blueprints: [
    {
      id: "bp-tech-service-1",
      name: "Technical Service Intake Form",
      slug: "tech-service-intake",
      description: "Formulário inicial para abertura de chamados técnicos de equipamentos.",
      process_area: "Service Desk",
      data_source_mode: "synthetic",
      readiness_status: "ready_for_demo",
      synthetic: true,
      notes: "synthetic demo, not runtime form, not persisted, real sources pending",
      related_capabilities: ["work_orders", "requests"],
      related_process_steps: ["Triage", "Dispatch"],
      related_docs: ["docs/ui/surfaces/FORM_BUILDER.md"],
      bindings: [
        { capability: "work_orders", entity: "WorkOrder", field: "root_cause" },
        { capability: "requests", entity: "ServiceRequest", field: "customer_id" }
      ],
      governance_warnings: [
        { field_key: "customer_phone", warning_type: "pii_risk", message: "Coleta de telefone requer consentimento explícito LGPD." },
        { field_key: "asset_location", warning_type: "compliance_risk", message: "Coordenadas GPS atreladas ao usuário final necessitam aviso de tracking." }
      ],
      sections: [
        { id: "sec-1", title: "Customer Information", description: "Dados de contato básicos", order: 1 },
        { id: "sec-2", title: "Asset Details", description: "Informações sobre o equipamento", order: 2 },
        { id: "sec-3", title: "Issue Description", description: "Detalhes do problema", order: 3 }
      ],
      fields: [
        {
          id: "fld-1", section_id: "sec-1", label: "Customer Name", key: "customer_name", field_type: "text",
          required: true, placeholder: "John Doe", help_text: "Nome completo do solicitante",
          validation_rules: [{ type: "min_length", value: 3, message: "Nome muito curto" }],
          layout: { gridSpan: 1 }, binding: { capability: "people", entity: "Person", field: "full_name" },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-2", section_id: "sec-1", label: "Contact Phone", key: "customer_phone", field_type: "text",
          required: false, placeholder: "+55 11 99999-9999", help_text: "Apenas números",
          validation_rules: [{ type: "regex_placeholder", value: "^[0-9]+$", message: "Apenas números permitidos" }],
          layout: { gridSpan: 1 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-3", section_id: "sec-2", label: "Asset Tag", key: "asset_tag", field_type: "text",
          required: true, placeholder: "EQP-2023-001", help_text: "Etiqueta patrimonial",
          validation_rules: [],
          layout: { gridSpan: 1 }, binding: { capability: "assets", entity: "Equipment", field: "tag" },
          data_source_mode: "real_pending", readiness_status: "needs_real_sources", synthetic: true, notes: "Falta padrão real"
        },
        {
          id: "fld-4", section_id: "sec-2", label: "Device Type", key: "device_type", field_type: "select",
          required: true, placeholder: "Selecione...", help_text: "Categoria do dispositivo",
          options: [{ label: "Laptop", value: "laptop" }, { label: "Desktop", value: "desktop" }, { label: "Printer", value: "printer" }],
          validation_rules: [],
          layout: { gridSpan: 1 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-5", section_id: "sec-2", label: "Purchase Date", key: "purchase_date", field_type: "date",
          required: false, placeholder: "", help_text: "Data de compra original",
          validation_rules: [{ type: "custom_future_rule", message: "Não pode ser no futuro" }],
          layout: { gridSpan: 1 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-6", section_id: "sec-3", label: "Issue Category", key: "issue_category", field_type: "select",
          required: true, placeholder: "Selecione...", help_text: "Qual a natureza principal?",
          options: [{ label: "Hardware", value: "hw" }, { label: "Software", value: "sw" }, { label: "Network", value: "net" }],
          validation_rules: [],
          layout: { gridSpan: 1 }, binding: { capability: "requests", entity: "Ticket", field: "category" },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-7", section_id: "sec-3", label: "Description", key: "description", field_type: "textarea",
          required: true, placeholder: "Descreva em detalhes o que está acontecendo...", help_text: "Seja específico",
          validation_rules: [{ type: "min_length", value: 20, message: "A descrição precisa ter pelo menos 20 caracteres" }],
          layout: { gridSpan: 2 }, binding: { capability: "requests", entity: "Ticket", field: "description" },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-8", section_id: "sec-3", label: "Urgency", key: "urgency", field_type: "radio",
          required: true, placeholder: "", help_text: "",
          options: [{ label: "Low", value: "low" }, { label: "Medium", value: "med" }, { label: "High", value: "high" }],
          validation_rules: [],
          layout: { gridSpan: 1 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-9", section_id: "sec-3", label: "Attach Photo", key: "photo_proof", field_type: "photo_placeholder",
          required: false, placeholder: "", help_text: "Anexe uma foto do defeito se possível",
          validation_rules: [],
          layout: { gridSpan: 1 },
          data_source_mode: "real_blocked", readiness_status: "blocked_runtime", synthetic: true, notes: "Upload desativado na fase mock"
        },
        {
          id: "fld-10", section_id: "sec-3", label: "Consentimento Técnico", key: "consent", field_type: "checkbox",
          required: true, placeholder: "", help_text: "Aceito os termos técnicos de abertura.",
          validation_rules: [{ type: "required", message: "Obrigatório aceitar para prosseguir" }],
          layout: { gridSpan: 2 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        }
      ]
    },
    {
      id: "bp-clinic-appt-1",
      name: "Clinic Appointment Intake Form",
      slug: "clinic-appt",
      description: "Mock para agendamento de clínica sintético.",
      process_area: "Scheduling",
      data_source_mode: "synthetic",
      readiness_status: "mock_ready",
      synthetic: true,
      notes: "Synthetic",
      related_capabilities: ["scheduling"],
      related_process_steps: ["Booking"],
      related_docs: [],
      bindings: [],
      governance_warnings: [
        { field_key: "symptoms", warning_type: "data_leak_risk", message: "Campos abertos de sintomas de saúde são estritamente confidenciais." }
      ],
      sections: [
        { id: "sec-c1", title: "Patient Data", description: "", order: 1 },
        { id: "sec-c2", title: "Appointment Details", description: "", order: 2 },
        { id: "sec-c3", title: "Health Prep", description: "", order: 3 }
      ],
      fields: [
         {
          id: "fld-c1", section_id: "sec-c1", label: "Patient Name", key: "patient_name", field_type: "text",
          required: true, placeholder: "Nome do paciente", help_text: "",
          validation_rules: [], layout: { gridSpan: 1 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-c2", section_id: "sec-c2", label: "Preferred Date", key: "pref_date", field_type: "datetime",
          required: true, placeholder: "", help_text: "",
          validation_rules: [], layout: { gridSpan: 1 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        },
        {
          id: "fld-c3", section_id: "sec-c3", label: "Symptoms", key: "symptoms", field_type: "textarea",
          required: true, placeholder: "Descreva...", help_text: "Não incluir diagnósticos fechados",
          validation_rules: [], layout: { gridSpan: 2 },
          data_source_mode: "synthetic", readiness_status: "mock_ready", synthetic: true, notes: ""
        }
      ]
    },
    {
      id: "bp-workshop-repair-1",
      name: "Workshop Repair Intake Form",
      slug: "workshop-repair",
      description: "Formulário de entrada de veículos para oficina (Gestão Técnica).",
      process_area: "Operations",
      data_source_mode: "real_blocked",
      readiness_status: "needs_real_sources",
      synthetic: true,
      notes: "Aguardando fontes reais do cliente Gestão Técnica.",
      related_capabilities: ["work_orders"],
      related_process_steps: ["Intake"],
      related_docs: [],
      bindings: [],
      governance_warnings: [],
      sections: [
        { id: "sec-w1", title: "Vehicle Data", description: "", order: 1 },
        { id: "sec-w2", title: "Damage Assessment", description: "", order: 2 },
        { id: "sec-w3", title: "Signatures", description: "", order: 3 }
      ],
      fields: [
         {
          id: "fld-w1", section_id: "sec-w1", label: "License Plate", key: "plate", field_type: "text",
          required: true, placeholder: "ABC-1234", help_text: "",
          validation_rules: [], layout: { gridSpan: 1 },
          data_source_mode: "real_pending", readiness_status: "needs_real_sources", synthetic: true, notes: ""
        },
        {
          id: "fld-w2", section_id: "sec-w2", label: "Damage Notes", key: "damages", field_type: "textarea",
          required: false, placeholder: "", help_text: "",
          validation_rules: [], layout: { gridSpan: 2 },
          data_source_mode: "real_pending", readiness_status: "needs_real_sources", synthetic: true, notes: ""
        },
        {
          id: "fld-w3", section_id: "sec-w3", label: "Customer Signature", key: "sign", field_type: "signature_placeholder",
          required: true, placeholder: "", help_text: "",
          validation_rules: [], layout: { gridSpan: 2 },
          data_source_mode: "real_blocked", readiness_status: "blocked_runtime", synthetic: true, notes: "Precisa engine"
        }
      ]
    }
  ]
};
