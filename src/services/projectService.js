const createProjects = require("../data/projects");

module.exports = function createProjectService(rootDir) {
    const { projects, bySlug } = createProjects(rootDir);

    function getAllProjects() {
        return projects;
    }

    function getProjectBySlug(slug) {
        return bySlug[slug] || null;
    }

    function getProjectsBySlug() {
        return bySlug;
    }

    return {
        getAllProjects,
        getProjectBySlug,
        getProjectsBySlug
    };
};
