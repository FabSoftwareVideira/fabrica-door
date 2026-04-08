const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");

const site = require("./config/site");
const db = require("./config/db");

// models
const createProjectModel = require("./models/projectModel");
const createAdminUserModel = require("./models/adminUserModel");

// services
const createPageService = require("./services/pageService");
const createProjectService = require("./services/projectService");
const createAuthService = require("./services/authService");

// controllers
const createSiteController = require("./controllers/siteController");
const createAuthController = require("./controllers/authController");
const createAdminProjectController = require("./controllers/adminProjectController");

// routes
const createSiteRoutes = require("./routes/siteRoutes");
const createAuthRoutes = require("./routes/authRoutes");
const createAdminProjectRoutes = require("./routes/adminProjectRoutes");

// middlewares
const createAuthMiddleware = require("./middlewares/authMiddleware");
const renderPage = require("./utils/renderPage");

function createApp() {
    const app = express();

    // body + cookies
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser());

    // models
    const projectModel = createProjectModel(db);
    const adminUserModel = createAdminUserModel(db);

    // services
    const pageService = createPageService(site.rootDir);
    const projectService = createProjectService(projectModel);
    const authService = createAuthService(adminUserModel);

    const pages = pageService.getAllPages();

    // nunjucks
    nunjucks.configure(path.join(site.rootDir, "src", "views"), {
        autoescape: true,
        express: app,
        noCache: process.env.NODE_ENV !== "production"
    });
    app.set("view engine", "html");

    // static assets
    app.use("/assets", express.static(path.join(site.rootDir, "public", "assets")));
    app.use("/images", express.static(path.join(site.rootDir, "public", "assets", "images")));
    app.use("/videos", express.static(path.join(site.rootDir, "public", "assets", "videos")));

    // controllers
    const siteController = createSiteController({ site, pages, projectService });
    const authController = createAuthController({ site, authService });
    const adminProjectController = createAdminProjectController({ site, projectService });

    // auth middleware
    const requireAuth = createAuthMiddleware(authService);

    // auth state para templates (ex.: botão de logout na navbar)
    app.use((req, res, next) => {
        const token = req.cookies?.auth_token;

        if (!token) {
            res.locals.isAuthenticated = false;
            return next();
        }

        try {
            res.locals.user = authService.verifyToken(token);
            res.locals.isAuthenticated = true;
        } catch (_error) {
            res.locals.isAuthenticated = false;
        }

        return next();
    });

    // routes
    app.use(createSiteRoutes(siteController));
    app.use(createAuthRoutes(authController));
    app.use(createAdminProjectRoutes(requireAuth, adminProjectController));

    // 404 catch-all
    app.use(siteController.notFound);

    // global error handler
    app.use((err, req, res, _next) => {
        console.error(`[ERROR] ${req.method} ${req.path}`, err);
        res.status(500);
        renderPage(res, site, {
            template: "page.html",
            page: {
                title: "Erro interno",
                content: `<h1>Erro interno</h1><p>Ocorreu um erro inesperado. Tente novamente.</p>`,
                show_header: false
            }
        });
    });

    return app;
}

module.exports = createApp;
