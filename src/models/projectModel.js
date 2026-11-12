module.exports = function createProjectModel(db) {
    const COLS = `
        id,
        slug,
        title,
        situacao,
        github_url,
        published_url,
        short_description,
        created_at,
        updated_at
    `;

    async function listAll() {
        const result = await db.query(
            `SELECT ${COLS} FROM projects ORDER BY created_at DESC`
        );
        return result.rows;
    }

    async function findBySlug(slug) {
        const result = await db.query(
            `SELECT ${COLS} FROM projects WHERE slug = $1 LIMIT 1`,
            [slug]
        );
        return result.rows[0] || null;
    }

    async function findById(id) {
        const result = await db.query(
            `SELECT ${COLS} FROM projects WHERE id = $1 LIMIT 1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async function create(data) {
        const result = await db.query(
            `INSERT INTO projects (
                slug,
                title,
                situacao,
                github_url,
                published_url,
                short_description
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`,
            [
                data.slug,
                data.title,
                data.situacao,
                data.github_url,
                data.published_url,
                data.short_description
            ]
        );
        return result.rows[0]?.id || null;
    }

    async function update(id, data) {
        const result = await db.query(
            `UPDATE projects
            SET
                slug              = $2,
                title             = $3,
                situacao          = $4,
                github_url        = $5,
                published_url     = $6,
                short_description = $7,
                updated_at        = NOW()
            WHERE id = $1
            RETURNING id`,
            [
                id,
                data.slug,
                data.title,
                data.situacao,
                data.github_url,
                data.published_url,
                data.short_description
            ]
        );
        return result.rowCount > 0;
    }

    async function remove(id) {
        const result = await db.query("DELETE FROM projects WHERE id = $1", [id]);
        return result.rowCount > 0;
    }

    return { listAll, findBySlug, findById, create, update, remove };
};
