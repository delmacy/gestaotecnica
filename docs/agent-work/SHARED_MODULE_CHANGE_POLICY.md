# Shared Module Change Policy

Quando um worker precisar alterar algo em `shared_read_only` (ex: um componente UI base para sua feature ou tipagem base), ele deve registrar o gap e solicitar que o worker dono do "Shared" implemente a mudança, ou fazê-lo numa wave isolada.
