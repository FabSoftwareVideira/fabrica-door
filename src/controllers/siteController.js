const renderPage = require("../utils/renderPage");

module.exports = function createSiteController({ site, pages, projectService }) {
    function health(_req, res) {
        res.status(200).send("ok");
    }

    function index(_req, res) {
        renderPage(res, site, {
            currentPath: "/",
            template: "index.html",
            page: pages.index
        });
    }

    function sobre(_req, res) {
        renderPage(res, site, {
            currentPath: "/sobre",
            template: pages.sobre.template,
            page: pages.sobre
        });
    }

    function projetos(_req, res) {
        renderPage(res, site, {
            currentPath: "/projetos",
            template: pages.projetos.template,
            page: pages.projetos
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

    async function projetoPorSlug(req, res) {
        const project = await projectService.getProjectBySlug(req.params.slug);

        if (!project) {
            console.log(`Projeto não encontrado: ${req.params.slug}`);

            res.status(404);
            return renderPage(res, site, {
                currentPath: "/projetos",
                template: "page.html",
                page: {
                    title: "Página não encontrada",
                    content: "<h1>Página não encontrada</h1><p>O conteúdo solicitado não está disponível.</p>",
                    show_header: false
                }
            });
        }

        renderPage(res, site, {
            currentPath: "/projetos",
            template: "project.html",
            page: project
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
        projetoPorSlug,
        notFound
    };
};
