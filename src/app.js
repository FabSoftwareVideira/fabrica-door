const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const site = require("./config/site");
const createPages = require("./data/pages");
const createProjects = require("./data/projects");
const createSiteController = require("./controllers/siteController");
const createSiteRoutes = require("./routes/siteRoutes");

function createApp() {
    const app = express();

    const pages = createPages(site.rootDir);
    const { bySlug: projectsBySlug } = createProjects(site.rootDir);

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
