#!/bin/bash

# Script para parar o projeto Meu Barbeiro com Docker

echo "🛑 Parando Meu Barbeiro..."
echo ""

# Parar containers
docker-compose down || docker compose down

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Containers parados com sucesso!"
    echo ""
    echo "💡 Para remover também os volumes (dados do banco), execute:"
    echo "   docker-compose down -v"
else
    echo ""
    echo "❌ Erro ao parar os containers."
    exit 1
fi
