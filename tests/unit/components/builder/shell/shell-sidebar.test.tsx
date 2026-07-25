import { test } from 'node:test';
import assert from 'node:assert';
import { Sidebar } from '../../../../../src/components/builder/shell/Sidebar';
import { Home, ListTodo, Bot, FileText, Settings, LayoutDashboard } from 'lucide-react';

test('Sidebar structural render test with all taxonomy groups', () => {
  const activeModules = [
    { href: "/builder", label: "Dashboard / Home", icon: Home, status: "active" },
    { href: "/builder/tasker", label: "Tasker", icon: ListTodo, status: "active" },
    { href: "/builder/capabilities", label: "Capabilities", icon: Bot, status: "active" },
    { href: "/builder/docs", label: "Docs", icon: FileText, status: "active" },
    { href: "/builder/settings", label: "Settings / Workspace", icon: Settings, status: "active" },
  ];

  const futureModules = [
    { href: "/builder/workflow-builder", label: "Workflow Builder", icon: LayoutDashboard, status: "coming_soon" },
  ];

  const element = Sidebar({ modules: activeModules, futureModules });
  assert.ok(element, 'Sidebar should return a React element');

  const cache = new Set();
  const stringified = JSON.stringify(element, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    if (typeof value === 'function') {
      return value.name || 'function';
    }
    return value;
  });

  // Verify group headings
  assert.ok(stringified.includes('Workspace Core'), 'Workspace Core heading should be present');
  assert.ok(stringified.includes('Architecture &amp; Definition'), 'Architecture & Definition heading should be present');
  assert.ok(stringified.includes('Developer &amp; Reference'), 'Developer & Reference heading should be present');
  assert.ok(stringified.includes('Configuration'), 'Configuration heading should be present');
  assert.ok(stringified.includes('Future Modules'), 'Future Modules heading should be present');

  // Verify active modules
  assert.ok(stringified.includes('Dashboard / Home'), 'Dashboard module should be present');
  assert.ok(stringified.includes('Tasker'), 'Tasker module should be present');
  assert.ok(stringified.includes('Capabilities'), 'Capabilities module should be present');
  assert.ok(stringified.includes('Docs'), 'Docs module should be present');
  assert.ok(stringified.includes('Settings / Workspace'), 'Settings module should be present');

  // Verify future modules
  assert.ok(stringified.includes('Workflow Builder'), 'Workflow Builder module should be present');
});

test('Sidebar structural render test handles empty taxonomy groups', () => {
  const subsetModules = [
    { href: "/builder", label: "Dashboard / Home", icon: Home, status: "active" },
  ];

  const futureModules = [
    { href: "/builder/workflow-builder", label: "Workflow Builder", icon: LayoutDashboard, status: "coming_soon" },
  ];

  const element = Sidebar({ modules: subsetModules, futureModules });
  assert.ok(element, 'Sidebar should return a React element');

  const cache = new Set();
  const stringified = JSON.stringify(element, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    if (typeof value === 'function') {
      return value.name || 'function';
    }
    return value;
  });

  // Verify the present group
  assert.ok(stringified.includes('Workspace Core'), 'Workspace Core heading should be present');
  assert.ok(stringified.includes('Dashboard / Home'), 'Dashboard module should be present');

  // Verify empty groups are NOT present
  assert.ok(!stringified.includes('Architecture &amp; Definition'), 'Empty Architecture group should not be rendered');
  assert.ok(!stringified.includes('Developer &amp; Reference'), 'Empty Developer group should not be rendered');
  assert.ok(!stringified.includes('Configuration'), 'Empty Configuration group should not be rendered');
});
