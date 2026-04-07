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
INSERT INTO admin_users (email, password_hash)
VALUES ('fabricio.bizotto@gmail.com', '$2a$12$UmQIx50AFpjzNPWzL.l76uQRTI4r6VSfih5euONgmOa9dX68EGieK')
ON CONFLICT (email) DO NOTHING;

-- Inserindo um projeto da Fábrica
INSERT INTO projects (slug, title, situacao, start_date, end_date, featured_image, gallery_list, github_url, published_url, technologies_list, members_list, key_features_list, content)
VALUES (
    'fabrica-de-software',
    'Fabrica de Software - IFC Videira',
    'Concluído',
    'Março 2025',
    'Abril 2026',
    'assets/uploads/1775580943813-logo.svg',
    '["assets/uploads/1775580943814-fabrica-tela.png"]',
    'https://github.com/FabSoftwareVideira/fabrica-door',
    'https://fabrica.videira.ifc.edu.br/',
    '["Node.js", "Express", "PostgreSQL", "HTML/CSS"]',
    '["Fabricio Bizotto"]',
    '["Divulgação de projetos", "Equipe", "Contato"]',
    '<p>A Fábrica de Software é um ambiente de desenvolvimento de software criado para auxiliar professores e alunos na execução de projetos de software. Este projeto foi criado para divulgar o trabalho da nossa equipe e incentivar a criação de novos projetos.</p><h2>Objetivo</h2><p>O principal objetivo deste projeto é criar uma presença online para a Fábrica de Software do IFC Campus Videira, apresentando nossos projetos, equipe e capacidades para a comunidade acadêmica e profissional.</p><h2>Público-alvo</h2><ul><li>Professores e alunos do IFC Campus Videira</li><li>Comunidade em geral</li><li>Potenciais parceiros para projetos</li></ul><h2>Processo de Desenvolvimento</h2><p>O site foi desenvolvido utilizando o gerador de sites estáticos Pelican, que permite uma fácil manutenção e publicação de conteúdo. O design foi criado pensando na identidade visual do IFC e com foco em uma experiência de usuário intuitiva.</p><h2>Benefícios</h2><ul><li>Maior visibilidade dos projetos desenvolvidos pela Fábrica de Software</li><li>Facilidade para interessados entrarem em contato com a equipe</li><li>Documentação e showcasing dos trabalhos realizados</li><li>Plataforma para compartilhamento de conhecimento através do blog</li></ul>'
);