with open('docs/auth/PLATFORM_ADMIN_ACCESS.md', 'r') as f:
    content = f.read()

new_content = content.replace("## 1. Primeiro Acesso", """## 1. Primeiro Acesso
O primeiro administrador da plataforma deve ser criado por meio da rota inicial de configuração:
- Rota: `/auth/setup`
- Preencha o formulário (nome, e-mail, senha e confirmação).
- Após o cadastro, o usuário terá obrigatoriamente o perfil de **builder** associado (o formulário de setup só pode criar este perfil).
- O sistema criará a conta (`auth_accounts`), o usuário (`users`) e, em seguida, registrará automaticamente a sessão antes de redirecionar para `/builder`.
- **Atenção:** Nenhuma senha padrão existe ou deve ser incluída no Git. O script é apenas para recuperação administrativa, "/auth/setup" é o fluxo principal.""")

with open('docs/auth/PLATFORM_ADMIN_ACCESS.md', 'w') as f:
    f.write(new_content)
