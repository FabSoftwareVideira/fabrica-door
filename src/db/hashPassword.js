#!/usr/bin/env node
/**
 * Utility script to generate a bcrypt hash for a given password.
 * Usage:
 *   node src/db/hashPassword.js MinhaS3nh@
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
    console.error("Usage: node src/db/hashPassword.js <password>");
    process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
    console.log("Hash gerado:\n" + hash);
    console.log("\nUse o valor acima na tabela admin_users.password_hash.");
});
