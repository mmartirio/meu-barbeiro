# Configuração de E-mail - Meu Barbeiro

Este documento explica como configurar o envio de e-mails no sistema Meu Barbeiro.

## 📧 Funcionalidades de E-mail

O sistema envia e-mails automáticos em dois cenários:

1. **E-mail de Boas-Vindas**: Enviado após o cadastro completo da barbearia
   - Confirma que o cadastro foi realizado com sucesso
   - Fornece o link de acesso ao painel administrativo
   - Inclui as credenciais de acesso

2. **E-mail de Recuperação de Senha**: Para redefinir senha esquecida

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as seguintes variáveis:

```bash
# URL do frontend (para gerar links nos e-mails)
FRONTEND_URL=http://localhost:3000

# Configurações de e-mail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM="Meu Barbeiro <noreply@meubarbeiro.com>"
```

### 2. Configuração com Gmail

Para usar o Gmail como servidor de e-mail:

#### Passo 1: Ativar Autenticação de 2 Fatores
1. Acesse [Conta Google](https://myaccount.google.com/)
2. Vá em "Segurança"
3. Ative "Verificação em duas etapas"

#### Passo 2: Gerar Senha de App
1. Acesse [Senhas de App](https://myaccount.google.com/apppasswords)
2. Selecione "Outro (nome personalizado)"
3. Digite "Meu Barbeiro" e clique em "Gerar"
4. Copie a senha gerada (16 caracteres)
5. Use essa senha no campo `EMAIL_PASS` do `.env`

#### Exemplo de configuração Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=meubarbeiro@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM="Meu Barbeiro <noreply@meubarbeiro.com>"
```

### 3. Outros Provedores de E-mail

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxx
```

1. Crie uma conta em [SendGrid](https://sendgrid.com/)
2. Crie uma API Key
3. Use "apikey" como usuário e a API Key como senha

#### Amazon SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=AKIAIOSFODNN7EXAMPLE
EMAIL_PASS=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

1. Acesse o [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Verifique seu domínio ou e-mail
3. Crie credenciais SMTP

#### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@seu-dominio.mailgun.org
EMAIL_PASS=sua-senha-mailgun
```

1. Crie uma conta em [Mailgun](https://www.mailgun.com/)
2. Verifique seu domínio
3. Use as credenciais SMTP fornecidas

#### Mailtrap (Desenvolvimento/Testes)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu-usuario-mailtrap
EMAIL_PASS=sua-senha-mailtrap
```

Mailtrap é ideal para ambiente de desenvolvimento, pois captura todos os e-mails sem enviar de verdade.

1. Crie uma conta em [Mailtrap](https://mailtrap.io/)
2. Copie as credenciais SMTP da inbox

## 🧪 Testando o Envio de E-mails

### Verificar Conexão

Você pode verificar se o servidor de e-mail está configurado corretamente:

```javascript
// No backend, crie um arquivo test-email.js
const emailService = require('./services/emailService');

async function testEmail() {
    const isConnected = await emailService.verifyConnection();
    console.log('Servidor de e-mail:', isConnected ? 'OK' : 'ERRO');
}

testEmail();
```

Execute:
```bash
cd backend
node test-email.js
```

### Enviar E-mail de Teste

```javascript
// test-send.js
const emailService = require('./services/emailService');

async function sendTest() {
    const result = await emailService.sendWelcomeEmail({
        ownerEmail: 'seu-email@example.com',
        ownerName: 'Teste da Silva',
        companyName: 'Barbearia Teste',
        slug: 'barbearia-teste',
        loginUrl: 'http://localhost:3000/admin/login'
    });
    
    console.log('Resultado:', result);
}

sendTest();
```

Execute:
```bash
node test-send.js
```

## 📝 Estrutura do E-mail de Boas-Vindas

O e-mail enviado após o cadastro contém:

- ✅ Saudação personalizada com nome do proprietário
- ✅ Nome da barbearia cadastrada
- ✅ Lista de funcionalidades disponíveis
- ✅ Dados de acesso (URL e e-mail)
- ✅ Botão para acessar o painel administrativo
- ✅ Link para suporte via WhatsApp
- ✅ Design responsivo e profissional

## ⚠️ Tratamento de Erros

O sistema foi desenvolvido para **não bloquear o cadastro** caso o envio de e-mail falhe:

```javascript
try {
    await emailService.sendWelcomeEmail(data);
    console.log('E-mail enviado com sucesso');
} catch (emailError) {
    console.error('Erro ao enviar e-mail:', emailError);
    // Cadastro continua mesmo se o e-mail falhar
}
```

Isso garante que problemas temporários no servidor de e-mail não impeçam novos cadastros.

## 🔐 Segurança

### Boas Práticas:

1. **Nunca commite o arquivo `.env`** no Git
2. Use senhas de app, não a senha principal da conta
3. Em produção, use um serviço de e-mail profissional (SendGrid, SES, etc)
4. Monitore o log de envio de e-mails
5. Implemente rate limiting para prevenir abuso

### Arquivo `.gitignore`:
```
.env
.env.local
.env.production
```

## 🚀 Em Produção

Para produção, recomendamos:

1. **Usar um serviço dedicado**:
   - SendGrid (até 100 e-mails/dia grátis)
   - Amazon SES (muito barato)
   - Mailgun (bom para grande volume)

2. **Configurar domínio personalizado**:
   - Configure SPF, DKIM e DMARC
   - Use um domínio próprio (ex: noreply@meubarbeiro.com.br)

3. **Monitoramento**:
   - Acompanhe taxa de entrega
   - Configure webhooks para status de e-mails
   - Implemente retry logic para falhas temporárias

4. **Templates**:
   - Use templates HTML otimizados
   - Teste em diferentes clientes de e-mail
   - Garanta compatibilidade mobile

## 📊 Logs

Os logs de e-mail são exibidos no console:

```
E-mail enviado: <message-id>
E-mail de boas-vindas enviado com sucesso
```

Em caso de erro:
```
Erro ao enviar e-mail: Error: Invalid credentials
Erro ao enviar e-mail de boas-vindas: [detalhes do erro]
```

## 🆘 Troubleshooting

### Erro: "Invalid login"
- Verifique se o e-mail e senha estão corretos
- Para Gmail, certifique-se de usar senha de app, não a senha normal
- Verifique se a autenticação de 2 fatores está ativa

### Erro: "Connection refused"
- Verifique se o HOST e PORT estão corretos
- Teste a conexão com telnet: `telnet smtp.gmail.com 587`
- Firewall pode estar bloqueando a porta

### E-mails não chegam
- Verifique a pasta de spam
- Confirme que o e-mail remetente está verificado
- Em desenvolvimento, use Mailtrap para capturar e-mails

### Erro: "self signed certificate"
- Em desenvolvimento, pode adicionar: `secure: false`
- Em produção, corrija o certificado SSL

## 📚 Referências

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)

## 🎯 Próximos Passos

1. Configure as variáveis de e-mail no `.env`
2. Teste o envio com um cadastro de barbearia
3. Verifique se o e-mail chegou corretamente
4. Em produção, migre para um serviço profissional
5. Configure templates personalizados se necessário
