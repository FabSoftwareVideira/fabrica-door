require("dotenv").config();

const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const site = require("./config/site");
const createPages = require("./data/pages");
const createProjects = require("./data/projects");

const app = express();
const port = Number(process.env.PORT || 8000);

const pages = createPages(site.rootDir);
const { bySlug: projectsBySlug } = createProjects(site.rootDir);

nunjucks.configure(path.join(site.rootDir, "src", "views"), {
    autoescape: true,
    express: app,
    noCache: process.env.NODE_ENV !== "production"
});

app.set("view engine", "html");

app.use("/assets", express.static(path.join(site.rootDir, "public", "assets")));
// app.use("/images", express.static(path.join(site.rootDir, "public", "assets", "images")));
// app.use("/videos", express.static(path.join(site.rootDir, "public", "assets", "videos")));

function renderPage(res, currentPath, template, page) {
    res.render(template, {
        SITENAME: site.SITE_NAME,
        SITEURL: site.SITE_URL,
        EMAIL_FABRICA: site.EMAIL_FABRICA,
        API_KEY: site.API_KEY,
        GOOGLE_ANALYTICS: site.GOOGLE_ANALYTICS,
        MENUITEMS: site.MENUITEMS,
        SOCIAL_LINKS: site.SOCIAL_LINKS,
        current_year: new Date().getFullYear(),
        currentPath,
        page
    });
}

app.get("/health", (_req, res) => {
    res.status(200).send("ok");
});

app.get(["/", "/index.html"], (_req, res) => {
    renderPage(res, "/", "index.html", pages.index);
});

app.get("/sobre", (_req, res) => {
    renderPage(res, "/sobre", pages.sobre.template, pages.sobre);
});

app.get("/projetos", (_req, res) => {
    renderPage(res, "/projetos", pages.projetos.template, pages.projetos);
});

app.get("/equipe", (_req, res) => {
    renderPage(res, "/equipe", pages.equipe.template, pages.equipe);
});

app.get("/contato", (_req, res) => {
    renderPage(res, "/contato", pages.contato.template, pages.contato);
});

app.get("/projetos/:slug", (req, res) => {
    const project = projectsBySlug[req.params.slug];

    if (!project) {
        console.log(`Projeto não encontrado: ${req.params.slug}`);

        res.status(404);
        return renderPage(
            res,
            "/projetos",
            "page.html",
            {
                title: "Página não encontrada",
                content: "<h1>Página não encontrada</h1><p>O conteúdo solicitado não está disponível.</p>",
                show_header: false
            }
        );
    }

    renderPage(res, "/projetos", "project.html", project);
});

app.use((req, res) => {
    res.status(404);
    renderPage(res, "", "page.html", {
        title: "Página não encontrada",
        content: `<h1>Página não encontrada</h1><p>Rota não encontrada: ${req.path}</p>`,
        show_header: false
    });
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});