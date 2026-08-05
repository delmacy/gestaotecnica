---
id: GT-AGENT-001
title: Add regression tests for generic event payload associations
status: ready
priority: 10
model_tier: simple
risk: low
allowed_paths:
  - tests/unit/**
  - src/platform/events/**
forbidden_paths:
  - .github/workflows/**
  - src/db/**/schema/**
validation:
  - npm run typecheck
  - npm run test:unit
max_files: 3
---

## Objective

Protect the generic `createEvent` contract after association fields were moved into `payload`.

## Current behavior

`createEvent` accepts `eventType`, `entityType`, `entityId`, and optional `payload`. Module-specific association fields must not become top-level input properties again.

## Required change

Add focused unit tests proving that association values such as `assetId`, `serviceOrderId`, and `workItemId` are retained inside event payloads and that the generic contract remains unchanged.

## Acceptance criteria

- Tests cover at least two association fields.
- No production database connection is required.
- Existing event behavior is unchanged.
- Typecheck and unit tests pass.

## Non-goals

- Do not change database schemas.
- Do not redesign the event platform.
- Do not modify module actions unrelated to the tests.

## Evidence expected

List the tests added and the exact validation commands executed.
