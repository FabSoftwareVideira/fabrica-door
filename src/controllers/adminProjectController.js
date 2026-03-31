const renderPage = require("../utils/renderPage");

const VALID_SITUATIONS = ["Em Andamento", "Concluído", "Em Planejamento"];

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
    if (!isValidUrl(payload.published_url)) errors.push("URL publicada inválida.");
    if (!payload.membersList.length) errors.push("Informe ao menos um membro da equipe.");
    return errors;
}

function toFormProject(project) {
    if (!project) {
        return {
            title: "",
            slug: "",
            situacao: "Em Andamento",
            start_date: "",
            end_date: "",
            featured_image_existing: "",
            github_url: "",
            published_url: "",
            gallery_existing_list: [],
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
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        featured_image_existing: project.featured_image || "",
        github_url: project.github_url || "",
        published_url: project.published_url || "",
        gallery_existing_list: project.galleryList || [],
        technologies_list: (project.technologiesList || []).join("\n"),
        members_list: (project.membersList || []).join("\n"),
        key_features_list: (project.key_featuresList || []).join("\n"),
        content: project.content || ""
    };
}

function formProjectFromBody(body, id) {
    return {
        id: id || "",
        title: body.title || "",
        slug: body.slug || "",
        situacao: body.situacao || "Em Andamento",
        start_date: body.start_date || "",
        end_date: body.end_date || "",
        featured_image_existing: body.featured_image_existing || "",
        github_url: body.github_url || "",
        published_url: body.published_url || "",
        gallery_existing_list: parseList(body.gallery_existing || ""),
        technologies_list: body.technologies_list || "",
        members_list: body.members_list || "",
        key_features_list: body.key_features_list || "",
        content: body.content || ""
    };
}

function toProjectPayload(form, files = {}) {
    const title = (form.title || "").trim();
    const slug = slugify(form.slug || title);

    const featuredFiles = files.featured_image_file || [];
    const featured_image =
        featuredFiles.length > 0
            ? `assets/uploads/${featuredFiles[0].filename}`
            : (form.featured_image_existing || "").trim();

    const existingGallery = parseList(form.gallery_existing || "");
    const uploadedGallery = (files.gallery_files || []).map(
        (f) => `assets/uploads/${f.filename}`
    );

    return {
        title,
        slug,
        situacao: (form.situacao || "Em Andamento").trim(),
        start_date: (form.start_date || "").trim(),
        end_date: (form.end_date || "").trim(),
        featured_image,
        github_url: (form.github_url || "").trim(),
        published_url: (form.published_url || "").trim(),
        galleryList: [...existingGallery, ...uploadedGallery],
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
                errors: []
            }
        });
    }

    async function create(req, res) {
        const payload = toProjectPayload(req.body, req.files || {});
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
                errors: []
            }
        });
    }

    async function update(req, res) {
        const payload = toProjectPayload(req.body, req.files || {});
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
