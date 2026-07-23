import {
  Home,
  ListTodo,
  Bot,
  Library,
  Search,
  FileText,
  FileCode2,
  Settings,
  Workflow,
  FormInput,
  MonitorPlay,
  Zap,
  Plug,
  Network,
  ShieldAlert,
  GraduationCap,
  HelpCircle,
  Bell
} from "lucide-react";
import type React from "react";

export const IconMap: Record<string, React.ElementType> = {
  Home,
  ListTodo,
  Bot,
  Library,
  Search,
  FileText,
  FileCode2,
  Settings,
  Workflow,
  FormInput,
  MonitorPlay,
  Zap,
  Plug,
  Network,
  ShieldAlert,
  GraduationCap,
  HelpCircle,
  Bell
};

export function getIcon(iconName: string): React.ElementType {
  const IconComponent = IconMap[iconName];
  if (!IconComponent) {
    // Default fallback icon
    return HelpCircle;
  }
  return IconComponent;
}
