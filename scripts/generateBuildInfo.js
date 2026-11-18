#!/usr/bin/env node
/**
 * Gera build-info.json com o commit empacotado na imagem.
 *
 * O Dokploy não injeta o hash do commit no container (env vars de build não
 * incluem o SHA), então lemos o .git do contexto de build. Se o .git não
 * estiver disponível, o arquivo é gerado sem commit e o rodapé cai no
 * fallback antigo (IMAGE_TAG).
 */
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_FILE = "build-info.json";
const HASH_PATTERN = /^[0-9a-f]{7,40}$/i;
const FULL_HASH_PATTERN = /^[0-9a-f]{40}$/i;

function readGitCommit(rootDir) {
    const gitDir = path.join(rootDir, ".git");

    let head;

    try {
        head = fs.readFileSync(path.join(gitDir, "HEAD"), "utf8").trim();
    } catch (_error) {
        return null;
    }

    // HEAD destacado (detached) já contém o hash.
    if (FULL_HASH_PATTERN.test(head)) {
        return head.toLowerCase();
    }

    const refMatch = /^ref:\s*(.+)$/i.exec(head);

    if (!refMatch) {
        return null;
    }

    const ref = refMatch[1].trim();

    try {
        const value = fs.readFileSync(path.join(gitDir, ref), "utf8").trim();

        if (FULL_HASH_PATTERN.test(value)) {
            return value.toLowerCase();
        }
    } catch (_error) {
        // Refs podem estar empacotadas em packed-refs.
    }

    try {
        const packed = fs.readFileSync(
            path.join(gitDir, "packed-refs"),
            "utf8"
        );

        for (const line of packed.split(/\r?\n/)) {
            if (!line || line.startsWith("#") || line.startsWith("^")) {
                continue;
            }

            const [hash, name] = line.trim().split(/\s+/);

            if (name === ref && FULL_HASH_PATTERN.test(hash)) {
                return hash.toLowerCase();
            }
        }
    } catch (_error) {
        // Sem packed-refs: segue sem commit.
    }

    return null;
}

function resolveCommit(rootDir, env = process.env) {
    const fromEnvironment = [
        env.GIT_COMMIT,
        env.SOURCE_COMMIT,
        env.DOKPLOY_COMMIT_SHA,
        env.GITHUB_SHA
    ].find((value) => typeof value === "string" && HASH_PATTERN.test(value.trim()));

    if (fromEnvironment) {
        return fromEnvironment.trim().toLowerCase();
    }

    return readGitCommit(rootDir);
}

function createBuildInfo(rootDir = PROJECT_ROOT, env = process.env, now = new Date()) {
    const commit = resolveCommit(rootDir, env);

    return {
        commit: commit || null,
        shortCommit: commit ? commit.slice(0, 7) : null,
        buildDate: env.BUILD_DATE || now.toISOString()
    };
}

function writeBuildInfo(rootDir = PROJECT_ROOT, env = process.env, now = new Date()) {
    const info = createBuildInfo(rootDir, env, now);

    fs.writeFileSync(
        path.join(rootDir, OUTPUT_FILE),
        `${JSON.stringify(info, null, 2)}\n`
    );

    return info;
}

module.exports = {
    OUTPUT_FILE,
    readGitCommit,
    resolveCommit,
    createBuildInfo,
    writeBuildInfo
};

if (require.main === module) {
    try {
        const info = writeBuildInfo();

        console.log(
            info.shortCommit
                ? `[BUILD] Commit empacotado: ${info.shortCommit}`
                : "[BUILD] Commit indisponível, mantendo o fallback IMAGE_TAG."
        );
    } catch (error) {
        // Nunca derruba o build por causa do rodapé.
        console.warn(`[BUILD] Não foi possível gerar build-info.json: ${error.message}`);
    }
}
