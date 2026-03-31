module.exports = function createProjectService(projectModel) {
    function normalizeProjectRow(row) {
        if (!row) {
            return null;
        }

        return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            situacao: row.situacao,
            start_date: row.start_date || "",
            end_date: row.end_date || "",
            featured_image: row.featured_image || "",
            galleryList: Array.isArray(row.gallery_list) ? row.gallery_list : [],
            github_url: row.github_url || "",
            published_url: row.published_url || "",
            technologiesList: Array.isArray(row.technologies_list) ? row.technologies_list : [],
            membersList: Array.isArray(row.members_list) ? row.members_list : [],
            key_featuresList: Array.isArray(row.key_features_list) ? row.key_features_list : [],
            url: `/projetos/${row.slug}`,
            content: row.content || "",
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }

    async function getAllProjects() {
        const rows = await projectModel.listAll();
        return rows.map(normalizeProjectRow);
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
        getProjectBySlug,
        getProjectById,
        createProject,
        updateProject,
        deleteProject
    };
};
