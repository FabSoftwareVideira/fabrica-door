# SFS - Site da Fábrica de Software do IFC Videira

Projeto web migrado para Node.js com Express e Nunjucks, reaproveitando o tema fabrica, os assets e as páginas existentes.

## Stack atual

- Node.js
- Express
- Nunjucks
- HTML, CSS e JavaScript
- Docker e Docker Compose
- PostgreSQL (projetos gerenciados via banco)
- JWT + bcryptjs (autenticação de administradores)

## Estrutura de conteúdo

- Conteúdo das páginas estáticas: `public/pages/*.html`
- Conteúdo legado de projetos (HTML): `public/projects/*.html`
- Dados e metadados das páginas: `src/data/pages.js`
- Projetos cadastrados via banco de dados PostgreSQL
- Templates do tema: `src/views`
- Templates admin: `src/views/admin`
- Templates auth: `src/views/auth`
- Assets estáticos: `public/assets`

## Estrutura `src/`

```
src/
  app.js              # bootstrap MVC
  server.js           # ponto de entrada
  config/
    site.js           # configurações do site
    db.js             # pool PostgreSQL
  models/
    projectModel.js   # SQL CRUD de projetos
    adminUserModel.js # busca de usuário admin
  services/
    pageService.js    # serviço de páginas estáticas
    projectService.js # serviço de projetos (DB)
    authService.js    # JWT + bcrypt
  controllers/
    siteController.js        # páginas públicas
    authController.js        # login/logout
    adminProjectController.js # CRUD admin
  routes/
    siteRoutes.js
    authRoutes.js
    adminProjectRoutes.js
  middlewares/
    authMiddleware.js  # guarda JWT via cookie
    asyncHandler.js    # envolve funções async
  utils/
    renderPage.js      # helper de renderização
  db/
    migrations/
      001_initial.sql  # schema inicial
    hashPassword.js    # utilitário para gerar hash
  views/
    base.html / index.html / page.html / project.html / team.html / contato.html
    auth/
      login.html
    admin/
      projects-list.html
      project-form.html
```

## Configurar banco de dados

1. Copie `.env.sample` para `.env` e preencha as variáveis `PG*`, `JWT_SECRET` e `JWT_EXPIRES_IN`.
2. Suba o banco com Docker:
   ```bash
   docker compose up db -d
   ```
   A migration `src/db/migrations/001_initial.sql` roda automaticamente no primeiro start.

3. Gere o hash da senha do administrador:
   ```bash
   npm run hash-password SuaSenhaAqui
   ```
4. Insira o hash gerado na tabela `admin_users`:
   ```sql
   UPDATE admin_users
   SET password_hash = '<hash_gerado>'
   WHERE email = 'admin@fabrica.edu.br';
   ```

## Rotas de administração

| Rota | Descrição |
|---|---|
| `GET /auth/login` | Tela de login |
| `POST /auth/login` | Autenticar (gera cookie JWT) |
| `POST /auth/logout` | Encerrar sessão |
| `GET /admin/projetos` | Listar projetos *(protegida)* |
| `GET /admin/projetos/novo` | Formulário de novo projeto *(protegida)* |
| `POST /admin/projetos` | Criar projeto *(protegida)* |
| `GET /admin/projetos/:id/editar` | Formulário de edição *(protegida)* |
| `POST /admin/projetos/:id` | Salvar edição *(protegida)* |
| `POST /admin/projetos/:id/excluir` | Excluir projeto *(protegida)* |

## Execução local sem Docker

1. Copie `.env.sample` para `.env`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Suba o banco PostgreSQL localmente ou via Docker:
   ```bash
   docker compose up db -d
   ```
4. Inicie em desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse: `http://localhost:8000`

## Execução com Docker

1. Copie `.env.sample` para `.env`.
2. Suba o ambiente:
   ```bash
   ./deploy.sh dev
   ```
3. Acesse: `http://localhost:8000`

## Tema de Natal

Durante uma janela anual configurável, o site ganha decoração e animações de
Natal: neve caindo, luzes no cabeçalho, chapéus de Papai Noel nas fotos da
equipe, cartões em estilo de doce de Natal e saudações sazonais. O tema é
aplicado a todas as páginas (inclusive as administrativas) e desliga sozinho
ao final da janela.

As datas ficam no `.env` e **não têm ano**, então a mesma configuração vale
para todos os anos:

| Variável | Padrão | Descrição |
|---|---|---|
| `CHRISTMAS_THEME` | `auto` | `auto` ativa pela janela; `on` força a ativação (útil para testar); `off` desativa |
| `CHRISTMAS_START` | `12-01` | Primeiro dia ativo, no formato `MM-DD` |
| `CHRISTMAS_END` | `12-30` | Último dia ativo (inclusive), no formato `MM-DD` |
| `CHRISTMAS_TIMEZONE` | `America/Sao_Paulo` | Fuso usado para decidir a data atual |

A janela também pode atravessar a virada do ano, por exemplo
`CHRISTMAS_START=12-20` e `CHRISTMAS_END=01-06`.

Para pré-visualizar fora da janela:

```bash
CHRISTMAS_THEME=on npm run dev
```

No Windows PowerShell:

```powershell
$env:CHRISTMAS_THEME="on"; npm run dev
```

### Brincadeiras de Natal

Na página inicial, quando o tema está ativo:

- **Terminal natalino** — um terminal fictício que "compila" o Natal e aceita o
  comando `npm install natal`.
- **Árvore de código** — uma árvore de Natal desenhada com `{}`, `</>`, `;`,
  `0`, `1`, `#` e outros caracteres de programação.
- **Presente surpresa** — um presente que abre e revela uma mensagem da equipe.
- **Visita ilustre** — clique no Papai Noel para receber um "Ho ho ho!".
- **Trenó** — de tempos em tempos, um trenó com renas atravessa o topo da
  página.
- **Easter egg** — digite `FELIZ NATAL` em qualquer página para uma surpresa.

Todas as brincadeiras funcionam sem bibliotecas extras e respeitam
`prefers-reduced-motion` (a neve, o trenó e o confete do easter egg ficam
desativados nesse modo).

Quando a janela está ativa, o servidor adiciona `data-season="christmas"` ao
`<html>`, carrega `assets/css/christmas.css` e `assets/js/christmas.js` e
injeta os enfeites nos templates. A neve pode ser desligada pelo botão no canto
inferior esquerdo e todas as animações respeitam `prefers-reduced-motion`.

## Deploy

O deploy em produção continua via GitHub Actions, usando `docker-compose.yml` e variáveis do segredo `PROD_ENV_FILE`. Certifique-se de definir `JWT_SECRET` com um valor seguro em produção.

## CI/CD

- O workflow `deploy.yml` é acionado por pushes com as tags `v*`.
