module.exports = function createProjectService(projectModel) {
    const STATUS_CLASS = {
        "Em Andamento": "andamento",
        "Concluído": "concluido",
        "Em Planejamento": "planejamento"
    };

    function normalizeProjectRow(row) {
        if (!row) return null;
        return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            situacao: row.situacao,
            statusClass: STATUS_CLASS[row.situacao] || "desconhecido",
            featured: Boolean(row.featured),
            github_url: row.github_url || "",
            published_url: row.published_url || "",
            short_description: row.short_description || "",
            url: `/projetos/${row.slug}`,
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }

    async function getAllProjects() {
        const rows = await projectModel.listAll();
        return rows.map(normalizeProjectRow);
    }

    async function getFeaturedProjects() {
        if (projectModel.listFeatured) {
            const rows = await projectModel.listFeatured();
            return rows.map(normalizeProjectRow);
        }
        const all = await getAllProjects();
        return all.filter((p) => p.featured);
    }

    async function getProjectBySlug(slug) {
        const row = await projectModel.findBySlug(slug);
        return normalizeProjectRow(row);
    }

    async function getProjectById(id) {
        const row = await projectModel.findById(id);
        return normalizeProjectRow(row);
    }

    async function createProject(data) {
        return projectModel.create(data);
    }

    async function updateProject(id, data) {
        return projectModel.update(id, data);
    }

    async function deleteProject(id) {
        return projectModel.remove(id);
    }

    return {
        getAllProjects,
        getFeaturedProjects,
        getProjectBySlug,
        getProjectById,
        createProject,
        updateProject,
        deleteProject
    };
};
