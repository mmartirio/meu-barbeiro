# 🐳 Configuração Docker - Meu Barbeiro

## 📋 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)
- Mínimo 4GB de RAM disponível
- Portas 80, 3001 e 3306 livres

## 🚀 Início Rápido

### 1. Iniciar o projeto

```bash
chmod +x docker-start.sh
./docker-start.sh
```

Ou manualmente:

```bash
docker-compose up -d
```

### 2. Acessar a aplicação

- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001
- **MySQL:** localhost:3306

### 3. Parar o projeto

```bash
chmod +x docker-stop.sh
./docker-stop.sh
```

Ou manualmente:

```bash
docker-compose down
```

## 📊 Gerenciamento dos Containers

### Ver logs em tempo real

```bash
# Todos os serviços
./docker-logs.sh

# Serviço específico
./docker-logs.sh backend
./docker-logs.sh frontend
./docker-logs.sh mysql
```

Ou manualmente:

```bash
docker-compose logs -f
docker-compose logs -f backend
```

### Verificar status

```bash
docker-compose ps
```

### Reiniciar serviços

```bash
# Todos
docker-compose restart

# Específico
docker-compose restart backend
```

### Executar comandos dentro dos containers

```bash
# Backend
docker-compose exec backend sh

# MySQL
docker-compose exec mysql mysql -u barbeiro_user -p meu_barbeiro
```

## 🔧 Configuração

### Variáveis de Ambiente

Edite o arquivo `docker-compose.yml` para configurar:

#### Backend
```yaml
environment:
  DB_HOST: mysql
  DB_NAME: meu_barbeiro
  DB_USER: barbeiro_user
  DB_PASSWORD: barbeiro_pass
  JWT_SECRET: sua_chave_secreta_aqui
  EMAIL_HOST: smtp.gmail.com
  EMAIL_USER: seu_email@gmail.com
  EMAIL_PASS: sua_senha_app
```

#### MySQL
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root123
  MYSQL_DATABASE: meu_barbeiro
  MYSQL_USER: barbeiro_user
  MYSQL_PASSWORD: barbeiro_pass
```

### Portas Customizadas

Para mudar as portas expostas, edite no `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Muda frontend para porta 8080
  
  backend:
    ports:
      - "4000:3001"  # Muda backend para porta 4000
```

## 🗄️ Banco de Dados

### Backup do banco

```bash
docker-compose exec mysql mysqldump -u barbeiro_user -pbarbeiro_pass meu_barbeiro > backup.sql
```

### Restaurar backup

```bash
docker-compose exec -T mysql mysql -u barbeiro_user -pbarbeiro_pass meu_barbeiro < backup.sql
```

### Limpar dados e reiniciar

```bash
docker-compose down -v  # Remove volumes (CUIDADO: apaga dados)
docker-compose up -d
```

## 🐛 Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta 80
sudo lsof -i :80

# Parar processo
sudo kill -9 <PID>
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Reconstruir imagens
docker-compose build --no-cache
docker-compose up -d
```

### Problemas de conexão com MySQL

```bash
# Verificar se MySQL está saudável
docker-compose ps

# Ver logs do MySQL
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql
```

### Limpar tudo e recomeçar

```bash
# Parar todos os containers
docker-compose down -v

# Remover imagens antigas
docker rmi meu-barbeiro-backend meu-barbeiro-frontend

# Rebuild completo
docker-compose build --no-cache
docker-compose up -d
```

## 📦 Estrutura dos Containers

```
┌─────────────────────────────────────────┐
│           meu-barbeiro-network          │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐   ┌───────────────┐  │
│  │   Frontend   │   │    Backend    │  │
│  │  (nginx:80)  │──▶│  (node:3001)  │  │
│  └──────────────┘   └───────┬───────┘  │
│                              │          │
│                              ▼          │
│                      ┌───────────────┐  │
│                      │     MySQL     │  │
│                      │   (db:3306)   │  │
│                      └───────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 🔐 Segurança em Produção

⚠️ **Antes de usar em produção:**

1. **Mude as senhas** no `docker-compose.yml`:
   - `MYSQL_ROOT_PASSWORD`
   - `MYSQL_PASSWORD`
   - `JWT_SECRET`

2. **Configure HTTPS** com certificado SSL

3. **Use variáveis de ambiente** via arquivo `.env`:

```bash
# Criar arquivo .env
cp .env.example .env

# Editar .env com suas credenciais
nano .env
```

4. **Limite acesso às portas** (firewall)

5. **Configure backups automáticos** do banco de dados

## 🚀 Deploy em Servidor

### Com Docker

```bash
# No servidor
git clone <seu-repositorio>
cd meu-barbeiro

# Configurar variáveis
nano docker-compose.yml

# Iniciar
./docker-start.sh
```

### Com Docker Swarm (múltiplos servidores)

```bash
docker swarm init
docker stack deploy -c docker-compose.yml meu-barbeiro
```

## 📝 Comandos Úteis

```bash
# Ver uso de recursos
docker stats

# Limpar containers parados
docker container prune

# Limpar imagens não usadas
docker image prune

# Limpar volumes não usados
docker volume prune

# Limpar tudo
docker system prune -a --volumes
```

## 📚 Documentação Adicional

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**Desenvolvido para:** Meu Barbeiro
**Última atualização:** Janeiro 2026
