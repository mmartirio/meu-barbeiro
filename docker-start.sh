#!/bin/bash

# Script para iniciar o projeto Meu Barbeiro com Docker

echo "🚀 Iniciando Meu Barbeiro com Docker..."
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    echo "   Visite: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    echo "   Visite: https://docs.docker.com/compose/install/"
    exit 1
fi

# Parar containers existentes se houver
echo "🛑 Parando containers existentes (se houver)..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null

# Limpar volumes antigos (opcional - descomente se quiser limpar dados)
# echo "🗑️  Removendo volumes antigos..."
# docker-compose down -v 2>/dev/null || docker compose down -v 2>/dev/null

# Build das imagens
echo ""
echo "🔨 Construindo imagens Docker..."
docker-compose build || docker compose build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao construir as imagens. Verifique os logs acima."
    exit 1
fi

# Iniciar containers
echo ""
echo "▶️  Iniciando containers..."
docker-compose up -d || docker compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao iniciar os containers. Verifique os logs acima."
    exit 1
fi

# Aguardar os serviços ficarem prontos
echo ""
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar status dos containers
echo ""
echo "📊 Status dos containers:"
docker-compose ps || docker compose ps

echo ""
echo "✅ Projeto iniciado com sucesso!"
echo ""
echo "🌐 Acesse a aplicação em:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3001"
echo "   MySQL:    localhost:3306"
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs:           docker-compose logs -f"
echo "   Parar containers:   docker-compose down"
echo "   Reiniciar:          docker-compose restart"
echo "   Ver logs backend:   docker-compose logs -f backend"
echo "   Ver logs frontend:  docker-compose logs -f frontend"
echo "   Ver logs mysql:     docker-compose logs -f mysql"
echo ""
echo "🔧 Para configurar email, edite as variáveis de ambiente no docker-compose.yml"
echo ""
