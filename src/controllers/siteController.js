function renderPage(res, site, currentPath, template, page) {
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

module.exports = function createSiteController({ site, pages, projectsBySlug }) {
    function health(_req, res) {
        res.status(200).send("ok");
    }

    function index(_req, res) {
        renderPage(res, site, "/", "index.html", pages.index);
    }

    function sobre(_req, res) {
        renderPage(res, site, "/sobre", pages.sobre.template, pages.sobre);
    }

    function projetos(_req, res) {
        renderPage(res, site, "/projetos", pages.projetos.template, pages.projetos);
    }

    function equipe(_req, res) {
        renderPage(res, site, "/equipe", pages.equipe.template, pages.equipe);
    }

    function contato(_req, res) {
        renderPage(res, site, "/contato", pages.contato.template, pages.contato);
    }

    function projetoPorSlug(req, res) {
        const project = projectsBySlug[req.params.slug];

        if (!project) {
            console.log(`Projeto não encontrado: ${req.params.slug}`);

            res.status(404);
            return renderPage(
                res,
                site,
                "/projetos",
                "page.html",
                {
                    title: "Página não encontrada",
                    content: "<h1>Página não encontrada</h1><p>O conteúdo solicitado não está disponível.</p>",
                    show_header: false
                }
            );
        }

        renderPage(res, site, "/projetos", "project.html", project);
    }

    function notFound(req, res) {
        res.status(404);
        renderPage(res, site, "", "page.html", {
            title: "Página não encontrada",
            content: `<h1>Página não encontrada</h1><p>Rota não encontrada: ${req.path}</p>`,
            show_header: false
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
