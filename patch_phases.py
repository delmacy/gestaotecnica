import glob
import re

for filepath in glob.glob("docs/phases/PHASE_2*.md"):
    with open(filepath, "r") as f:
        content = f.read()

    # Apply corrective append if necessary to phase documents if they claim to be something else.
    # We mainly need to ensure they don't contradict the fact that they are alpha/planned or done.
    if "28" in filepath and "28B" not in filepath and "28C" not in filepath:
        content = content.replace('| Status | Planejada |', '| Status | Concluída com ressalva (aguardando 28B/28C) |')
    if "28B" in filepath:
        content = content.replace('| Status | Planejada |', '| Status | Em andamento (Fase Corretiva 28C) |')

    with open(filepath, "w") as f:
        f.write(content)
