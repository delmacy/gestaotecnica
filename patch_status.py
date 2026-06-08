import re

with open("docs/00-current/STATUS_DAS_FASES.md", "r") as f:
    content = f.read()

content = content.replace('|   28 | ✅      | Agent Gateway Backend       | Fase 28 Alfa Planejada                                   |', '|   28 | ✅      | Agent Gateway Backend    | Concluída com ressalva (aguardando 28B/28C)              |')
if '|  28B' not in content:
  lines = content.split('\n')
  for i, line in enumerate(lines):
    if '|   28 |' in line:
      lines.insert(i+1, '|  28B | ✅      | Gateway Control Plane    | Fase 28B Concluída                                       |')
      lines.insert(i+2, '|  28C | ✅      | Correção de Paridade     | Fase Corretiva Concluída                                 |')
      break
  content = '\n'.join(lines)

with open("docs/00-current/STATUS_DAS_FASES.md", "w") as f:
    f.write(content)
