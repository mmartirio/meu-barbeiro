# Tela do Cliente - Personalização do Portal de Agendamento

## ✅ Funcionalidade Implementada

Sistema completo para personalizar a aparência da tela pública de agendamento, permitindo que cada barbearia configure sua identidade visual.

## 🎨 Funcionalidades

### 1. **Upload de Logomarca**
- Upload de arquivo de imagem (PNG, JPG, SVG)
- Tamanho máximo: 2MB
- Preview em tempo real
- Exibida acima do formulário de agendamento do cliente

### 2. **Upload de Plano de Fundo**
- Upload de imagem de background
- Tamanho máximo: 5MB
- Preview em tempo real
- Aplicada como background da página pública

### 3. **Compartilhamento do Link**
- Link único gerado automaticamente: `/agendar/{slug}`
- Botão para copiar link
- Botão para compartilhar diretamente no WhatsApp
- Botão para visualizar prévia

## 📁 Arquivos Criados/Modificados

### Frontend

#### Novos Componentes
- **[src/administrador/components/tela-cliente/TelaCliente.js](src/administrador/components/tela-cliente/TelaCliente.js)**
  - Componente principal de personalização
  - Upload de logo e background
  - Gerenciamento de preview
  - Compartilhamento de link

- **[src/administrador/components/tela-cliente/TelaCliente.css](src/administrador/components/tela-cliente/TelaCliente.css)**
  - Estilização completa do componente
  - Design responsivo
  - Tema escuro incluído

#### Componentes Modificados
- **[src/administrador/painel/AdminDashboard.js](src/administrador/painel/AdminDashboard.js)**
  - Adicionado item "Tela do Cliente" no menu lateral

- **[src/routes/Routes.js](src/routes/Routes.js)**
  - Rota `/tela-cliente` (protegida)
  - Rota `/agendar/:slug` (pública)

- **[src/components/customer-portal/CustomerPortal.js](src/components/customer-portal/CustomerPortal.js)**
  - Integrado com slug da URL
  - Carrega logo e background do tenant
  - Exibe logo acima do formulário
  - Aplica background personalizado

- **[src/components/customer-portal/CustomerPortal.css](src/components/customer-portal/CustomerPortal.css)**
  - Estilização para logo
  - Background com overlay
  - Efeito de blur/transparência no card

### Backend

#### Controllers Modificados
- **[backend/controllers/tenantController.js](backend/controllers/tenantController.js)**
  - `getSettings()` - Buscar configurações do tenant
  - `uploadAssets()` - Upload de logo e background

#### Routes Modificados
- **[backend/routes/tenantRoutes.js](backend/routes/tenantRoutes.js)**
  - `GET /api/tenant/settings` - Buscar configurações (protegida)
  - `POST /api/tenant/upload-assets` - Upload de arquivos (protegida)

## 🔧 Como Usar

### 1. Acessar Tela de Personalização

1. Faça login no painel administrativo
2. No menu lateral, clique em **"Tela do Cliente"**
3. Você verá 3 seções principais:
   - Logomarca
   - Plano de Fundo
   - Link de Agendamento

### 2. Fazer Upload da Logo

1. Clique na área de upload da logo (ou no botão "Alterar Logo")
2. Selecione uma imagem (PNG, JPG ou SVG)
3. Visualize o preview
4. Clique em "Salvar Alterações"

### 3. Fazer Upload do Plano de Fundo

1. Clique na área de upload do plano de fundo
2. Selecione uma imagem (PNG ou JPG)
3. Visualize o preview
4. Clique em "Salvar Alterações"

### 4. Compartilhar Link

O link é gerado automaticamente no formato:
```
http://localhost:3000/agendar/{slug-da-barbearia}
```

**Opções de compartilhamento:**
- **Copiar Link**: Copia para a área de transferência
- **Visualizar**: Abre o link em nova aba para preview
- **WhatsApp**: Compartilha direto no WhatsApp com mensagem personalizada

## 📊 Fluxo do Cliente

1. Cliente acessa o link: `/agendar/{slug}`
2. Sistema carrega dados da barbearia (logo, background, nome)
3. Logo é exibida no topo da página
4. Background personalizado é aplicado com overlay escuro
5. Cliente preenche formulário de agendamento
6. Processo de agendamento segue normalmente

## 🎯 Endpoints da API

### Buscar Configurações
```http
GET /api/tenant/settings
Authorization: Bearer {token}

Response: {
  id: 1,
  name: "Barbearia Elegance",
  slug: "barbearia-elegance",
  email: "contato@elegance.com",
  phone: "(11) 98765-4321",
  logo: "/uploads/1234567890-logo.png",
  backgroundImage: "/uploads/1234567890-bg.jpg"
}
```

