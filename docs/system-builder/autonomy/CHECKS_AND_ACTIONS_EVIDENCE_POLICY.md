# Checks And Actions Evidence Policy

## 1. Objective

This document defines how GitHub checks, Actions runs, deployment statuses, local test reports, and missing checks should be interpreted during review. It establishes the rules for treating automated feedback as verifiable evidence within the autonomy context.

## 2. General Principles

### Checks Are Evidence Sources, Not Decision-Makers
Checks, GitHub Actions runs, and local test reports provide data points (evidence) about the state of the codebase. They do not autonomously make the final decision of whether code is "good" or "ready." The decision to accept delivery or merge must be driven by an evaluation of this evidence. A "green" check is a piece of evidence, not an automatic guarantee of correctness.

### Missing Checks Are Recorded As Absent
If an expected check did not run, failed to report, or was bypassed, it must be explicitly recorded as `MISSING` or `ABSENT`. Never assume a check was successful just because it didn't explicitly fail. Lack of failure is not proof of success.

### Differentiate Between Local and CI Evidence
Evidence must clearly indicate its origin. A local test execution (`npm run test`) run by an agent on their sandbox is "Local Evidence" and might be subject to local environmental constraints. A test executed on GitHub Actions is "CI Evidence." Both are valid, but they represent different levels of guarantee and must be distinguished when recorded.

## 3. Validation Depth: Documentary vs. Code Changes
The required depth of validation depends on the type of change:

*   **Documentary Changes (Markdown, Docs, Policies):** Do not require the full suite of unit and E2E tests to pass perfectly to be accepted, as they typically do not affect runtime code. Validation should focus on architectural checks (`npm run check:architecture`), linting, and manual review of the document's content. A documentary PR can be marked as `ACCEPT_DELIVERY` even if unrelated CI code checks fail.
*   **Code Changes (Application, Workflows, Tests):** Require comprehensive evidence. CI checks for tests, builds, and linting are mandatory to form a complete evidence picture before considering `MERGE_PR`.

## 4. Handling Insufficient Evidence

When the available evidence (e.g., summary status of a GitHub check) is insufficient to understand a failure or anomaly, it is strongly recommended to use a tool to fetch the raw logs. Specifically, executing a `READ_ACTIONS_REPORT` (or using the GitHub API to fetch action logs) should be the next step to investigate before drawing conclusions. Do not guess the cause of a failure.
