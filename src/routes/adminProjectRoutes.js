const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = function createAdminProjectRoutes(requireAuth, adminProjectController) {
    const router = express.Router();

    router.use(requireAuth);
    router.get("/admin/projetos", asyncHandler(adminProjectController.list));
    router.get("/admin/projetos/novo", adminProjectController.newForm);
    router.post("/admin/projetos", asyncHandler(adminProjectController.create));
    router.get("/admin/projetos/:id/editar", asyncHandler(adminProjectController.editForm));
    router.post("/admin/projetos/:id", asyncHandler(adminProjectController.update));
    router.post("/admin/projetos/:id/excluir", asyncHandler(adminProjectController.remove));

    return router;
};
