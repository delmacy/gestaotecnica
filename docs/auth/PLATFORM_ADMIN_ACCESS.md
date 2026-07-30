# Platform Admin Access

Este documento descreve como garantir e gerenciar o acesso administrativo de alto nível ("builder") à plataforma System Builder.

## 1. Primeiro Acesso
O primeiro administrador da plataforma deve ser criado por meio da rota inicial de configuração:
- Rota: `/auth/setup`
- Preencha o formulário (nome, e-mail, senha e confirmação).
- Após o cadastro, o usuário terá obrigatoriamente o perfil de **builder** associado (o formulário de setup só pode criar este perfil).
- O sistema criará a conta (`auth_accounts`), o usuário (`users`) e, em seguida, registrará automaticamente a sessão antes de redirecionar para `/builder`.
- **Atenção:** Nenhuma senha padrão existe ou deve ser incluída no Git. O script é apenas para recuperação administrativa, "/auth/setup" é o fluxo principal.
O primeiro administrador da plataforma deve ser criado por meio da rota inicial de configuração:
- Rota: `/auth/setup`
- Preencha o nome, e-mail e senha.
- Após o cadastro, o usuário terá o perfil de **Builder** associado.

## 2. Acesso Posterior
Uma vez criado o usuário administrador:
- Os acessos subsequentes devem ser feitos via `/auth/login`.
- A rota `/auth/setup` ficará bloqueada (retorna erro "Setup inicial ja foi concluido") se já existir uma conta na tabela `auth_accounts`.

## 3. Criação/Normalização via Script
Se o setup inicial já estiver bloqueado ou for necessário recriar o acesso do administrador da plataforma, deve-se usar o script dedicado.

**Comando de Execução:**
```bash
npx tsx src/scripts/ensure-platform-admin.ts
```

## 4. Variáveis de Ambiente
O script consome as seguintes variáveis (se não fornecidas, valores padrão ou gerados são usados em desenvolvimento):
- `PLATFORM_ADMIN_NAME`
- `PLATFORM_ADMIN_EMAIL`
- `PLATFORM_ADMIN_PASSWORD`
- `PLATFORM_ADMIN_LOGIN_ENABLED=true` habilita o login mestre autorreparador.

Quando o login mestre está habilitado e as credenciais coincidem com as variáveis acima, `/auth/login` normaliza de forma idempotente o usuário, o perfil `builder` e a conta de autenticação antes de criar uma sessão comum. Isso recupera contas ausentes, inativas ou com senha divergente sem apagar dados.

## 5. Regras de Segurança
- Não existe rota pública para reset de senha administrativa.
- Nenhuma senha é registrada em logs ou arquivos físicos.
- O Git não deve rastrear o armazenamento de senhas.
- O script atualiza a senha de forma segura com hash.
- O login mestre permanece desabilitado se a flag, o e-mail ou a senha estiverem ausentes.
- A senha nunca é registrada em logs; cada normalização registra somente o identificador do usuário e o horário.
- Em produção, a flag deve ser habilitada apenas quando esse caminho de recuperação for deliberadamente aceito e as variáveis estiverem em um cofre de segredos.

## 6. Comportamento em Produção
Se o sistema for executado em ambiente de produção (`NODE_ENV=production`) e a variável `PLATFORM_ADMIN_PASSWORD` não for fornecida, o script irá **falhar intencionalmente**. Isso impede a geração de senhas aleatórias imprevisíveis e força o controle seguro das credenciais via ambiente.

## 7. Acesso Esperado a /builder
Com a conta de Builder configurada com sucesso, a plataforma redirecionará o usuário ou permitirá o acesso direto a todas as rotas restritas em `/builder` e `/builder/**`.

## 8. Procedimento Quando Já Existe Conta Desconhecida
Se já existir um registro na tabela que não se sabe a senha:
1. Execute o script `ensure-platform-admin.ts` informando a variável de ambiente `PLATFORM_ADMIN_PASSWORD`.
2. O script encontrará o usuário pelo email e atualizará a conta associada na tabela `authAccounts` com a nova senha com hash, reativando o acesso sem precisar deletar o usuário ou o banco.
