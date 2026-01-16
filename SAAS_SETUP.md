# Sistema SAAS Multi-Tenant - Meu Barbeiro

## 📋 Visão Geral

Sistema completo de gerenciamento de barbearias com arquitetura SAAS multi-tenant, controle de acesso baseado em grupos e permissões granulares.

## 🎯 Principais Funcionalidades

### 1. Cadastro Completo de Barbearia (Onboarding)
- **Processo Automatizado**:
  - Cadastro da barbearia com todos os dados (nome, CNPJ, endereço, etc.)
  - Criação automática de 3 grupos padrão (Administrador, Barbeiro, Atendente)
  - Criação automática do usuário administrador (proprietário)
  - Envio de e-mail de confirmação com link de acesso
  - Tudo em uma única transação atômica
  
- **Dados da Barbearia**:
  - Nome fantasia e razão social
  - CNPJ com validação
  - Email e telefone
  - Endereço completo (CEP, rua, bairro, cidade, estado)
  - Logo e imagem de fundo
  - Dados do proprietário (nome, email, telefone, senha)
  
- **Slug Único**: URL amigável gerada automaticamente para acesso público

- **E-mail de Boas-Vindas**: Enviado automaticamente após cadastro com:
  - Confirmação do cadastro
  - Link de acesso ao painel administrativo
  - Dados de acesso (e-mail e slug)
  - Lista de funcionalidades disponíveis

### 2. Sistema de Grupos e Permissões
### 2. Sistema de Grupos e Permissões
- **Grupos Padrão**:
  - **Administrador**: Acesso total ao sistema
  - **Barbeiro**: Visualiza agenda, clientes e serviços
  - **Atendente**: Gerencia clientes e agendamentos
  
- **Permissões Granulares**:
  - Gerenciamento de usuários (criar, editar, excluir, visualizar)
  - Gerenciamento de grupos
  - Gerenciamento de clientes
  - Gerenciamento de agendamentos
  - Gerenciamento de serviços e profissionais
  - Visualização de agenda e relatórios
  - Configurações do tenant

### 3. Separação de Usuários e Clientes
### 3. Separação de Usuários e Clientes
- **Usuários Internos**: Profissionais que acessam o painel administrativo
  - Autenticação via email e senha
  - Vinculados a grupos com permissões
  - Podem ser ativados/desativados
  
- **Clientes**: Usuários finais que agendam serviços
  - Identificação por telefone (chave primária)
  - Dados básicos: nome, data de nascimento
  - Sem senha ou autenticação
  - Portal público para agendamento

### 4. Portal do Cliente
- Acesso público sem autenticação
- Identificação apenas por telefone
- Agendamento de serviços
- Seleção de barbeiro e horário

## 🗂️ Estrutura de Arquivos

### Novos Models
```
backend/models/
├── Group.js          # Grupos com permissões
├── Customer.js       # Clientes (sem senha)
├── Tenant.js         # Atualizado com campos completos da barbearia
├── associations.js   # Relacionamentos entre modelos
└── User.js          # Atualizado com groupId
```

### Novos Services
```
backend/services/
├── groupService.js                # Lógica de negócio - grupos
├── customerService.js             # Lógica de negócio - clientes
└── tenantOnboardingService.js     # Onboarding completo de barbearia
```

### Novos Controllers
```
backend/controllers/
├── groupController.js      # CRUD de grupos
└── customerController.js   # CRUD de clientes
```

### Novos Services
```
backend/services/
├── groupService.js      # Lógica de negócio - grupos
└── customerService.js   # Lógica de negócio - clientes
```

### Novas Routes
```
backend/routes/
├── groupRoutes.js           # Rotas protegidas - grupos
├── customerRoutes.js        # Rotas protegidas - clientes (painel)
└── publicCustomerRoutes.js  # Rotas públicas - clientes (portal)
```

### Middlewares
```
backend/middlewares/
├── checkPermission.js   # Verificação de permissões
└── tenantMiddleware.js  # Atualizado com permissões
```

### Scripts Auxiliares
```
backend/
├── seedGroups.js     # Cria grupos padrão e admin inicial
└── migrations/
    └── 001_convert_to_groups_and_customers.sql
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js >= 14
- MySQL >= 5.7
- NPM ou Yarn
- Servidor de e-mail configurado (Gmail, SendGrid, etc)

### Passo 1: Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cd backend
cp .env.example .env
```

Configure as variáveis essenciais:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=meu_barbeiro

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Email (obrigatório para cadastro de barbearia)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
EMAIL_FROM="Meu Barbeiro <noreply@meubarbeiro.com>"

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Para configurar o Gmail**, veja [EMAIL_CONFIGURATION.md](./EMAIL_CONFIGURATION.md)

### Passo 2: Migração do Banco de Dados

**IMPORTANTE**: Faça backup do banco antes de executar!

