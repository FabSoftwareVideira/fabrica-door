const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const nunjucks = require("nunjucks");

const {
    OUTPUT_FILE,
    readGitCommit,
    resolveCommit,
    createBuildInfo,
    writeBuildInfo
} = require("../scripts/generateBuildInfo");

const PROJECT_ROOT = path.join(__dirname, "..");
const FULL_HASH = "0123456789abcdef0123456789abcdef01234567";
const OTHER_HASH = "fedcba9876543210fedcba9876543210fedcba98";

const templates = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(PROJECT_ROOT, "src", "views")),
    { autoescape: true }
);

const BASE = {
    SITEURL: "",
    SITENAME: "Fábrica",
    MENUITEMS: [],
    SOCIAL_LINKS: [],
    current_year: 2026,
    isChristmas: false
};

function createRepo({ head, refs = {}, packedRefs = null }) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-info-"));

    fs.mkdirSync(path.join(dir, ".git"), { recursive: true });
    fs.writeFileSync(path.join(dir, ".git", "HEAD"), `${head}\n`);

    Object.entries(refs).forEach(([name, value]) => {
        const file = path.join(dir, ".git", name);

        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, `${value}\n`);
    });

    if (packedRefs) {
        fs.writeFileSync(path.join(dir, ".git", "packed-refs"), packedRefs);
    }

    return dir;
}

function renderFooter(variables) {
    return templates.render("base.html", { ...BASE, ...variables });
}

test("lê o commit quando o HEAD está destacado", () => {
    const dir = createRepo({ head: FULL_HASH });

    assert.equal(readGitCommit(dir), FULL_HASH);
});

test("lê o commit a partir da ref apontada pelo HEAD", () => {
    const dir = createRepo({
        head: "ref: refs/heads/main",
        refs: { "refs/heads/main": FULL_HASH }
    });

    assert.equal(readGitCommit(dir), FULL_HASH);
});

test("encontra a ref no packed-refs quando não existe arquivo solto", () => {
    const dir = createRepo({
        head: "ref: refs/heads/main",
        packedRefs: [
            "# pack-refs with: peeled fully-peeled sorted",
            `${OTHER_HASH} refs/heads/outra`,
            `${FULL_HASH} refs/heads/main`
        ].join("\n")
    });

    assert.equal(readGitCommit(dir), FULL_HASH);
});

test("sem .git devolve null em vez de quebrar", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-info-vazio-"));

    assert.equal(readGitCommit(dir), null);
});

test("variáveis de ambiente têm prioridade sobre o .git", () => {
    const dir = createRepo({ head: FULL_HASH });

    assert.equal(resolveCommit(dir, { GIT_COMMIT: OTHER_HASH }), OTHER_HASH);
});

test("aceita SOURCE_COMMIT, DOKPLOY_COMMIT_SHA e GITHUB_SHA", () => {
    const dir = createRepo({ head: FULL_HASH });

    assert.equal(resolveCommit(dir, { SOURCE_COMMIT: OTHER_HASH }), OTHER_HASH);
    assert.equal(
        resolveCommit(dir, { DOKPLOY_COMMIT_SHA: OTHER_HASH }),
        OTHER_HASH
    );
    assert.equal(resolveCommit(dir, { GITHUB_SHA: OTHER_HASH }), OTHER_HASH);
});

test("ignora valores que não são hash e cai no .git", () => {
    const dir = createRepo({ head: FULL_HASH });

    assert.equal(resolveCommit(dir, { GIT_COMMIT: "latest" }), FULL_HASH);
    assert.equal(resolveCommit(dir, { GIT_COMMIT: "" }), FULL_HASH);
});

test("createBuildInfo encurta o commit e usa a data atual", () => {
    const dir = createRepo({ head: FULL_HASH });
    const now = new Date("2026-11-18T12:34:56.000Z");

    assert.deepEqual(createBuildInfo(dir, {}, now), {
        commit: FULL_HASH,
        shortCommit: FULL_HASH.slice(0, 7),
        buildDate: now.toISOString()
    });
});

