const renderPage = require("../utils/renderPage");

module.exports = function createSiteController({ site, pages, projectService }) {
    function health(_req, res) {
        res.status(200).send("ok");
    }

    async function index(_req, res) {
        let featuredProjects = [];
        try {
            featuredProjects = await projectService.getFeaturedProjects();
        } catch (err) {
            console.error("Erro ao carregar projetos em destaque:", err.message);
        }

        renderPage(res, site, {
            currentPath: "/",
            template: "index.html",
            page: pages.index,
            extra: { featuredProjects }
        });
    }

    function sobre(_req, res) {
        renderPage(res, site, {
            currentPath: "/sobre",
            template: pages.sobre.template,
            page: pages.sobre
        });
    }

    async function projetos(_req, res) {
        const projects = await projectService.getAllProjects();

        renderPage(res, site, {
            currentPath: "/projetos",
            template: "projects.html",
            page: pages.projetos,
            extra: { projects }
        });
    }

    function equipe(_req, res) {
        renderPage(res, site, {
            currentPath: "/equipe",
            template: pages.equipe.template,
            page: pages.equipe
        });
    }

    function contato(_req, res) {
        renderPage(res, site, {
            currentPath: "/contato",
            template: pages.contato.template,
            page: pages.contato
        });
    }

    function notFound(req, res) {
        res.status(404);
        renderPage(res, site, {
            template: "page.html",
            page: {
                title: "Página não encontrada",
                content: `<h1>Página não encontrada</h1><p>Rota não encontrada: ${req.path}</p>`,
                show_header: false
            }
        });
    }

    return {
        health,
        index,
        sobre,
        projetos,
        equipe,
        contato,
        notFound
    };
};
