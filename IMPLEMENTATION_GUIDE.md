# 🚀 Guia Rápido de Implementação

## Checklist de Implementação

### ✅ Backend Completo

- [x] Modelo `Group` com permissões granulares
- [x] Modelo `Customer` separado de `User`
- [x] Modelo `User` atualizado com `groupId`
- [x] Modelo `Appointment` atualizado com `customerPhone`
- [x] Middleware `checkPermission` para controle de acesso
- [x] CRUD completo de Grupos
- [x] CRUD completo de Clientes
- [x] CRUD de Usuários atualizado
- [x] Autenticação atualizada com permissões no token
- [x] Endpoints públicos para clientes e agendamentos
- [x] Script de seed para criar grupos padrão
- [x] Migration SQL completa

### 🔨 Próximos Passos - Backend

1. **Testar a Migration SQL**
   ```bash
   # FAZER BACKUP PRIMEIRO!
   mysql -u root -p seu_banco < backend/migrations/001_convert_to_groups_and_customers.sql
   ```

2. **Executar Seed de Grupos**
   ```bash
   cd backend
   node seedGroups.js
   ```

3. **Iniciar Servidor**
   ```bash
   npm start
   ```

4. **Testar Endpoints**
   - Login com novo formato
   - Criar grupos
   - Criar usuários com groupId
   - Criar clientes
   - Criar agendamentos com customerPhone

### 📱 Implementações Frontend Necessárias

#### 1. Atualizar Login e AuthContext
```javascript
// src/context/AuthContext.js
const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // user agora tem: groupId, groupName, permissions
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
};
```

#### 2. Criar HOC/Hook para Verificar Permissões
```javascript
// src/hooks/usePermission.js
import { useAuth } from './useAuth';

export const usePermission = (permission) => {
    const { user } = useAuth();
    return user?.permissions?.[permission] || false;
};

// Uso em componentes
const canCreateUser = usePermission('canCreateUser');
if (canCreateUser) {
    // Mostrar botão de criar usuário
}
```

#### 3. Atualizar Componente de Usuários
```javascript
// Remover referências a 'role'
// Adicionar seleção de 'groupId'
<select name="groupId" required>
    <option value="">Selecione um grupo</option>
    {groups.map(g => (
        <option key={g.id} value={g.id}>{g.name}</option>
    ))}
</select>
```

#### 4. Criar Tela de Gerenciamento de Grupos
```javascript
// src/administrador/components/grupos/GruposManager.js
// Listar, criar, editar, excluir grupos
// Configurar permissões por grupo
```

#### 5. Criar Tela de Gerenciamento de Clientes
```javascript
// src/administrador/components/clientes/ClientesManager.js
// Similar aos usuários, mas sem senha
// Buscar por telefone
```

#### 6. Atualizar Agendamentos
```javascript
// Usar customerPhone ao invés de userId
// Adicionar busca de cliente por telefone
// Integrar com portal público
```

#### 7. Implementar Portal do Cliente
```javascript
// Já criado em: src/components/customer-portal/CustomerPortal.js
// Adicionar rota pública:
<Route path="/agendar/:slug" component={CustomerPortal} />
```

### 🎯 Arquivos que Precisam de Ajustes

#### Frontend - Ajustes Necessários

1. **src/context/AuthContext.js**
   - Atualizar estrutura do user (remover role, adicionar groupId e permissions)
   - Salvar permissions no localStorage

2. **src/hooks/useAuth.js**
   - Adaptar para nova estrutura de usuário

