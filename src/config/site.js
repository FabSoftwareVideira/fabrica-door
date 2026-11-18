const path = require("path");
const {
    DEFAULT_START,
    DEFAULT_END,
    DEFAULT_TIME_ZONE
} = require("../utils/christmasSeason");

const SITE_NAME = process.env.SITE_NAME || "Fábrica de Software - IFC Videira";
const SITE_URL = process.env.SITE_URL || "";
const APP_VERSION = process.env.IMAGE_TAG || "dev";
const APP_COMMIT = process.env.GIT_COMMIT || "unknown";
const APP_BUILD_DATE = process.env.BUILD_DATE || "";
const APP_IMAGE = process.env.IMAGE_NAME || ""; // opcional

module.exports = {
    rootDir: path.resolve(__dirname, "..", ".."),
    SITE_NAME,
    SITE_URL,
    EMAIL_FABRICA:
        process.env.EMAIL_FABRICA || "fabricadesoftware.videira@ifc.edu.br",
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS || "",
    API_KEY: process.env.API_KEY || "",
    // 🔽 EXPORTAR
    APP_VERSION,
    APP_COMMIT,
    APP_BUILD_DATE,
    APP_IMAGE,
    // Tema de Natal recorrente (MM-DD, válido para todos os anos)
    CHRISTMAS: {
        mode: process.env.CHRISTMAS_THEME || "auto",
        start: process.env.CHRISTMAS_START || DEFAULT_START,
        end: process.env.CHRISTMAS_END || DEFAULT_END,
        timeZone: process.env.CHRISTMAS_TIMEZONE || DEFAULT_TIME_ZONE
    },
    MENUITEMS: [
        { title: "Início", link: "/", path: "/" },
        { title: "Sobre", link: "/sobre", path: "/sobre" },
        { title: "Projetos", link: "/projetos", path: "/projetos" },
        { title: "Equipe", link: "/equipe", path: "/equipe" },
        { title: "Contato", link: "/contato", path: "/contato" }
    ],
    SOCIAL_LINKS: [
        { icon: "instagram", url: "https://www.instagram.com/fsw.ifcvideira/" },
        { icon: "github", url: "https://github.com/FabSoftwareVideira" },
        {
            icon: "youtube",
            url: "https://www.youtube.com/@FábricadeSoftwareCampusVideira"
        }
    ]
};