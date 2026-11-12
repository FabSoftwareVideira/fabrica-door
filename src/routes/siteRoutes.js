const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");

module.exports = function createSiteRoutes(controller) {
    const router = express.Router();

    router.get("/health", controller.health);
    router.get(["/", "/index.html"], controller.index);
    router.get("/sobre", controller.sobre);
    router.get("/projetos", asyncHandler(controller.projetos));
    router.get("/projetos/:slug", (_req, res) => res.redirect("/projetos"));
    router.get("/equipe", controller.equipe);
    router.get("/contato", controller.contato);

    return router;
};
