import re

with open("docs/00-current/WORK_BOARD.md", "r") as f:
    content = f.read()

content = content.replace('| 5 | Alpha | Fases 29-40 | Planejadas | Evolução com Frontend Parity Gate |', '| 6 | Alpha | Fases 29-40 | Planejadas | Evolução com Frontend Parity Gate |')

with open("docs/00-current/WORK_BOARD.md", "w") as f:
    f.write(content)
