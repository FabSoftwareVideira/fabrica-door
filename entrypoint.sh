#!/bin/sh

set -e

if [ -z "$PORT" ]; then
    echo "Erro: A variável PORT é obrigatória"
    exit 1
fi

NODE_ENV=${NODE_ENV:-production}

echo "[DOCKER] Executando migrações automáticas do banco de dados..."
npm run migrate

echo "[DOCKER] Iniciando servidor em modo $NODE_ENV na porta $PORT..."

if [ "$NODE_ENV" = "development" ]; then
    echo "[DOCKER] Modo de desenvolvimento - recarregando em tempo real"
    exec npm run dev
else
    echo "[DOCKER] Modo de produção"
    exec npm start
fi
