import { render, screen } from '@testing-library/react';
import { Sidebar } from '../../../../../src/components/builder/shell/Sidebar';
import { Home, ListTodo, Bot, FileText, Settings, LayoutDashboard } from 'lucide-react';

// Mock matchMedia
window.matchMedia = window.matchMedia || function() {
    return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
    };
};

jest.mock('next/navigation', () => ({
  usePathname: () => '/builder',
}));

describe('Sidebar Taxonomy Grouping', () => {
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

  it('renders active modules under the correct taxonomy group headings', () => {
    render(
      <Sidebar
        activeModules={activeModules}
        futureModules={futureModules}
      />
    );

    // Workspace Core should contain Dashboard and Tasker
    const coreGroup = screen.getByText('Workspace Core').closest('div');
    expect(coreGroup).toBeInTheDocument();
    expect(coreGroup?.textContent).toContain('Dashboard / Home');
    expect(coreGroup?.textContent).toContain('Tasker');

    // Architecture & Definition should contain Capabilities
    const archGroup = screen.getByText('Architecture & Definition').closest('div');
    expect(archGroup).toBeInTheDocument();
    expect(archGroup?.textContent).toContain('Capabilities');

    // Developer & Reference should contain Docs
    const devGroup = screen.getByText('Developer & Reference').closest('div');
    expect(devGroup).toBeInTheDocument();
    expect(devGroup?.textContent).toContain('Docs');

    // Configuration should contain Settings
    const configGroup = screen.getByText('Configuration').closest('div');
    expect(configGroup).toBeInTheDocument();
    expect(configGroup?.textContent).toContain('Settings / Workspace');
  });

  it('does not render an empty taxonomy group', () => {
    // Only pass Workspace Core modules
    const subsetModules = [
      { href: "/builder", label: "Dashboard / Home", icon: Home, status: "active" },
    ];

    render(
      <Sidebar
        activeModules={subsetModules}
        futureModules={futureModules}
      />
    );

    expect(screen.getByText('Workspace Core')).toBeInTheDocument();

    // These groups should not be rendered at all since they have no modules
    expect(screen.queryByText('Architecture & Definition')).not.toBeInTheDocument();
    expect(screen.queryByText('Developer & Reference')).not.toBeInTheDocument();
    expect(screen.queryByText('Configuration')).not.toBeInTheDocument();
  });
});
