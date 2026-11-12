module.exports = function createProjectModel(db) {
    const COLS = `
        id,
        slug,
        title,
        situacao,
        featured,
        github_url,
        published_url,
        short_description,
        created_at,
        updated_at
    `;

    async function ensureFeaturedColumn() {
        try {
            await db.query(
                "ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;"
            );
        } catch (_e) {}
    }

    async function queryWithSelfHealing(sql, params = []) {
        try {
            return await db.query(sql, params);
        } catch (err) {
            if (err.code === "42703") {
                await ensureFeaturedColumn();
                return await db.query(sql, params);
            }
            throw err;
        }
    }

    async function listAll() {
        const result = await queryWithSelfHealing(
            `SELECT ${COLS} FROM projects ORDER BY created_at DESC`
        );
        return result.rows;
    }

    async function listFeatured() {
        const result = await queryWithSelfHealing(
            `SELECT ${COLS} FROM projects WHERE featured = TRUE ORDER BY created_at DESC`
        );
        return result.rows;
    }

    async function findBySlug(slug) {
        const result = await queryWithSelfHealing(
            `SELECT ${COLS} FROM projects WHERE slug = $1 LIMIT 1`,
            [slug]
        );
        return result.rows[0] || null;
    }

    async function findById(id) {
        const result = await queryWithSelfHealing(
            `SELECT ${COLS} FROM projects WHERE id = $1 LIMIT 1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async function create(data) {
        const result = await queryWithSelfHealing(
            `INSERT INTO projects (
                slug,
                title,
                situacao,
                featured,
                github_url,
                published_url,
                short_description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`,
            [
                data.slug,
                data.title,
                data.situacao,
                Boolean(data.featured),
                data.github_url,
                data.published_url,
                data.short_description
            ]
        );
        return result.rows[0]?.id || null;
    }

    async function update(id, data) {
        const result = await queryWithSelfHealing(
            `UPDATE projects
            SET
                slug              = $2,
                title             = $3,
                situacao          = $4,
                featured          = $5,
                github_url        = $6,
                published_url     = $7,
                short_description = $8,
                updated_at        = NOW()
            WHERE id = $1
            RETURNING id`,
            [
                id,
                data.slug,
                data.title,
                data.situacao,
                Boolean(data.featured),
                data.github_url,
                data.published_url,
                data.short_description
            ]
        );
        return result.rowCount > 0;
    }

    async function remove(id) {
        const result = await queryWithSelfHealing("DELETE FROM projects WHERE id = $1", [id]);
        return result.rowCount > 0;
    }

    return { listAll, listFeatured, findBySlug, findById, create, update, remove };
};