3. **src/administrador/components/usuario/***
   - Remover dropdowns de role
   - Adicionar seleção de grupo
   - Atualizar API calls (groupId ao invés de role)

4. **src/administrador/painel/AdminDashboard.js**
   - Usar permissões ao invés de role para controle de acesso
   - `if (user.permissions.canViewReports) { ... }`

5. **src/routes/PrivateRoute.js**
   - Aceitar permissões ao invés de roles
   ```javascript
   <PrivateRoute 
       path="/users" 
       component={Users} 
       requiredPermission="canViewUsers"
   />
   ```

6. **Criar novos componentes:**
   - `src/administrador/components/grupos/Grupos.js`
   - `src/administrador/components/clientes/Clientes.js`

### 🧪 Testes Recomendados

1. **Login com novo formato**
   ```bash
   POST /api/auth/login
   {
     "email": "admin@meubarbeiro.com",
     "password": "Admin@123"
   }
   ```

2. **Criar Grupo**
   ```bash
   POST /api/group
   Headers: Authorization: Bearer {token}
   {
     "name": "Gerente",
     "description": "Gerencia serviços e relatórios",
     "canViewServices": true,
     "canManageServices": true,
     "canViewReports": true
   }
   ```

3. **Criar Cliente Público**
   ```bash
   POST /api/public/customer/get-or-create
   {
     "phone": "11987654321",
     "name": "João Silva",
     "birthDate": "1990-05-15",
     "tenantId": 1
   }
   ```

4. **Criar Agendamento Público**
   ```bash
   POST /api/public/appointment/create
   {
     "customerPhone": "11987654321",
     "serviceId": 1,
     "professionalId": 2,
     "date": "2026-01-20T14:00:00",
     "tenantId": 1
   }
   ```

### 📊 Estrutura de Permissões por Grupo

#### Administrador (Full Access)
```javascript
{
    canCreateUser: true,
    canEditUser: true,
    canDeleteUser: true,
    canViewUsers: true,
    canManageGroups: true,
    canViewCustomers: true,
    canCreateCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: true,
    canViewAppointments: true,
    canCreateAppointment: true,
    canEditAppointment: true,
    canDeleteAppointment: true,
    canViewServices: true,
    canManageServices: true,
    canViewProfessionals: true,
    canManageProfessionals: true,
    canViewAgenda: true,
    canManageAgenda: true,
    canViewReports: true,
    canManageTenant: true
}
```

#### Barbeiro (Limited Access)
```javascript
{
    canViewUsers: true,
    canViewCustomers: true,
    canCreateCustomer: true,
    canViewAppointments: true,
    canCreateAppointment: true,
    canEditAppointment: true,
    canViewServices: true,
    canViewProfessionals: true,
    canViewAgenda: true
}
```

#### Atendente (Customer & Appointment Management)
```javascript
{
    canViewUsers: true,
    canViewCustomers: true,
    canCreateCustomer: true,
    canEditCustomer: true,
    canDeleteCustomer: true,
    canViewAppointments: true,
    canCreateAppointment: true,
    canEditAppointment: true,
    canDeleteAppointment: true,
    canViewServices: true,
    canViewProfessionals: true,
    canViewAgenda: true
}
```

### 🔒 Segurança

1. **Validação de Telefone**
   - Implementar regex para formato brasileiro
   - Remover caracteres especiais antes de salvar

2. **Rate Limiting**
   - Adicionar limite de requisições para endpoints públicos
   - Evitar spam de agendamentos

3. **Validação de Horários**
   - Verificar conflitos de agendamento
   - Validar horário de funcionamento
   - Implementar bloqueio de horários já ocupados

4. **Auditoria**
   - Log de criação/edição/exclusão de usuários
   - Log de alterações de permissões
   - Rastreamento de agendamentos

### 📈 Melhorias Futuras

1. **Notificações**
   - SMS de confirmação de agendamento
   - WhatsApp API para lembretes
   - Email para usuários internos

2. **Dashboard Público**
   - Visualização de horários disponíveis em tempo real
   - Cancelamento de agendamento pelo cliente

3. **Relatórios Avançados**
   - Relatórios por grupo de usuário
   - Relatórios de clientes (novos, recorrentes, etc.)
   - Dashboard de permissões utilizadas

4. **Multi-idioma**
   - Interface em PT, EN, ES
   - Mensagens de erro localizadas

5. **Mobile App**
   - App nativo para clientes
   - Push notifications

### 🆘 Troubleshooting Comum

**Erro: Cannot read property 'groupId' of undefined**
- Fazer logout e login novamente
- Limpar localStorage
- Verificar se o token está atualizado

**Erro: Foreign key constraint fails**
- Verificar se os grupos foram criados
- Confirmar que groupId existe antes de criar usuário

**Erro: Customer not found**
- Garantir que o cliente foi criado antes do agendamento
- Usar endpoint `/get-or-create` do portal público

**Permissões não estão funcionando**
- Verificar se o middleware checkPermission está aplicado
- Confirmar que o grupo tem a permissão habilitada
- Checar se o token inclui as permissões

---

## 📞 Comandos Úteis

```bash
# Verificar estrutura do banco
mysql -u root -p -e "DESCRIBE groups" seu_banco
mysql -u root -p -e "DESCRIBE customers" seu_banco
mysql -u root -p -e "DESCRIBE user" seu_banco

# Verificar grupos criados
mysql -u root -p -e "SELECT * FROM groups" seu_banco

# Verificar usuários e seus grupos
mysql -u root -p -e "SELECT u.id, u.name, u.email, g.name as grupo FROM user u JOIN groups g ON u.group_id = g.id" seu_banco

# Resetar senha de admin
cd backend
node updateAdminPassword.js
```

---

**Status**: ✅ Backend 100% implementado  
**Próximo**: Frontend (ajustes em componentes existentes)
