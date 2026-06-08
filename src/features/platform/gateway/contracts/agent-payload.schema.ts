import { z } from "zod";

const agentSuggestedStateSchema = z.object({
  key: z.string().min(1, "State key is required."),
  label: z.string().min(1, "State label is required."),
  description: z.string().optional(),
  order: z.number().optional(),
});

const agentSuggestedFormFieldSchema = z.object({
  key: z.string().min(1, "Field key is required."),
  label: z.string().min(1, "Field label is required."),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "date",
    "select",
    "checkbox",
    "file",
    "unknown",
  ]),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
});

const agentSuggestedFormSchema = z.object({
  key: z.string().min(1, "Form key is required."),
  title: z.string().min(1, "Form title is required."),
  fields: z
    .array(agentSuggestedFormFieldSchema)
    .max(80, "Maximum of 80 fields per form allowed."),
});

const agentObservedSignalSchema = z.object({
  source: z.string().min(1, "Signal source is required."),
  summary: z.string().min(1, "Signal summary is required."),
  occurredAt: z.string().datetime().optional().or(z.string().optional()),
  reference: z.string().optional(),
});

const agentEvidenceAttachmentSchema = z.object({
  name: z.string().min(1, "Attachment name is required."),
  url: z.string().url("Attachment url must be valid.").optional().or(z.string().optional()),
  mimeType: z.string().optional(),
  description: z.string().optional(),
});

export const agentProcessCandidatePayloadSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId. Must be a valid UUID."),
  name: z.string().min(1, "Candidate name is required.").max(160, "Name cannot exceed 160 characters."),
  description: z.string().max(2000, "Description cannot exceed 2000 characters.").optional(),

  agent: z.object({
    source: z.enum(["paperclip", "n8n", "manual_api", "unknown"]),
    type: z.enum([
      "process_builder",
      "form_builder",
      "observation_agent",
      "unknown",
    ]),
    name: z.string().optional(),
    version: z.string().optional(),
  }),

  proposal: z.object({
    justification: z
      .string()
      .min(1, "Justification is required.")
      .max(3000, "Justification cannot exceed 3000 characters."),
    confidenceScore: z.number().min(0).max(1).optional(),
    proposedDefinition: z.record(z.string(), z.unknown()),
    suggestedStates: z
      .array(agentSuggestedStateSchema)
      .max(30, "Maximum of 30 suggested states allowed.")
      .optional(),
    suggestedForms: z
      .array(agentSuggestedFormSchema)
      .max(20, "Maximum of 20 suggested forms allowed.")
      .optional(),
  }),

  evidence: z.object({
    summary: z.string().optional(),
    observedSignals: z
      .array(agentObservedSignalSchema)
      .max(100, "Maximum of 100 observed signals allowed.")
      .optional(),
    attachments: z
      .array(agentEvidenceAttachmentSchema)
      .max(50, "Maximum of 50 attachments allowed.")
      .optional(),
    raw: z.record(z.string(), z.unknown()).optional(),
  }),

  metadata: z
    .object({
      externalReference: z.string().optional(),
      submittedAt: z.string().datetime().optional().or(z.string().optional()),
      tags: z.array(z.string()).max(30, "Maximum of 30 tags allowed.").optional(),
    })
    .optional(),
});

// Backward compatibility schema
export const legacyAgentSubmissionSchema = z.object({
  workspaceId: z.string().uuid("Invalid workspaceId. Must be a valid UUID."),
  name: z.string().min(1, "Candidate name is required."),
  description: z.string().optional(),
  proposedDefinition: z.record(z.string(), z.unknown()).default({}),
  evidence: z.record(z.string(), z.unknown()).default({}),
});
