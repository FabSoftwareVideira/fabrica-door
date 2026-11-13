const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const nunjucks = require("nunjucks");

const templates = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, "..", "src", "views")),
    { autoescape: true }
);

function render(projects) {
    return templates.render("index.html", {
        SITEURL: "",
        SITENAME: "Fábrica",
        featuredProjects: projects
    });
}

test("a faixa só aparece quando há projetos em destaque", () => {
    assert.doesNotMatch(render([]), /class="featured-ticker"/);
    assert.match(render([{ id: 1, title: "Projeto", situacao: "Concluído" }]), /class="featured-ticker"/);
});

test("a faixa abre o site, o GitHub ou o cartão do projeto, nessa ordem", () => {
    const html = render([
        { id: 1, title: "Site", situacao: "Concluído", published_url: "https://example.com", github_url: "https://github.com/example" },
        { id: 2, title: "Código", situacao: "Em Andamento", github_url: "https://github.com/example" },
        { id: 3, title: "Sem link", situacao: "Em Planejamento" }
    ]);

    assert.match(html, /href="https:\/\/example\.com"\s+target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /href="https:\/\/github\.com\/example"\s+target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /href="\/projetos#projeto-3"/);
    assert.match(html, /class="featured-ticker-group" aria-hidden="true"/);
    assert.equal((html.match(/tabindex="-1"/g) || []).length, 3);
    assert.doesNotMatch(html, /Concluído|Em Andamento|Em Planejamento/);

    const list = templates.render("projects.html", {
        SITEURL: "",
        SITENAME: "Fábrica",
        page: { title: "Projetos" },
        projects: [{ id: 3, title: "Sem link" }]
    });
    assert.match(list, /id="projeto-3"/);
});
