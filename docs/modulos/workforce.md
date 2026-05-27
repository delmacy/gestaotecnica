# Modulo: Workforce

## Configuracao

Papeis tecnicos ficam em `business_role_definitions`; equipes e perfis tecnicos ficam em `teams` e `technician_profiles`.

Alocacoes de capacidade ficam em `workforce_allocations`. Indisponibilidades ficam em `technician_unavailabilities`.

## Adaptacao por cliente

Separe papel operacional, nivel tecnico, disponibilidade, tipos de alocacao, motivos de indisponibilidade, competencias e permissoes. Ao atribuir um tecnico a uma OS, o sistema cria tambem uma alocacao vinculada para leitura de carga/capacidade fora da tela da OS.
