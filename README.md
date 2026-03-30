# SFS - Site da Fábrica de Software do IFC Videira

Projeto web migrado para Node.js com Express e Nunjucks, reaproveitando o tema fabrica, os assets e as páginas existentes.

## Stack atual

- Node.js
- Express
- Nunjucks
- HTML, CSS e JavaScript
- Docker e Docker Compose

## Estrutura de conteúdo

- Conteúdo das páginas: `content-html/pages/*.html`
- Conteúdo dos projetos: `content-html/projects/*.html`
- Dados e metadados das páginas: `src/data/pages.js`
- Dados e metadados dos projetos: `src/data/projects.js`
- Templates do tema: `src/views`
- Assets estáticos:
	- `public/theme`
	- `public/assets/images`
	- `public/assets/videos`

## Execução local sem Docker

1. Copie `.env.sample` para `.env`.
2. Instale as dependências:
	- `npm install`
3. Inicie em desenvolvimento:
	- `npm run dev`
4. Acesse:
	- `http://localhost:8000`

## Execução com Docker

1. Copie `.env.sample` para `.env`.
2. Suba o ambiente:
	- `./deploy.sh dev`
3. Acesse:
	- `http://localhost:8000`

## Deploy

O deploy em produção continua via GitHub Actions, usando `docker-compose.yml` e variáveis do segredo `PROD_ENV_FILE`.
