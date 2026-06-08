with open("src/features/builder/process-editor/BuilderPage.tsx", "r") as f:
    content = f.read()

content = "import { getActiveWorkspaceId } from '@/features/workspace/active-workspace';\n" + content

with open("src/features/builder/process-editor/BuilderPage.tsx", "w") as f:
    f.write(content)
