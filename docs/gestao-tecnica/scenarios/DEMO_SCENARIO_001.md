# Gestão Técnica Demo Scenario 001: Technical Service Intake

This document defines the first real demo scenario for Gestão Técnica, validating the vertical flow end-to-end using synthetic data.

## 1. Scenario Summary
- **Scenario:** Technical Service Intake
- **Goal:** Validate the end-to-end flow from Client Capability discovery to Process Execution and Timeline Evidence generation.
- **Trigger:** A user (Requester) submits a new Technical Service Request form.
- **Outcome:** A process instance is executed, state is saved, and the Timeline reflects the creation, assignment, and completion of the initial review step.

## 2. Entities & Roles
- **Requester:** A synthetic user submitting the request (e.g., `user_synthetic_requester_01`).
- **Operator:** A synthetic technical operator reviewing the request (e.g., `user_synthetic_operator_01`).
- **Workspace:** `workspace_demo_gestao_tecnica`

## 3. Capability
- **ID:** `cap_technical_service_intake`
- **Name:** Technical Service Intake
- **Category:** `work_orders`

## 4. Forms
- **Form ID:** `form_tech_request_v1`
- **Fields:**
  - `equipment_id` (string, required)
  - `issue_description` (text, required)
  - `urgency_level` (enum: LOW, MEDIUM, HIGH, required)

## 5. Process Steps (Workflow)
- **Process ID:** `proc_tech_intake_v1`
- **Steps:**
  1. `Receive_Request`: Triggered by form submission.
  2. `Automated_Triage`: Evaluates urgency level. If HIGH, assigns immediately to an Operator.
  3. `Operator_Review`: Manual step where Operator accepts or rejects the request.
  4. `End_Intake`: Final state.

## 6. Expected Timeline Evidence
- `TimelineItem 1:` "Technical Service Request submitted by Requester" (Event: `request.submitted`)
- `TimelineItem 2:` "Automated triage completed: Urgency HIGH" (Event: `triage.completed`)
- `TimelineItem 3:` "Request assigned to Operator" (Event: `request.assigned`)
- `TimelineItem 4:` "Operator accepted the request" (Event: `request.accepted`)

## 7. Out-of-Scope Boundaries
- Actual email or SMS notifications are not sent.
- Integration with real legacy databases is skipped.
- UI layer (Next.js components) is not required to be functional, only API/contract level validation.
