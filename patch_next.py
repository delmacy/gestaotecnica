import re

with open("docs/00-current/NEXT_PHASE.md", "r") as f:
    content = f.read()

content = content.replace('A próxima implementação técnica autorizada é a Fase 28', 'A próxima implementação técnica autorizada é a Fase 29, condicionada à revisão ChatGPT/Jules Tester e à finalização da correção 28C')

content = content.replace('Fase 28 — Agent Gateway Backend\nFrontend vinculado: Fase 28B — Agent Gateway Control Plane UI', 'Fase 29 — Process Builder Agent\n(NÃO AVANÇAR ATÉ QUE A CORREÇÃO 28C SEJA TOTALMENTE APROVADA E REVISADA)')

content = content.replace('[docs/planning/alpha/PHASE_28.md](../planning/alpha/PHASE_28.md)', '[docs/planning/alpha/PHASE_29.md](../planning/alpha/PHASE_29.md)')
content = content.replace('Para iniciar a execução da Fase 28', 'Para iniciar a execução da Fase 29')

with open("docs/00-current/NEXT_PHASE.md", "w") as f:
    f.write(content)
