-- Migration: create admin users and projects tables
-- Run once before starting the application.

CREATE TABLE IF NOT EXISTS admin_users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Projects
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id                  SERIAL PRIMARY KEY,
    slug                VARCHAR(255) NOT NULL UNIQUE,
    title               VARCHAR(512) NOT NULL,
    situacao            VARCHAR(100) NOT NULL DEFAULT 'Em Andamento',
    start_date          VARCHAR(100) NOT NULL DEFAULT '',
    end_date            VARCHAR(100) NOT NULL DEFAULT '',
    featured_image      TEXT NOT NULL DEFAULT '',
    gallery_list        JSONB NOT NULL DEFAULT '[]',
    github_url          TEXT NOT NULL DEFAULT '',
    published_url       TEXT NOT NULL DEFAULT '',
    technologies_list   JSONB NOT NULL DEFAULT '[]',
    members_list        JSONB NOT NULL DEFAULT '[]',
    key_features_list   JSONB NOT NULL DEFAULT '[]',
    content             TEXT NOT NULL DEFAULT '',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- Default admin user
-- Replace the password_hash below using:
--   node -e "const b=require('bcryptjs');b.hash('suasenha',12).then(h=>console.log(h))"
-- ----------------------------------------------------------------
INSERT INTO admin_users (email, password_hash)
VALUES ('fabricio.bizotto@ifc.edu.br', '$2a$12$UmQIx50AFpjzNPWzL.l76uQRTI4r6VSfih5euONgmOa9dX68EGieK')
ON CONFLICT (email) DO NOTHING;