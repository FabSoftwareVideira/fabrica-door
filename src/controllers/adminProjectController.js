const renderPage = require("../utils/renderPage");

function parseList(input) {
    return String(input || "")
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function slugify(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function toFormProject(project) {
    if (!project) {
        return {
            title: "",
            slug: "",
            situacao: "Em Andamento",
            start_date: "",
            end_date: "",
            featured_image: "",
            github_url: "",
            published_url: "",
            gallery_list: "",
            technologies_list: "",
            members_list: "",
            key_features_list: "",
            content: ""
        };
    }

    return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        situacao: project.situacao,
        start_date: project.start_date,
        end_date: project.end_date,
        featured_image: project.featured_image,
        github_url: project.github_url,
        published_url: project.published_url,
        gallery_list: (project.galleryList || []).join("\n"),
        technologies_list: (project.technologiesList || []).join("\n"),
        members_list: (project.membersList || []).join("\n"),
        key_features_list: (project.key_featuresList || []).join("\n"),
        content: project.content
    };
}

function toProjectPayload(form) {
    const title = (form.title || "").trim();
    const slug = slugify(form.slug || title);

    return {
        title,
        slug,
        situacao: (form.situacao || "Em Andamento").trim(),
        start_date: (form.start_date || "").trim(),
        end_date: (form.end_date || "").trim(),
        featured_image: (form.featured_image || "").trim(),
        github_url: (form.github_url || "").trim(),
        published_url: (form.published_url || "").trim(),
        galleryList: parseList(form.gallery_list),
        technologiesList: parseList(form.technologies_list),
        membersList: parseList(form.members_list),
        key_featuresList: parseList(form.key_features_list),
        content: form.content || ""
    };
}

module.exports = function createAdminProjectController({ site, projectService }) {
    async function list(_req, res) {
        const projects = await projectService.getAllProjects();

        renderPage(res, site, {
            currentPath: "",
            template: "admin/projects-list.html",
            page: {
                title: "Gerenciar Projetos"
            },
            extra: {
                projects
            }
        });
    }

    function newForm(_req, res) {
        renderPage(res, site, {
            currentPath: "",
            template: "admin/project-form.html",
            page: {
                title: "Novo Projeto"
            },
            extra: {
                formMode: "create",
                formAction: "/admin/projetos",
                formProject: toFormProject(null),
                errorMessage: ""
            }
        });
    }

    async function create(req, res) {
        const payload = toProjectPayload(req.body);

        if (!payload.title || !payload.slug) {
            return renderPage(res, site, {
                currentPath: "",
                template: "admin/project-form.html",
                page: {
                    title: "Novo Projeto"
                },
                extra: {
                    formMode: "create",
                    formAction: "/admin/projetos",
                    formProject: req.body,
                    errorMessage: "Título e slug são obrigatórios."
                }
            });
        }

        await projectService.createProject(payload);
        return res.redirect("/admin/projetos");
    }

    async function editForm(req, res) {
        const project = await projectService.getProjectById(req.params.id);

        if (!project) {
            res.status(404);
            return renderPage(res, site, {
                template: "page.html",
                page: {
                    title: "Projeto não encontrado",
                    content: "<h1>Projeto não encontrado</h1>",
                    show_header: false
                }
            });
        }

        renderPage(res, site, {
            currentPath: "",
            template: "admin/project-form.html",
            page: {
                title: "Editar Projeto"
            },
            extra: {
                formMode: "edit",
                formAction: `/admin/projetos/${project.id}`,
                formProject: toFormProject(project),
                errorMessage: ""
            }
        });
    }

    async function update(req, res) {
        const payload = toProjectPayload(req.body);

        if (!payload.title || !payload.slug) {
            return renderPage(res, site, {
                currentPath: "",
                template: "admin/project-form.html",
                page: {
                    title: "Editar Projeto"
                },
                extra: {
                    formMode: "edit",
                    formAction: `/admin/projetos/${req.params.id}`,
                    formProject: {
                        ...req.body,
                        id: req.params.id
                    },
                    errorMessage: "Título e slug são obrigatórios."
                }
            });
        }

        await projectService.updateProject(req.params.id, payload);
        return res.redirect("/admin/projetos");
    }

    async function remove(req, res) {
        await projectService.deleteProject(req.params.id);
        return res.redirect("/admin/projetos");
    }

    return {
        list,
        newForm,
        create,
        editForm,
        update,
        remove
    };
};
