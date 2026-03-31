module.exports = function createAdminUserModel(db) {
    async function findByEmail(email) {
        const result = await db.query(
            `SELECT id, email, password_hash
             FROM admin_users
             WHERE email = $1
             LIMIT 1`,
            [email]
        );

        return result.rows[0] || null;
    }

    return {
        findByEmail
    };
};
