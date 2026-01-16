# 📘 Guia de Cadastro de Barbearia

## Visão Geral

O sistema agora possui um processo completo de **onboarding** que cria automaticamente:
- ✅ Cadastro da barbearia (tenant)
- ✅ 3 grupos padrão (Administrador, Barbeiro, Atendente)
- ✅ Usuário administrador (proprietário)
- ✅ Configurações iniciais

Tudo em uma **única operação atômica** (transação).

---

## 🎯 Cadastro de Nova Barbearia

### Via API (Backend)

**Endpoint**: `POST /api/tenant/register`

**Campos Obrigatórios**:
- `name` - Nome fantasia da barbearia
- `email` - Email da barbearia
- `ownerName` - Nome do proprietário
- `ownerEmail` - Email do proprietário (será usado para login)
- `ownerPassword` - Senha do proprietário (mínimo 6 caracteres)

**Campos Opcionais**:
```json
{
  // Dados da empresa
  "companyName": "Razão Social Ltda",
  "cnpj": "00.000.000/0000-00",
  "phone": "(11) 98765-4321",
  
  // Endereço
  "address": "Rua das Flores, 123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  
  // Proprietário adicional
  "ownerPhone": "(11) 98765-4321",
  
  // Customização
  "logo": "url_ou_base64",
  "backgroundImage": "url_ou_base64",
  "slug": "slug-personalizado" // Se não informado, será gerado automaticamente
}
```

**Exemplo Completo**:
```bash
curl -X POST http://localhost:3001/api/tenant/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Barbearia Premium",
    "companyName": "Premium Barber Shop LTDA",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@barberiapremium.com",
    "phone": "(11) 3456-7890",
    "address": "Av. Paulista, 1000 - Sala 10",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-100",
    "ownerName": "Carlos Silva",
    "ownerEmail": "carlos@email.com",
    "ownerPhone": "(11) 98765-4321",
    "ownerPassword": "Senha@123"
  }'
```

**Resposta de Sucesso (201)**:
```json
{
  "message": "Barbearia cadastrada com sucesso!",
  "tenant": {
    "id": 1,
    "name": "Barbearia Premium",
    "companyName": "Premium Barber Shop LTDA",
    "slug": "barbearia-premium",
    "email": "contato@barberiapremium.com",
    "phone": "(11) 3456-7890",
    "address": "Av. Paulista, 1000 - Sala 10",
    "city": "São Paulo",
    "state": "SP"
  },
  "groups": [
    { "id": 1, "name": "Administrador", "description": "Acesso total ao sistema" },
    { "id": 2, "name": "Barbeiro", "description": "Profissional que atende clientes" },
    { "id": 3, "name": "Atendente", "description": "Gerencia clientes e agendamentos" }
  ],
  "adminUser": {
    "id": 1,
    "name": "Carlos Silva",
    "email": "carlos@email.com",
    "groupId": 1
  },
  "credentials": {
    "email": "carlos@email.com",
    "message": "Use esta credencial para fazer login"
  },
  "accessUrl": "/barbearia/barbearia-premium"
}
```

**Erros Possíveis**:
```json
// Email da barbearia já cadastrado
{ "message": "Já existe uma barbearia cadastrada com este email" }

// Email do proprietário já existe
{ "message": "Email do proprietário já está cadastrado" }

// CNPJ inválido
{ "message": "CNPJ inválido" }

// Campos obrigatórios faltando
{ "message": "Dados do proprietário são obrigatórios (nome, email, senha)" }
```

---

## 🖥️ Cadastro via Interface Web

### Componente: BarbeariaRegister

Localização: `src/components/barbearia-register/BarbeariaRegister.js`

**Passo 1: Dados da Barbearia**
- Nome fantasia *
- Razão social
- CNPJ (com formatação automática)
- Email *
- Telefone

**Passo 2: Endereço**
- CEP
- Rua/Avenida, Número
- Bairro
- Cidade
- Estado (dropdown com todos os estados brasileiros)

