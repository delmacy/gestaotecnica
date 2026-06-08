with open("docs/phases/PHASE_28.md", "r") as f:
    content = f.read()

content = content.replace('| Status | Concluída |', '| Status | Concluída com ressalva (aguardando 28B/28C) |')
content = content.replace('Status: Concluído', 'Status: Concluído com ressalva (aguardando 28B/28C)')

with open("docs/phases/PHASE_28.md", "w") as f:
    f.write(content)
