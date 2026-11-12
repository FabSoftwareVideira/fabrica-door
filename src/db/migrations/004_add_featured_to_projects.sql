-- Migration 004: adiciona campo featured para projetos de destaque
ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;
