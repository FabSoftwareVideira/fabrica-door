const fs = require("fs");
const path = require("path");

function readHtml(baseDir, fileName) {
    return fs.readFileSync(path.join(baseDir, fileName), "utf8");
}

module.exports = function createPages(rootDir) {
    const pagesDir = path.join(rootDir, "public", "pages");

    return {
        index: {
            title: "Página Inicial",
            slug: "",
            template: "index.html",
            url: "/",
            summary: "Fábrica de Software - Desenvolvendo soluções tecnológicas",
            content: readHtml(pagesDir, "index.html")
        },
        sobre: {
            title: "Sobre Nós",
            slug: "sobre",
            template: "page.html",
            url: "/sobre",
            content: readHtml(pagesDir, "sobre.html")
        },
        projetos: {
            title: "Nossos Projetos",
            slug: "projetos",
            template: "page.html",
            url: "/projetos",
            content: readHtml(pagesDir, "projetos.html")
        },
        equipe: {
            title: "Nossa Equipe",
            slug: "equipe",
            template: "team.html",
            url: "/equipe",
            content: readHtml(pagesDir, "equipe.html")
        },
        contato: {
            title: "Contato",
            slug: "contato",
            template: "contato.html",
            show_header: false,
            url: "/contato",
            content: readHtml(pagesDir, "contato.html")
        }
    };
};