**Passo 3: Dados do Proprietário**
- Nome completo *
- Email * (será usado para login)
- Telefone
- Senha * (mínimo 6 caracteres)
- Confirmar senha *

**Passo 4: Confirmação**
- Exibe dados da barbearia criada
- Mostra credenciais de acesso
- Botão para fazer login

### Adicionando a Rota

```javascript
// src/routes/Routes.js
import BarbeariaRegister from '../components/barbearia-register/BarbeariaRegister';

<Route path="/cadastro-barbearia" component={BarbeariaRegister} />
```

---

## 🔐 Primeiro Acesso

Após o cadastro, o proprietário pode fazer login com:
- **Email**: Email informado em `ownerEmail`
- **Senha**: Senha informada em `ownerPassword`

### O que é criado automaticamente:

1. **Tenant (Barbearia)**
   - Todos os dados fornecidos
   - Slug único gerado automaticamente
   - Status: Ativo
   - Plano: Free (padrão)

2. **3 Grupos de Acesso**
   - **Administrador**: Todas as permissões
   - **Barbeiro**: Visualizar agenda, clientes, serviços
   - **Atendente**: Gerenciar clientes e agendamentos

3. **Usuário Administrador**
   - Nome do proprietário
   - Email do proprietário
   - Grupo: Administrador
   - Status: Ativo

---

## 📊 Estrutura do Banco de Dados

### Tabela `tenants`

