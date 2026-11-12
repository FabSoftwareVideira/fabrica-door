const renderPage = require("../utils/renderPage");

const VALID_SITUATIONS = ["Em Andamento", "Concluído", "Em Planejamento"];
const MAX_DESC = 300;

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

function isValidUrl(str) {
    if (!str) return true;
    try { new URL(str); return true; } catch { return false; }
}

function validatePayload(payload) {
    const errors = [];
    if (!payload.title) errors.push("Título é obrigatório.");
    if (!payload.slug) errors.push("Slug é obrigatório.");
    if (payload.slug && !/^[a-z0-9][a-z0-9-]*$/.test(payload.slug)) {
        errors.push("Slug inválido (apenas letras minúsculas, números e hífen).");
    }
    if (!VALID_SITUATIONS.includes(payload.situacao)) {
        errors.push("Situação inválida.");
    }
    if (!isValidUrl(payload.github_url)) errors.push("URL do GitHub inválida.");
    if (!isValidUrl(payload.published_url)) errors.push("URL do site inválida.");
    if (payload.short_description && payload.short_description.length > MAX_DESC) {
        errors.push(`Descrição deve ter no máximo ${MAX_DESC} caracteres.`);
    }
    return errors;
}

function toFormProject(project) {
    if (!project) {
        return {
            title: "",
            slug: "",
            situacao: "Em Andamento",
            featured: false,
            github_url: "",
            published_url: "",
            short_description: ""
        };
    }
    return {
        id: project.id,
        title: project.title,
        slug: project.slug,
        situacao: project.situacao,
        featured: Boolean(project.featured),
        github_url: project.github_url || "",
        published_url: project.published_url || "",
        short_description: project.short_description || ""
    };
}

function formProjectFromBody(body, id) {
    return {
        id: id || "",
        title: body.title || "",
        slug: body.slug || "",
        situacao: body.situacao || "Em Andamento",
        featured: body.featured === "true" || body.featured === "on" || body.featured === true,
        github_url: body.github_url || "",
        published_url: body.published_url || "",
        short_description: body.short_description || ""
    };
}

function toProjectPayload(form) {
    const title = (form.title || "").trim();
    const slug = slugify(form.slug || title);
    const featured = form.featured === "true" || form.featured === "on" || form.featured === true;
    return {
        title,
        slug,
        situacao: (form.situacao || "Em Andamento").trim(),
        featured,
        github_url: (form.github_url || "").trim(),
        published_url: (form.published_url || "").trim(),
        short_description: (form.short_description || "").trim().slice(0, MAX_DESC)
    };
}

module.exports = function createAdminProjectController({ site, projectService }) {
    async function list(_req, res) {
        const projects = await projectService.getAllProjects();
        renderPage(res, site, {
            currentPath: "",
            template: "admin/projects-list.html",
            page: { title: "Gerenciar Projetos" },
            extra: { projects }
        });
    }

    function newForm(_req, res) {
        renderPage(res, site, {
            currentPath: "",
            template: "admin/project-form.html",
            page: { title: "Novo Projeto" },
            extra: {
                formMode: "create",
                formAction: "/admin/projetos",
                formProject: toFormProject(null),
                maxDesc: MAX_DESC,
                errors: []
            }
        });
    }

    async function create(req, res) {
        const payload = toProjectPayload(req.body);
        const errors = validatePayload(payload);

        if (errors.length > 0) {
            return renderPage(res, site, {
                currentPath: "",
                template: "admin/project-form.html",
                page: { title: "Novo Projeto" },
                extra: {
                    formMode: "create",
                    formAction: "/admin/projetos",
                    formProject: formProjectFromBody(req.body),
                    maxDesc: MAX_DESC,
                    errors
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
            page: { title: "Editar Projeto" },
            extra: {
                formMode: "edit",
                formAction: `/admin/projetos/${project.id}`,
                formProject: toFormProject(project),
                maxDesc: MAX_DESC,
                errors: []
            }
        });
    }

    async function update(req, res) {
        const payload = toProjectPayload(req.body);
        const errors = validatePayload(payload);

        if (errors.length > 0) {
            return renderPage(res, site, {
                currentPath: "",
                template: "admin/project-form.html",
                page: { title: "Editar Projeto" },
                extra: {
                    formMode: "edit",
                    formAction: `/admin/projetos/${req.params.id}`,
                    formProject: formProjectFromBody(req.body, req.params.id),
                    maxDesc: MAX_DESC,
                    errors
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

    return { list, newForm, create, editForm, update, remove };
};
