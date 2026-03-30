#!/bin/bash

set -e

if [ -z "$PORT" ]; then
    echo "Erro: A variável PORT é obrigatória"
    exit 1
fi

echo "Iniciando servidor na porta $PORT..."
exec npm start
