#!/bin/bash

# Script para visualizar logs dos containers

SERVICE=$1

if [ -z "$SERVICE" ]; then
    echo "📋 Visualizando logs de todos os serviços..."
    echo "   (Use Ctrl+C para sair)"
    echo ""
    docker-compose logs -f || docker compose logs -f
else
    echo "📋 Visualizando logs do serviço: $SERVICE"
    echo "   (Use Ctrl+C para sair)"
    echo ""
    docker-compose logs -f $SERVICE || docker compose logs -f $SERVICE
fi