test("BUILD_DATE informado é preservado", () => {
    const dir = createRepo({ head: FULL_HASH });
    const info = createBuildInfo(dir, { BUILD_DATE: "2026-12-01" });

    assert.equal(info.buildDate, "2026-12-01");
});

test("sem commit, o build-info fica sem hash", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-info-sem-git-"));
    const info = createBuildInfo(dir, {}, new Date("2026-11-18T12:00:00.000Z"));

    assert.equal(info.commit, null);
    assert.equal(info.shortCommit, null);
});

test("writeBuildInfo grava o JSON no diretório do projeto", () => {
    const dir = createRepo({ head: FULL_HASH });
    const info = writeBuildInfo(dir, {}, new Date("2026-11-18T12:34:56.000Z"));
    const raw = fs.readFileSync(path.join(dir, OUTPUT_FILE), "utf8");

    assert.deepEqual(JSON.parse(raw), info);
    assert.equal(info.shortCommit, FULL_HASH.slice(0, 7));
});

test("o rodapé mostra o commit no lugar de Versão: latest", () => {
    const html = renderFooter({
        APP_VERSION: "latest",
        APP_COMMIT: FULL_HASH.slice(0, 7),
        APP_COMMIT_FULL: FULL_HASH,
        APP_BUILD_DATE: "18/11/2026 09:34"
    });

    assert.match(html, /Commit:\s*<a class="footer-commit"/);
    assert.match(
        html,
        new RegExp(
            `href="https://github\\.com/FabSoftwareVideira/fabrica-door/commit/${FULL_HASH}"`
        )
    );
    assert.match(
        html,
        new RegExp(`title="Commit completo: ${FULL_HASH}"`)
    );
    assert.match(html, /0123456<\/a>/);
    assert.match(html, /Build: 18\/11\/2026 09:34/);
    assert.doesNotMatch(html, /Versão: latest/);
});

test("o rodapé cai na versão da imagem quando não há commit", () => {
    const html = renderFooter({
        APP_VERSION: "latest",
        APP_COMMIT: "",
        APP_COMMIT_FULL: "",
        APP_BUILD_DATE: ""
    });

    assert.match(html, /Versão: latest/);
    assert.doesNotMatch(html, /footer-commit/);
});

test("o rodapé mostra a tag da imagem junto do commit", () => {
    const html = renderFooter({
        APP_VERSION: "v2.0.0",
        APP_COMMIT: FULL_HASH.slice(0, 7),
        APP_COMMIT_FULL: FULL_HASH,
        APP_BUILD_DATE: ""
    });

    assert.match(html, /Commit:/);
    assert.match(html, /Versão: v2\.0\.0/);
});

test("a configuração do site lê o commit do ambiente", () => {
    const output = execFileSync(
        process.execPath,
        [
            "-e",
            `process.stdout.write(JSON.stringify(require(${JSON.stringify(
                path.join(PROJECT_ROOT, "src", "config", "site.js")
            )})))`
        ],
        {
            cwd: PROJECT_ROOT,
            env: {
                ...process.env,
                GIT_COMMIT: FULL_HASH,
                BUILD_DATE: "2026-12-01"
            },
            encoding: "utf8"
        }
    );

    const config = JSON.parse(output);

    assert.equal(config.APP_COMMIT_FULL, FULL_HASH);
    assert.equal(config.APP_COMMIT, FULL_HASH.slice(0, 7));
    assert.equal(config.APP_BUILD_DATE, "01/12/2026");
});

test("a configuração do site formata data e hora do build", () => {
    const output = execFileSync(
        process.execPath,
        [
            "-e",
            `process.stdout.write(JSON.stringify(require(${JSON.stringify(
                path.join(PROJECT_ROOT, "src", "config", "site.js")
            )})))`
        ],
        {
            cwd: PROJECT_ROOT,
            env: {
                ...process.env,
                GIT_COMMIT: "",
                SOURCE_COMMIT: "",
                DOKPLOY_COMMIT_SHA: "",
                GITHUB_SHA: "",
                BUILD_DATE: "2026-11-18T12:34:56.000Z"
            },
            encoding: "utf8"
        }
    );

    const config = JSON.parse(output);

    assert.equal(config.APP_BUILD_DATE, "18/11/2026 09:34");
});