```bash
# Executar migration SQL para grupos e clientes
mysql -u seu_usuario -p seu_banco < backend/migrations/001_convert_to_groups_and_customers.sql

# Executar migration para novos campos do tenant
mysql -u seu_usuario -p seu_banco < backend/migrations/002_add_tenant_fields.sql
```

### Passo 3: Instalar Dependências

```bash
cd backend
npm install  # Instala nodemailer e outras dependências
```

### Passo 4: Iniciar o Servidor

```bash
npm start
```

### Passo 5: Cadastrar Nova Barbearia

Você pode cadastrar uma barbearia de duas formas:

**Opção 1: Via API**
```bash
curl -X POST http://localhost:3001/api/tenant/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Barbearia",
    "email": "contato@minhabarbearia.com",
    "ownerName": "Seu Nome",
    "ownerEmail": "seu@email.com",
    "ownerPassword": "senha123"
  }'
```

**Opção 2: Via Interface Web (Recomendado)**
- Acesse `http://localhost:3000/cadastro-barbearia`
- Preencha o formulário em 3 etapas:
  - **Etapa 1**: Dados da barbearia (nome, CNPJ, email, telefone)
  - **Etapa 2**: Endereço completo
  - **Etapa 3**: Dados do proprietário (nome, email, telefone, senha)
- Após o cadastro:
  - Sistema cria automaticamente tenant + grupos + usuário admin
  - E-mail de confirmação é enviado para o proprietário
  - Credenciais de acesso são exibidas na tela
- Faça login com o e-mail e senha cadastrados

### Passo 6: Verificar E-mail de Confirmação

Após o cadastro, um e-mail profissional será enviado contendo:
- ✅ Confirmação do cadastro
- ✅ Link de acesso ao painel administrativo
- ✅ Slug da barbearia
- ✅ E-mail de acesso
- ✅ Lista de funcionalidades disponíveis

**Nota**: Se o e-mail não chegar, verifique:
- Pasta de spam
- Configuração do servidor de e-mail no `.env`
- Logs do backend para possíveis erros

### Passo 7: Fazer Login

Use as credenciais do proprietário criadas no cadastro.

## 📡 Endpoints da API

### Cadastro de Barbearia (Onboarding)
```
POST /api/tenant/register
Body: {
  // Dados da barbearia
  name: "Barbearia do João",
  companyName: "João Silva Barbearia LTDA",
  cnpj: "00.000.000/0000-00",
  email: "contato@barbearia.com",
  phone: "(11) 98765-4321",
  
  // Endereço
  address: "Rua das Flores, 123",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
  
  // Proprietário (será o admin)
  ownerName: "João Silva",
  ownerEmail: "joao@email.com",
  ownerPhone: "(11) 98765-4321",
  ownerPassword: "senha123"
}

Response: {
  message: "Barbearia cadastrada com sucesso!",
  tenant: { id, name, slug, email, ... },
  groups: [{ id, name, description }, ...],
  adminUser: { id, name, email, groupId },
  credentials: { email, message },
  accessUrl: "/barbearia/slug-da-barbearia"
}
```

### Buscar Barbearia por Slug (Público)
```
GET /api/tenant/slug/:slug
Response: { id, name, slug, phone, address, logo, ... }
```

### Atualizar Dados da Barbearia
```
PUT /api/tenant/settings
Headers: Authorization: Bearer {token}
Requer: canManageTenant
Body: { name, phone, address, logo, ... }
```

### Autenticação
```
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, name, email, groupId, permissions }, message }
```

### Grupos (requer permissão `canManageGroups`)
```
GET    /api/group              # Listar grupos
GET    /api/group/:id          # Buscar grupo por ID
POST   /api/group              # Criar grupo
PUT    /api/group/:id          # Atualizar grupo
DELETE /api/group/:id          # Excluir grupo
```

### Usuários (requer permissões específicas)
```
GET    /api/user/users         # Listar usuários (canViewUsers)
POST   /api/user/register      # Criar usuário (canCreateUser)
PUT    /api/user/:id           # Atualizar usuário (canEditUser)
PUT    /api/user/:id/password  # Alterar senha (canEditUser)
PATCH  /api/user/:id/toggle-status  # Ativar/Desativar (canEditUser)
DELETE /api/user/:id           # Excluir usuário (canDeleteUser)
```

### Clientes - Painel (requer permissões)
```
GET    /api/customer           # Listar clientes (canViewCustomers)
GET    /api/customer/:phone    # Buscar por telefone (canViewCustomers)
POST   /api/customer           # Criar cliente (canCreateCustomer)
PUT    /api/customer/:phone    # Atualizar cliente (canEditCustomer)
DELETE /api/customer/:phone    # Excluir cliente (canDeleteCustomer)
```

