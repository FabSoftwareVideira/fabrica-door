const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const site = require("./config/site");
const createPageService = require("./services/pageService");
const createProjectService = require("./services/projectService");
const createSiteController = require("./controllers/siteController");
const createSiteRoutes = require("./routes/siteRoutes");

function createApp() {
    const app = express();

    const pageService = createPageService(site.rootDir);
    const projectService = createProjectService(site.rootDir);
    const pages = pageService.getAllPages();
    const projectsBySlug = projectService.getProjectsBySlug();

    nunjucks.configure(path.join(site.rootDir, "src", "views"), {
        autoescape: true,
        express: app,
        noCache: process.env.NODE_ENV !== "production"
    });

    app.set("view engine", "html");

    app.use("/assets", express.static(path.join(site.rootDir, "public", "assets")));
    app.use("/images", express.static(path.join(site.rootDir, "public", "assets", "images")));
    app.use("/videos", express.static(path.join(site.rootDir, "public", "assets", "videos")));

    const siteController = createSiteController({ site, pages, projectsBySlug });

    app.use(createSiteRoutes(siteController));
    app.use(siteController.notFound);

    return app;
}

module.exports = createApp;
