import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderToString } from 'react-dom/server';
import { ViewCanvas } from '../../../../../src/components/builder/view-builder/ViewCanvas';

describe('ViewCanvas Accessibility', () => {
  it('renders a heading and empty state when blueprint is invalid', () => {
    // Arrange
    const invalidBlueprint: any = null;

    // Act
    const html = renderToString(
      <ViewCanvas blueprint={invalidBlueprint} simulatedType="table" simulatedFields={{}} />
    );

    // Assert
    assert.ok(html.includes('<h3'), 'Should render a heading tag');
    assert.ok(html.includes('Invalid View Model'), 'Should render empty state heading text');
    assert.ok(html.includes('missing required configuration data'), 'Should render empty state message text');
  });

  it('renders proper roles or semantic tags for standard layouts', () => {
    // Arrange
    const validBlueprint: any = {
      name: 'Test View',
      description: 'Test Desc',
      fields: [{ id: 'f1', label: 'Field 1', visible: true }],
      layout: { show_actions: true, default_page_size: 10 },
      preview_state: { mock_row_count: 1 }
    };

    // Act
    const html = renderToString(
      <ViewCanvas blueprint={validBlueprint} simulatedType="table" simulatedFields={{}} />
    );

    // Assert
    assert.ok(html.includes('<h2'), 'Should render main view heading tag');
    assert.ok(html.includes('Test View'), 'Should render view title');
    assert.ok(html.includes('<table'), 'Table layout should use semantic table tag');
    assert.ok(html.includes('<th'), 'Table layout should use semantic th tag');
    assert.ok(html.includes('Field 1'), 'Table should render visible field label');
  });
});