### Clientes - Portal Público (sem autenticação)
```
POST /api/public/customer/get-or-create
Body: { phone, name, birthDate, tenantId }
Response: { customer, message }
```

## 🔐 Sistema de Permissões

### Middleware de Permissões

```javascript
const { checkPermission, checkPermissions, checkAnyPermission } = require('./middlewares/checkPermission');

// Uma permissão específica
router.get('/users', checkPermission('canViewUsers'), controller.getAll);

// Múltiplas permissões (requer todas)
router.post('/user', checkPermissions(['canCreateUser', 'canViewUsers']), controller.create);

// Ao menos uma permissão
router.get('/dashboard', checkAnyPermission(['canViewReports', 'canViewAgenda']), controller.dashboard);
```

### Lista Completa de Permissões

**Usuários:**
- `canCreateUser`
- `canEditUser`
- `canDeleteUser`
- `canViewUsers`

**Grupos:**
- `canManageGroups`

**Clientes:**
- `canViewCustomers`
- `canCreateCustomer`
- `canEditCustomer`
- `canDeleteCustomer`

**Agendamentos:**
- `canViewAppointments`
- `canCreateAppointment`
- `canEditAppointment`
- `canDeleteAppointment`

**Serviços:**
- `canViewServices`
- `canManageServices`

**Profissionais:**
- `canViewProfessionals`
- `canManageProfessionals`

**Agenda:**
- `canViewAgenda`
- `canManageAgenda`

**Outros:**
- `canViewReports`
- `canManageTenant`

## 🔄 Mudanças Principais

### Modelo User
**Antes:**
```javascript
{
  id, name, email, password, 
  role: ENUM('cliente', 'barbeiro', 'admin'),
  tenantId
}
```

**Depois:**
```javascript
{
  id, name, email, password, 
  groupId,      // Referência ao grupo
  tenantId,
  isActive      // Pode ativar/desativar
}
```

### Modelo Appointment
**Antes:**
```javascript
{
  userId,  // Referência a User
  serviceId, professionalId, date, status, tenantId
}
```

**Depois:**
```javascript
{
  customerPhone,  // Referência a Customer
  serviceId, professionalId, date, status, tenantId
}
```

## 🎨 Exemplo de Uso - Portal do Cliente

```javascript
// Frontend - Portal Público
async function iniciarAgendamento() {
  // 1. Cliente informa telefone e dados básicos
  const clientData = {
    phone: '11987654321',
    name: 'João Silva',
    birthDate: '1990-05-15',
    tenantId: 1  // Slug da barbearia seria ideal
  };
  
  // 2. Busca ou cria o cliente
  const response = await fetch('/api/public/customer/get-or-create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData)
  });
  
  const { customer } = await response.json();
  
  // 3. Cliente seleciona serviço, barbeiro e horário
  // 4. Cria agendamento com customer.phone
  
  const appointment = {
    customerPhone: customer.phone,
    serviceId: 1,
    professionalId: 2,
    date: '2026-01-20T14:00:00',
    tenantId: 1
  };
  
  // Criar agendamento (endpoint pode ser público ou protegido)
}
```

## 📊 Diagrama de Relacionamentos

```
Tenant
  ├── Groups (1:N)
  │     └── Users (1:N)
  ├── Customers (1:N)
  ├── Services (1:N)
  ├── Professionals (1:N)
  └── Appointments (1:N)
        ├── Customer (N:1)
        ├── Service (N:1)
        └── Professional (N:1)
```

## ⚠️ Importante

1. **Backup**: Sempre faça backup antes de executar migrations
2. **Testes**: Teste em ambiente de desenvolvimento primeiro
3. **Senha Padrão**: Altere a senha do administrador após o primeiro login
4. **Permissões**: Revise as permissões de cada grupo conforme sua necessidade
5. **Telefone**: O telefone do cliente é a chave primária, garanta que seja único e válido

## 🔧 Troubleshooting

### Erro: "Grupo do usuário não encontrado"
- Verifique se executou o script `seedGroups.js`
- Confirme que todos os usuários têm `groupId` válido

### Erro: "Token sem tenantId"
- Faça logout e login novamente para gerar novo token com estrutura atualizada

### Erro ao criar agendamento
- Verifique se o cliente existe na tabela `customers`
- Confirme que `customerPhone` está sendo enviado corretamente

## 📝 Próximos Passos

1. **Frontend**: Atualizar componentes para usar grupos ao invés de roles
2. **Portal Cliente**: Criar interface pública de agendamento
3. **Validações**: Implementar validação de telefone
4. **Notificações**: Sistema de SMS/WhatsApp para clientes
5. **Multi-idioma**: Internacionalização do sistema

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação dos endpoints ou entre em contato com a equipe de desenvolvimento.

---

**Versão**: 2.0.0  
**Data**: Janeiro 2026  
**Arquitetura**: SAAS Multi-Tenant com Grupos e Permissões