```sql
CREATE TABLE `tenants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Nome fantasia',
  `company_name` VARCHAR(200) COMMENT 'Razão social',
  `cnpj` VARCHAR(18) UNIQUE COMMENT 'CNPJ',
  `slug` VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL amigável',
  `email` VARCHAR(100) NOT NULL COMMENT 'Email da barbearia',
  `phone` VARCHAR(20) COMMENT 'Telefone',
  
  -- Endereço
  `address` VARCHAR(200) COMMENT 'Rua, número',
  `neighborhood` VARCHAR(100) COMMENT 'Bairro',
  `city` VARCHAR(100) COMMENT 'Cidade',
  `state` VARCHAR(2) COMMENT 'UF',
  `zip_code` VARCHAR(10) COMMENT 'CEP',
  
  -- Proprietário
  `owner_name` VARCHAR(100) COMMENT 'Nome do proprietário',
  `owner_email` VARCHAR(100) COMMENT 'Email do proprietário',
  `owner_phone` VARCHAR(20) COMMENT 'Telefone do proprietário',
  
  -- Customização
  `logo` TEXT COMMENT 'Logo',
  `background_image` TEXT COMMENT 'Imagem de fundo',
  
  -- Configurações
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Status',
  `plan_type` ENUM('free', 'basic', 'premium', 'enterprise') DEFAULT 'free',
  
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_cnpj (`cnpj`),
  INDEX idx_slug (`slug`),
  INDEX idx_is_active (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔧 Personalização do Slug

### Geração Automática

O slug é gerado automaticamente a partir do nome:
- `"Barbearia do João"` → `"barbearia-do-joao"`
- `"Barber Shop Premium!"` → `"barber-shop-premium"`
- Remove acentos, caracteres especiais
- Se já existe, adiciona número: `"barbearia-do-joao-2"`

### Slug Personalizado

Você pode fornecer um slug personalizado:
```json
{
  "name": "Barbearia Premium",
  "slug": "premium-barbershop",
  ...
}
```

**Validações**:
- Deve ser único
- Apenas letras minúsculas, números e hífens
- Sem espaços ou caracteres especiais

---

## 🔄 Atualizar Dados da Barbearia

Após o cadastro, o administrador pode atualizar os dados:

**Endpoint**: `PUT /api/tenant/settings`

**Requer**:
- Autenticação (token JWT)
- Permissão: `canManageTenant`

**Campos Editáveis**:
```json
{
  "name": "Novo Nome",
  "companyName": "Nova Razão Social",
  "cnpj": "Novo CNPJ",
  "phone": "Novo Telefone",
  "address": "Novo Endereço",
  "neighborhood": "Novo Bairro",
  "city": "Nova Cidade",
  "state": "SP",
  "zipCode": "Novo CEP",
  "ownerName": "Novo Nome do Proprietário",
  "ownerPhone": "Novo Telefone do Proprietário",
  "logo": "Nova Logo",
  "backgroundImage": "Nova Imagem"
}
```

**Campos NÃO editáveis**:
- `slug` - Fixo após criação
- `email` - Email principal da barbearia
- `ownerEmail` - Email do proprietário

---

## 🌐 Portal Público

Cada barbearia tem um slug único que pode ser usado para:

### Buscar Dados Públicos

**Endpoint**: `GET /api/tenant/slug/:slug`

Retorna dados públicos da barbearia:
```json
{
  "id": 1,
  "name": "Barbearia Premium",
  "slug": "barbearia-premium",
  "phone": "(11) 3456-7890",
  "address": "Av. Paulista, 1000",
  "neighborhood": "Bela Vista",
  "city": "São Paulo",
  "state": "SP",
  "logo": "url_da_logo",
  "backgroundImage": "url_do_background"
}
```

### Portal do Cliente

O slug pode ser usado para criar URLs personalizadas:
- `/agendar/barbearia-premium` - Portal de agendamento
- `/barbearia/barbearia-premium` - Página institucional

---

## 📝 Validações Implementadas

### CNPJ
- 14 dígitos numéricos
- Não pode ter todos os dígitos iguais (11111111111111)
- Formatação automática: `00.000.000/0000-00`

### Email
- Formato válido com @
- Único no sistema (tanto para barbearia quanto para proprietário)

### Senha
- Mínimo 6 caracteres
- Hash bcrypt com salt 10

### Telefone
- Formatação automática: `(11) 98765-4321`
- Aceita 10 ou 11 dígitos

### CEP
- Formatação automática: `00000-000`
- 8 dígitos numéricos

---

## 🚨 Tratamento de Erros

### Transação Atômica

Todo o processo de onboarding acontece em uma transação:
- Se qualquer etapa falhar, tudo é revertido (rollback)
- Garante consistência do banco de dados

### Erros Comuns

```javascript
// Email duplicado
"Já existe uma barbearia cadastrada com este email"

// CNPJ inválido
"CNPJ inválido"

// Campos obrigatórios
"Nome e email são obrigatórios"
"Dados do proprietário são obrigatórios (nome, email, senha)"

// Problema na criação
"Erro ao registrar barbearia" // Ver logs do servidor para detalhes
```

---

## 🧪 Testes

### Teste Manual via cURL

```bash
# Cadastrar barbearia
curl -X POST http://localhost:3001/api/tenant/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Barbearia",
    "email": "teste@barbearia.com",
    "ownerName": "João Teste",
    "ownerEmail": "joao@teste.com",
    "ownerPassword": "teste123"
  }'

# Buscar por slug
curl http://localhost:3001/api/tenant/slug/teste-barbearia

# Login com proprietário
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "teste123"
  }'
```

### Checklist de Testes

- [ ] Cadastro com campos mínimos funciona
- [ ] Cadastro com todos os campos funciona
- [ ] CNPJ é formatado corretamente
- [ ] Slug é gerado automaticamente
- [ ] Grupos são criados corretamente
- [ ] Usuário admin é criado corretamente
- [ ] Transação reverte em caso de erro
- [ ] Email duplicado é detectado
- [ ] CNPJ inválido é rejeitado
- [ ] Login funciona com credenciais criadas
- [ ] Permissões do admin estão corretas
- [ ] Busca por slug funciona
- [ ] Atualização de dados funciona

---

## 📚 Referências

- [Modelo Tenant](../backend/models/Tenant.js)
- [Service de Onboarding](../backend/services/tenantOnboardingService.js)
- [Controller](../backend/controllers/tenantController.js)
- [Routes](../backend/routes/tenantRoutes.js)
- [Migration SQL](../backend/migrations/002_add_tenant_fields.sql)
- [Componente React](../src/components/barbearia-register/BarbeariaRegister.js)

---

**Versão**: 2.0.0  
**Última atualização**: Janeiro 2026
