const express = require("express");

module.exports = function createSiteRoutes(controller) {
    const router = express.Router();

    router.get("/health", controller.health);
    router.get(["/", "/index.html"], controller.index);
    router.get("/sobre", controller.sobre);
    router.get("/projetos", controller.projetos);
    router.get("/equipe", controller.equipe);
    router.get("/contato", controller.contato);
    router.get("/projetos/:slug", controller.projetoPorSlug);

    return router;
};
