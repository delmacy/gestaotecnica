import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

// Loading files
import DashboardLoading from '../../../../../src/app/(builder)/builder/loading';
import TaskerLoading from '../../../../../src/app/(builder)/builder/tasker/loading';
import CapabilitiesLoading from '../../../../../src/app/(builder)/builder/capabilities/loading';
import RegistryLoading from '../../../../../src/app/(builder)/builder/registry/loading';
import ProcessMirroringLoading from '../../../../../src/app/(builder)/builder/process-mirroring/loading';
import DocsLoading from '../../../../../src/app/(builder)/builder/docs/loading';
import UiContractsLoading from '../../../../../src/app/(builder)/builder/ui-contracts/loading';
import SettingsLoading from '../../../../../src/app/(builder)/builder/settings/loading';

// Error files
import DashboardError from '../../../../../src/app/(builder)/builder/error';
import TaskerError from '../../../../../src/app/(builder)/builder/tasker/error';
import CapabilitiesError from '../../../../../src/app/(builder)/builder/capabilities/error';
import RegistryError from '../../../../../src/app/(builder)/builder/registry/error';
import ProcessMirroringError from '../../../../../src/app/(builder)/builder/process-mirroring/error';
import DocsError from '../../../../../src/app/(builder)/builder/docs/error';
import UiContractsError from '../../../../../src/app/(builder)/builder/ui-contracts/error';
import SettingsError from '../../../../../src/app/(builder)/builder/settings/error';

test('Launch Surfaces - Loading states render correctly', () => {
  const loaders = [
    DashboardLoading,
    TaskerLoading,
    CapabilitiesLoading,
    RegistryLoading,
    ProcessMirroringLoading,
    DocsLoading,
    UiContractsLoading,
    SettingsLoading,
  ];

  for (const LoaderComponent of loaders) {
    const html = renderToString(<LoaderComponent />);
    assert.strictEqual(html.includes('Carregando...'), true, 'Should include loading title');
    assert.strictEqual(html.includes('Por favor aguarde enquanto preparamos os dados.'), true, 'Should include loading description');
    assert.strictEqual(html.includes('lucide-react'), false, 'Icon should render without erroring as string literal');
  }
});

test('Launch Surfaces - Error states render correctly', () => {
  const errors = [
    DashboardError,
    TaskerError,
    CapabilitiesError,
    RegistryError,
    ProcessMirroringError,
    DocsError,
    UiContractsError,
    SettingsError,
  ];

  const mockError = new Error('Test Error Message');
  const mockReset = () => {};

  for (const ErrorComponent of errors) {
    const html = renderToString(<ErrorComponent error={mockError} reset={mockReset} />);
    assert.strictEqual(html.includes('Ocorreu um erro ao carregar a página'), true, 'Should include error title');
    assert.strictEqual(html.includes('Test Error Message'), true, 'Should include error message');
    assert.strictEqual(html.includes('Tentar novamente'), true, 'Should include retry button text');
  }
});

test('Launch Surfaces - Error states handle errors without message', () => {
    const mockError = new Error();
    mockError.message = ''; // Simulate error without explicit message string
    const mockReset = () => {};

    const html = renderToString(<DashboardError error={mockError} reset={mockReset} />);
    assert.strictEqual(html.includes('Ocorreu um erro ao carregar a página'), true);
    assert.strictEqual(html.includes('Não foi possível exibir esta página devido a um erro interno.'), true, 'Should include fallback error description');
});
