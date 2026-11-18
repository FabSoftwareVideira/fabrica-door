const fs = require("fs");
const path = require("path");
const {
    DEFAULT_START,
    DEFAULT_END,
    DEFAULT_TIME_ZONE
} = require("../utils/christmasSeason");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const COMMIT_PATTERN = /^[0-9a-f]{7,40}$/i;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const BUILD_DATE_TIME_ZONE = "America/Sao_Paulo";
const SHORT_COMMIT_LENGTH = 7;

/**
 * Lê o build-info.json gerado no build da imagem (scripts/generateBuildInfo.js).
 * Sem o arquivo (ex.: rodando local), devolve um objeto vazio.
 */
function readBuildInfo(rootDir = ROOT_DIR) {
    try {
        const content = fs.readFileSync(
            path.join(rootDir, "build-info.json"),
            "utf8"
        );
        const parsed = JSON.parse(content);

        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_error) {
        return {};
    }
}

function normalizeCommit(value) {
    if (typeof value !== "string") return "";

    const commit = value.trim();

    return COMMIT_PATTERN.test(commit) ? commit.toLowerCase() : "";
}

function resolveCommit(env = process.env, buildInfo = {}) {
    // Variáveis explícitas ganham do que foi gravado no build.
    return (
        normalizeCommit(env.GIT_COMMIT) ||
        normalizeCommit(env.SOURCE_COMMIT) ||
        normalizeCommit(env.DOKPLOY_COMMIT_SHA) ||
        normalizeCommit(env.GITHUB_SHA) ||
        normalizeCommit(buildInfo.commit) ||
        ""
    );
}

function formatBuildDate(value) {
    if (typeof value !== "string" || !value.trim()) return "";

    const raw = value.trim();
    const dateOnly = DATE_ONLY_PATTERN.exec(raw);

    // Data sem hora: formata sem converter fuso, para não cair no dia anterior.
    if (dateOnly) {
        const [, year, month, day] = dateOnly;

        return `${day}/${month}/${year}`;
    }

    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) {
        return raw;
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: BUILD_DATE_TIME_ZONE
    })
        .format(date)
        .replace(",", "");
}

const buildInfo = readBuildInfo();
const SITE_NAME = process.env.SITE_NAME || "Fábrica de Software - IFC Videira";
const SITE_URL = process.env.SITE_URL || "";
const APP_VERSION = process.env.IMAGE_TAG || "dev";
const APP_COMMIT_FULL = resolveCommit(process.env, buildInfo);
const APP_COMMIT = APP_COMMIT_FULL
    ? APP_COMMIT_FULL.slice(0, SHORT_COMMIT_LENGTH)
    : "";
const APP_BUILD_DATE = formatBuildDate(
    process.env.BUILD_DATE || buildInfo.buildDate || ""
);
const APP_IMAGE = process.env.IMAGE_NAME || ""; // opcional

module.exports = {
    rootDir: ROOT_DIR,
    SITE_NAME,
    SITE_URL,
    EMAIL_FABRICA:
        process.env.EMAIL_FABRICA || "fabricadesoftware.videira@ifc.edu.br",
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS || "",
    API_KEY: process.env.API_KEY || "",
    // 🔽 EXPORTAR
    APP_VERSION,
    APP_COMMIT,
    APP_COMMIT_FULL,
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