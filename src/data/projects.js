const fs = require("fs");
const path = require("path");

function readHtml(baseDir, fileName) {
    return fs.readFileSync(path.join(baseDir, fileName), "utf8");
}

module.exports = function createProjects(rootDir) {
    const projectsDir = path.join(rootDir, "public", "projects");

    const projects = [
        {
            slug: "cogercon",
            title: "SGCE - Sistema de Gestão de Cooperativas de Energia",
            situacao: "Concluído",
            start_date: "Março 2024",
            end_date: "Dezembro 2024",
            galleryList: [
                "images/projects/fabrica/logo.svg",
                "images/projects/fabrica/logo.svg"
            ],
            github_url: "https://github.com/fabricaSoftwareVideira/Cogercon",
            technologiesList: [
                "HTML",
                "CSS",
                "JavaScript",
                "Python",
                "Django",
                "Tailwind CSS",
                "Docker",
                "PostgreSQL",
                "Git",
                "Gunicorn",
                "Nginx"
            ],
            membersList: [
                "Fabricio Bizotto (Professor)",
                "Tiago Lopes Gonçalves (Professor)",
                "Gabriel Sousa (Estudante)",
                "Paulo Sergio Pierdona (Estudante)",
                "Helder Martins (Estudante)"
            ],
            key_featuresList: [
                "Cadastro de associados",
                "Cadastro de usinas de geração de energia",
                "Cobrança de mensalidade e custos de manutenção das usinas",
                "Geração de relatórios de faturamento"
            ],
            url: "/projetos/cogercon",
            content: readHtml(projectsDir, "cogercon.html")
        },
        {
            slug: "estagio",
            title: "E-Stagio",
            situacao: "Concluído",
            start_date: "Março 2024",
            end_date: "Dezembro 2024",
            galleryList: ["images/projects/estagio/logo.png", "images/projects/estagio/gui.png"],
            github_url: "https://github.com/wanderson-rigo/e-stagio",
            published_url: "https://estagios.fsw-ifc.brdrive.net",
            technologiesList: ["HTML", "CSS", "JavaScript", "Python", "Flask", "Bootstrap", "SQLite"],
            membersList: ["Wanderson Rigo (Professor)", "Bruno Pergher (Estudante)"],
            key_featuresList: [
                "Cadastro de empresas",
                "Cadastro de orientadores",
                "Cadastro de estágios",
                "Gerenciamento de estágios",
                "Relatórios"
            ],
            url: "/projetos/estagio",
            content: readHtml(projectsDir, "estagio.html")
        },
        {
            slug: "fabrica",
            title: "Fabrica de Software - IFC Videira",
            situacao: "Concluído",
            start_date: "Março 2025",
            end_date: "Março 2025",
            galleryList: ["images/projects/fabrica/logo.svg", "images/projects/fabrica/fabrica-tela.png"],
            github_url: "https://github.com/fabricioifc/fabrica-door",
            published_url: "https://fabrica.videira.ifc.edu.br",
            technologiesList: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "Nunjucks"],
            membersList: ["Fabricio Bizotto (Professor)"],
            key_featuresList: ["Divulgação de projetos", "Portfólio da equipe", "Contato"],
            url: "/projetos/fabrica",
            content: readHtml(projectsDir, "fabrica.html")
        },
        {
            slug: "games",
            title: "Fábrica de Software - Games",
            situacao: "Em Andamento",
            start_date: "Março 2025",
            end_date: "",
            galleryList: [],
            github_url: "https://github.com/FabSoftwareVideira/fabrica-games",
            published_url: "https://fabrica.videira.ifc.edu.br/games",
            technologiesList: ["HTML", "CSS", "JavaScript"],
            membersList: ["Wanderson Rigo (Professor)"],
            key_featuresList: ["Jogos educacionais", "Aprendizado lúdico"],
            url: "/projetos/games",
            content: readHtml(projectsDir, "games.html")
        }
    ];

    const bySlug = Object.fromEntries(projects.map((project) => [project.slug, project]));

    return { projects, bySlug };
};