# Form Contract Extraction

## Overview
As part of `PKG-FORM-CONTRACT-EXTRACTION-001`, the canonical Zod schemas and TypeScript types for forms have been moved from the UI layer to the platform layer.

## Changes
- **New Location**: `src/platform/forms/contracts/`
- **Files**:
  - `field.ts`: Field types, validation rules, visibility rules, and field definition.
  - `layout.ts`: Layout groups, sections, and form layout.
  - `form-definition.ts`: Form status and complete form definition (including refinements).
  - `index.ts`: Unified export.

- **Legacy Compatibility**:
  - `src/components/builder/form-builder/schema/` now re-exports from the platform layer.

## Usage
New code should import from `@/platform/forms/contracts`. Legacy code continues to work using existing imports.
