require("dotenv").config();
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

async function applyMigrations() {
    // 1. Cria tabela de controle se não existir
    await db.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            name VARCHAR(255) PRIMARY KEY,
            executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    // 2. Se a tabela projects já existia antes do controle de migrações,
    // marca 001 e 002 como executadas para não rodá-las novamente
    const checkProjects = await db.query(`
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'projects'
    `);

    const checkMigrationsCount = await db.query(`
        SELECT COUNT(*)::int AS count FROM schema_migrations
    `);

    if (checkProjects.rows.length > 0 && checkMigrationsCount.rows[0].count === 0) {
        await db.query(`
            INSERT INTO schema_migrations (name)
            VALUES ('001_initial.sql'), ('002_google_admin_password_hash.sql')
            ON CONFLICT (name) DO NOTHING
        `);
    }

    // 3. Lê todos os arquivos .sql do diretório migrations
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
        return;
    }

    const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

    // 4. Executa os arquivos pendentes
    const executedRows = await db.query("SELECT name FROM schema_migrations");
    const executedSet = new Set(executedRows.rows.map((r) => r.name));

    let executedCount = 0;
    for (const file of files) {
        if (!executedSet.has(file)) {
            console.log(`[MIGRATION] Aplicando migração: ${file}...`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, "utf8");

            await db.query(sql);

            await db.query(
                "INSERT INTO schema_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
                [file]
            );

            console.log(`[MIGRATION] ✓ ${file} aplicada com sucesso.`);
            executedCount++;
        }
    }

    if (executedCount === 0) {
        console.log("[MIGRATION] Banco de dados atualizado. Nenhuma migração pendente.");
    }
}

async function runMigrations(retries = 15, delayMs = 2000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await applyMigrations();
            return;
        } catch (err) {
            if (attempt === retries) {
                console.error("[MIGRATION] Erro fatal após", retries, "tentativas:", err.message);
                throw err;
            }
            console.warn(`[MIGRATION] Tentativa ${attempt}/${retries} - aguardando banco de dados (${err.message})...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}

if (require.main === module) {
    runMigrations()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error("[MIGRATION FALHOU]", err);
            process.exit(1);
        });
}

module.exports = runMigrations;
