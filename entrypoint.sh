#!/bin/bash

set -e

if [ -z "$PORT" ]; then
    echo "Erro: A variável PORT é obrigatória"
    exit 1
fi

# Detectar o ambiente
NODE_ENV=${NODE_ENV:-production}

echo "Iniciando servidor em modo $NODE_ENV na porta $PORT..."

if [ "$NODE_ENV" = "development" ]; then
    echo "Modo de desenvolvimento - recarregando em tempo real"
    exec npm run dev
else
    echo "Modo de produção"
    exec npm start
fi
