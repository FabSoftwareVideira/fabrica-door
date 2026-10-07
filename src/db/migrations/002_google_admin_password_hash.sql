-- Corrige registros de admins criados via Google, que não têm senha local.
UPDATE admin_users
SET password_hash = ''
WHERE password_hash IS NULL;

ALTER TABLE admin_users
    ALTER COLUMN password_hash SET DEFAULT '';
