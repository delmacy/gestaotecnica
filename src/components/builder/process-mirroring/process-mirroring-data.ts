import { ProcessPilot } from './process-mirroring-types';

export const mockPilots: ProcessPilot[] = [
  {
    id: 'pilot-1',
    name: 'Technical Service Intake',
    slug: 'technical-service-intake',
    description: 'Processo de recebimento de demandas técnicas.',
    status: 'needs_validation',
    data_source_mode: 'synthetic',
    workspace_label: 'Main Workspace',
    process_area: 'Service Management',
    personas: ['Technician', 'Client'],
    source_inventory: [
      { id: 'src-1', type: 'message', description: 'Mensagem de WhatsApp sintética', status: 'collected' },
      { id: 'src-2', type: 'system_export', description: 'Exportação fictícia de chamados', status: 'collected' }
    ],
    observations: [
      { id: 'obs-1', actor: 'Client', action: 'Envia mensagem reportando problema', system: 'WhatsApp' },
      { id: 'obs-2', actor: 'Technician', action: 'Cria chamado manual', system: 'Legacy System' }
    ],
    evidence_items: [
      { id: 'ev-1', observationId: 'obs-1', sourceId: 'src-1', strength: 'strong', description: 'Log de chat simulado' }
    ],
    collection_gaps: [
      { id: 'gap-1', type: 'missing_real_data', description: 'Falta histórico real de WhatsApp', status: 'open' }
    ],
    as_is_summary: {
      summary: 'Atualmente o intake é feito de forma manual e descentralizada via WhatsApp.',
      keySteps: ['Recebimento via WhatsApp', 'Triagem manual', 'Criação de ticket no sistema legado']
    },
    validation_decision: {
      status: 'needs_real_sources',
      notes: 'O processo espelhado é um demo sintético. Necessário fontes reais para validação.'
    },
    capability_candidates: [
      { id: 'cap-1', name: 'Requests', justification: 'Gerenciamento estruturado de solicitações' },
      { id: 'cap-2', name: 'Communication', justification: 'Canal de comunicação unificado' }
    ],
    related_docs: ['docs/process_mirroring/pilots/technical_service_intake/SOURCE_INVENTORY.md'],
    synthetic: true,
    notes: 'Synthetic demo. Real sources pending.'
  },
  {
    id: 'pilot-2',
    name: 'Clinic Appointment Intake',
    slug: 'clinic-appointment-intake',
    description: 'Processo de agendamento de consultas clínicas.',
    status: 'draft',
    data_source_mode: 'synthetic',
    workspace_label: 'Health Dept',
    process_area: 'Scheduling',
    personas: ['Patient', 'Receptionist'],
    source_inventory: [],
    observations: [],
    evidence_items: [],
    collection_gaps: [],
    as_is_summary: {
      summary: 'Agendamento por telefone.',
      keySteps: []
    },
    validation_decision: {
      status: 'not_reviewed',
      notes: ''
    },
    capability_candidates: [],
    related_docs: [],
    synthetic: true,
    notes: 'Synthetic demo'
  },
  {
    id: 'pilot-3',
    name: 'Workshop Repair Intake',
    slug: 'workshop-repair-intake',
    description: 'Processo de entrada de veículos para reparo.',
    status: 'draft',
    data_source_mode: 'synthetic',
    workspace_label: 'Auto Workshop',
    process_area: 'Repair',
    personas: ['Mechanic', 'Customer'],
    source_inventory: [],
    observations: [],
    evidence_items: [],
    collection_gaps: [],
    as_is_summary: {
      summary: 'Recepção de veículos.',
      keySteps: []
    },
    validation_decision: {
      status: 'not_reviewed',
      notes: ''
    },
    capability_candidates: [],
    related_docs: [],
    synthetic: true,
    notes: 'Synthetic demo'
  }
];
