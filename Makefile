help:
	@echo 'Makefile para o site Node.js'
	@echo ''
	@echo 'Uso:'
	@echo '  make install   instalar dependências'
	@echo '  make dev       iniciar servidor em modo desenvolvimento'
	@echo '  make start     iniciar servidor'
	@echo ''

install:
	npm install

dev:
	npm run dev

start:
	npm start

.PHONY: help install dev start
