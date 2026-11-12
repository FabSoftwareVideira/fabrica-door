module.exports = function createProjects(_rootDir) {
    const projects = [
        {
            slug: "cogercon",
            title: "SGCE - Sistema de Gestão de Cooperativas de Energia",
            situacao: "Concluído",
            featured: true,
            github_url: "https://github.com/fabricaSoftwareVideira/Cogercon",
            published_url: "https://cogercon.videira.ifc.edu.br",
            short_description: "Sistema web para gestão de cooperativas de energia solar: cadastro de associados, usinas, cobranças e relatórios de faturamento.",
            url: "/projetos/cogercon"
        },
        {
            slug: "estagio",
            title: "E-Stagio - Sistema de Gestão de Estágios",
            situacao: "Em Andamento",
            github_url: "https://github.com/wanderson-rigo/e-stagio",
            published_url: "https://estagios.fsw-ifc.brdrive.net",
            short_description: "Plataforma digital para gerenciamento de estágios supervisionados: cadastro de empresas, orientadores e acompanhamento de atividades.",
            url: "/projetos/estagio"
        },
        {
            slug: "fabrica",
            title: "Fábrica de Software - IFC Videira",
            situacao: "Em Andamento",
            github_url: "https://github.com/FabSoftwareVideira/fabrica-door",
            published_url: "https://fabrica.videira.ifc.edu.br",
            short_description: "Site institucional da Fábrica de Software do IFC Campus Videira, apresentando projetos, equipe e informações de contato.",
            url: "/projetos/fabrica"
        },
        {
            slug: "games",
            title: "Fábrica de Software - Games",
            situacao: "Em Andamento",
            github_url: "https://github.com/FabSoftwareVideira/fabrica-games",
            published_url: "https://fabrica.videira.ifc.edu.br/games",
            short_description: "Coleção de jogos educacionais desenvolvidos para complementar o processo de ensino-aprendizagem de forma lúdica e interativa.",
            url: "/projetos/games"
        }
    ];

    const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

    return { projects, bySlug };
};
