import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

describe('Runtime to Evidence Handoff Contract', () => {
  const contractPath = path.resolve(process.cwd(), 'docs/ui/surfaces/navigation/RUNTIME_EVIDENCE_HANDOFF_CONTRACT.md');

  it('should exist', () => {
    assert.ok(fs.existsSync(contractPath), 'Contract file should exist');
  });

  it('should define navigation experience successfully', () => {
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert.ok(content.includes('## Navigation Experience'), 'Navigation experience section is defined');
    assert.ok(content.includes('Where the user came from'), 'Origin context is specified');
    assert.ok(content.includes('What they do here'), 'Active context is specified');
    assert.ok(content.includes('Where they go next'), 'Next step context is specified');
    assert.ok(content.includes('How they return'), 'Return path context is specified');
  });

  it('should clearly define state rules for Empty, Blocked, Demo, Synthetic, and Real-Data', () => {
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert.ok(content.includes('**Empty State**'), 'Empty state is defined');
    assert.ok(content.includes('**Blocked State**'), 'Blocked state is defined');
    assert.ok(content.includes('**Demo State**'), 'Demo state is defined');
    assert.ok(content.includes('**Synthetic Data State**'), 'Synthetic data state is defined');
    assert.ok(content.includes('**Real-Data State**'), 'Real-Data state is defined');
  });

  it('should specify explicit role and scope rules', () => {
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert.ok(content.includes('## Role/Scope rules'), 'Role/Scope rules section is defined');
    assert.ok(content.includes('`runtime_user`'), 'runtime_user role is defined');
    assert.ok(content.includes('`builder_admin`'), 'builder_admin role is defined');
  });

  it('should specify explicit acceptance gates', () => {
    const content = fs.readFileSync(contractPath, 'utf-8');
    assert.ok(content.includes('## Acceptance Gates'), 'Acceptance gates section is defined');
  });
});
