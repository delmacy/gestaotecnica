import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Empty State Taxonomy Contract', () => {
    const contractPath = path.join(process.cwd(), 'docs/ui/surfaces/navigation/EMPTY_STATE_TAXONOMY_CONTRACT.md');
    let contractContent = '';

    it('Contract file exists', () => {
        assert.ok(fs.existsSync(contractPath), 'Contract file should exist');
        contractContent = fs.readFileSync(contractPath, 'utf8');
    });

    it('Answers: where the user came from, what they do here, where they go next, and how they return', () => {
        assert.ok(contractContent.includes('Where the user came from'), 'Missing where user came from');
        assert.ok(contractContent.includes('What they do here'), 'Missing what they do here');
        assert.ok(contractContent.includes('Where they go next'), 'Missing where they go next');
        assert.ok(contractContent.includes('How they return'), 'Missing how they return');
    });

    it('Distinct states are defined (Empty, Blocked, Demo/Synthetic, Real-data)', () => {
        assert.ok(contractContent.includes('Empty State'), 'Missing Empty State');
        assert.ok(contractContent.includes('Blocked / Unauthorized State'), 'Missing Blocked State');
        assert.ok(contractContent.includes('Demo / Synthetic State'), 'Missing Demo State');
        assert.ok(contractContent.includes('Real-Data State'), 'Missing Real-Data State');
    });

    it('Mandates commercial/product oriented language', () => {
        assert.ok(contractContent.includes('commercial and product-oriented'), 'Missing language mandate');
    });

    it('Mandates responsive and accessible design', () => {
        assert.ok(contractContent.includes('responsive'), 'Missing responsive mandate');
        assert.ok(contractContent.includes('accessible'), 'Missing accessible mandate');
    });
});
