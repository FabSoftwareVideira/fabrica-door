const { Pool } = require("pg");

function getSslConfig() {
    if (process.env.PGSSLMODE === "require") {
        return { rejectUnauthorized: false };
    }

    return false;
}

const pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "fabrica_door",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    ssl: getSslConfig()
});

module.exports = {
    query(text, params) {
        return pool.query(text, params);
    }
};
