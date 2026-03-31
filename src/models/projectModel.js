module.exports = function createProjectModel(db) {
    async function listAll() {
        const result = await db.query(
            `SELECT
                id,
                slug,
                title,
                situacao,
                start_date,
                end_date,
                featured_image,
                gallery_list,
                github_url,
                published_url,
                technologies_list,
                members_list,
                key_features_list,
                content,
                created_at,
                updated_at
            FROM projects
            ORDER BY created_at DESC`
        );

        return result.rows;
    }

    async function findBySlug(slug) {
        const result = await db.query(
            `SELECT
                id,
                slug,
                title,
                situacao,
                start_date,
                end_date,
                featured_image,
                gallery_list,
                github_url,
                published_url,
                technologies_list,
                members_list,
                key_features_list,
                content,
                created_at,
                updated_at
            FROM projects
            WHERE slug = $1
            LIMIT 1`,
            [slug]
        );

        return result.rows[0] || null;
    }

    async function findById(id) {
        const result = await db.query(
            `SELECT
                id,
                slug,
                title,
                situacao,
                start_date,
                end_date,
                featured_image,
                gallery_list,
                github_url,
                published_url,
                technologies_list,
                members_list,
                key_features_list,
                content,
                created_at,
                updated_at
            FROM projects
            WHERE id = $1
            LIMIT 1`,
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
                start_date,
                end_date,
                featured_image,
                gallery_list,
                github_url,
                published_url,
                technologies_list,
                members_list,
                key_features_list,
                content
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7::jsonb,
                $8,
                $9,
                $10::jsonb,
                $11::jsonb,
                $12::jsonb,
                $13
            )
            RETURNING id`,
            [
                data.slug,
                data.title,
                data.situacao,
                data.start_date,
                data.end_date,
                data.featured_image,
                JSON.stringify(data.galleryList),
                data.github_url,
                data.published_url,
                JSON.stringify(data.technologiesList),
                JSON.stringify(data.membersList),
                JSON.stringify(data.key_featuresList),
                data.content
            ]
        );

        return result.rows[0]?.id || null;
    }

    async function update(id, data) {
        const result = await db.query(
            `UPDATE projects
            SET
                slug = $2,
                title = $3,
                situacao = $4,
                start_date = $5,
                end_date = $6,
                featured_image = $7,
                gallery_list = $8::jsonb,
                github_url = $9,
                published_url = $10,
                technologies_list = $11::jsonb,
                members_list = $12::jsonb,
                key_features_list = $13::jsonb,
                content = $14,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id`,
            [
                id,
                data.slug,
                data.title,
                data.situacao,
                data.start_date,
                data.end_date,
                data.featured_image,
                JSON.stringify(data.galleryList),
                data.github_url,
                data.published_url,
                JSON.stringify(data.technologiesList),
                JSON.stringify(data.membersList),
                JSON.stringify(data.key_featuresList),
                data.content
            ]
        );

        return result.rowCount > 0;
    }

    async function remove(id) {
        const result = await db.query("DELETE FROM projects WHERE id = $1", [id]);
        return result.rowCount > 0;
    }

    return {
        listAll,
        findBySlug,
        findById,
        create,
        update,
        remove
    };
};