### Upload de Assets
```http
POST /api/tenant/upload-assets
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body (FormData):
- logo: File (opcional)
- background: File (opcional)

Response: {
  message: "Arquivos enviados com sucesso",
  logo: "/uploads/1234567890-logo.png",
  backgroundImage: "/uploads/1234567890-bg.jpg"
}
```

### Buscar Barbearia por Slug (Público)
```http
GET /api/tenant/slug/{slug}

Response: {
  id: 1,
  name: "Barbearia Elegance",
  slug: "barbearia-elegance",
  phone: "(11) 98765-4321",
  address: "Av. Paulista, 1000",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  logo: "/uploads/1234567890-logo.png",
  backgroundImage: "/uploads/1234567890-bg.jpg"
}
```

## 🔐 Permissões

Para acessar e modificar a tela do cliente, o usuário precisa ter a permissão:
- `canManageTenant`

Por padrão, apenas usuários do grupo **Administrador** possuem essa permissão.

## 💡 Exemplo de Uso

### Exemplo de Link de Agendamento
```
http://localhost:3000/agendar/barbearia-elegance
```

### Exemplo de Mensagem do WhatsApp
```
Agende seu horário na Barbearia Elegance! 
Acesse: http://localhost:3000/agendar/barbearia-elegance
```

## 🎨 Personalização Visual

### Logo
- Posicionada no topo da página
- Centralizada
- Efeito de sombra (drop-shadow)
- Dimensões máximas: 250px largura x 150px altura
- Mantém proporções originais

### Background
- Cobre toda a tela
- Overlay escuro semi-transparente para legibilidade
- Efeito parallax (fixed)
- Card do formulário com blur/transparência

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Layout otimizado com previews grandes
- **Tablet**: Ajustes de tamanho e espaçamento
- **Mobile**: Layout empilhado, botões full-width

## 🔄 Fluxo Técnico

### Upload de Arquivos

1. **Frontend**: 
   - Usuário seleciona arquivo
   - Preview gerado com `URL.createObjectURL()`
   - Validação de tamanho
   - FormData criado com arquivos

2. **Backend**:
   - Multer processa upload
   - Arquivo salvo em `/uploads/`
   - Caminho salvo no banco de dados (Tenant)
   - Response com URLs dos arquivos

3. **Exibição**:
   - Cliente acessa `/agendar/{slug}`
   - Sistema busca tenant por slug
   - Logo e background carregados do servidor
   - Aplicados ao CustomerPortal

## ⚠️ Considerações

### Tamanhos de Arquivo
- **Logo**: Máximo 2MB (validado no frontend)
- **Background**: Máximo 5MB (validado no frontend)
- **Servidor**: Limite de 20MB configurado no multer

### Formatos Aceitos
- **Logo**: PNG, JPG, JPEG, SVG
- **Background**: PNG, JPG, JPEG

### Performance
- Recomendado otimizar imagens antes do upload
- Background: ideal 1920x1080px ou 1600x900px
- Logo: ideal 400x200px (formato landscape) ou 200x200px (quadrado)

## 🐛 Troubleshooting

### Logo não aparece
1. Verifique se o arquivo foi salvo corretamente
2. Confirme permissões da pasta `/uploads/`
3. Teste acessando diretamente: `http://localhost:3001/uploads/nome-arquivo.png`

### Background não carrega
1. Verifique o tamanho do arquivo (max 5MB)
2. Confirme que o formato é suportado
3. Verifique logs do backend para erros

### Link não funciona
1. Confirme que o slug está correto
2. Verifique se a barbearia está ativa (`isActive: true`)
3. Teste o endpoint público: `GET /api/tenant/slug/{slug}`

## 🚀 Próximas Melhorias

- [ ] Crop de imagem antes do upload
- [ ] Galeria de backgrounds pré-definidos
- [ ] Escolha de cores do tema
- [ ] Preview em tempo real antes de salvar
- [ ] Histórico de logos/backgrounds utilizados
- [ ] Compressão automática de imagens
- [ ] QR Code para o link de agendamento
- [ ] Estatísticas de acessos ao link

## 📚 Referências

- [Multer Documentation](https://github.com/expressjs/multer)
- [React File Upload](https://react.dev/reference/react-dom/components/input#reading-files)
- [CSS Background Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/background)

---

**Desenvolvido para Meu Barbeiro**  
**Versão**: 2.2.0  
**Data**: 16 de Janeiro de 2026
