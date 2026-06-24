# Session Closure Policy

## 1. Objective
This document defines the strict states and rules governing the closure of an autonomous work session within the System Builder ecosystem. It establishes the evidence requirements necessary to classify a session as successful, failed, blocked, unknown, archived, or superseded.

## 2. Session States and Evidence Requirements

### 2.1 Success
A session is classified as successful only when verifiable operational evidence demonstrates that the requested task has been fulfilled according to its acceptance criteria.
- **Evidence Requirement:** System-generated artifacts (e.g., test passes, build success logs, PR creation events, architectural validation passes).
- **Constraint:** Agent completion text (e.g., "I have finished the task") alone is **not** valid evidence of success.
- **Separation of Concerns:** Success of a session (delivery acceptance) is strictly separated from the integration of the work (PR merge). A session can be closed as successful upon delivery acceptance, regardless of the PR merge status.

### 2.2 Failure
A session is classified as failed when operational evidence confirms that the required task cannot be completed within the current scope, or when unrecoverable technical errors occur.
- **Evidence Requirement:** Explicit error logs, failed validation reports, test failure outputs, or CI/CD rejection receipts.

### 2.3 Blocked
A session is classified as blocked when external dependencies, missing context, or architectural constraints prevent progress.
- **Evidence Requirement:** Explicit documentation of the blocking factor, such as missing credentials, incomplete specifications, or failing upstream services. Blocked states must remain explicit and must not be conflated with failures.

### 2.4 Unknown
A session is classified as unknown when the current state cannot be deterministically evaluated through available operational evidence.
- **Evidence Requirement:** An explicit declaration that verifiable evidence is missing, ambiguous, or corrupted. Unknown states must remain explicit and must not be guessed or assumed.

### 2.5 Archived
A session is classified as archived when the task is disqualified, determined to be out of scope, or administratively closed without a technical failure.
- **Evidence Requirement:** Policy references or administrative decisions justifying the closure. Archived must not be used as a synonym for technical failure.

### 2.6 Superseded
A session is classified as superseded when the work is replaced by a newer task or a different architectural approach.
- **Evidence Requirement:** Explicit references to the replacement work (e.g., a newer `task_id`, PR, or issue) must be recorded when available.

## 3. General Principles

- **No Real Session Claims:** This document is purely normative and makes no claims about the existence or status of any real session or operational event.
- **Verifiability:** All state transitions must be backed by real, recorded operational evidence. Hallucinated or assumed states are strictly prohibited.
