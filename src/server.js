require("dotenv").config();

const createApp = require("./app");
const runMigrations = require("./db/migrate");

const port = Number(process.env.PORT || 8000);

async function start() {
    try {
        await runMigrations();
    } catch (err) {
        console.error("[SERVER] Falha ao executar migrações. Encerrando processo:", err);
        process.exit(1);
    }

    const app = createApp();

    app.listen(port, () => {
        console.log(`Servidor iniciado em http://localhost:${port}`);
    });
}

start();
