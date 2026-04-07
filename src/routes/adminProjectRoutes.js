const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { uploadProjectImages } = require("../middlewares/uploadMiddleware");

module.exports = function createAdminProjectRoutes(requireAuth, adminProjectController) {
    const router = express.Router();

    router.use(requireAuth);
    router.get("/admin/projetos", asyncHandler(adminProjectController.list));
    router.get("/admin/projetos/novo", adminProjectController.newForm);
    router.post("/admin/projetos", uploadProjectImages, asyncHandler(adminProjectController.create));
    router.get("/admin/projetos/:id/editar", asyncHandler(adminProjectController.editForm));
    router.post("/admin/projetos/:id", uploadProjectImages, asyncHandler(adminProjectController.update));
    router.post("/admin/projetos/:id/excluir", asyncHandler(adminProjectController.remove));

    return router;
};
