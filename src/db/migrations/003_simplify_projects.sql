-- Migration 003: simplifica tabela projects
-- Remove colunas não utilizadas e renomeia content -> short_description

ALTER TABLE projects
    DROP COLUMN IF EXISTS featured_image,
    DROP COLUMN IF EXISTS gallery_list,
    DROP COLUMN IF EXISTS technologies_list,
    DROP COLUMN IF EXISTS members_list,
    DROP COLUMN IF EXISTS key_features_list,
    DROP COLUMN IF EXISTS start_date,
    DROP COLUMN IF EXISTS end_date;

-- Renomeia content para short_description (descrição curta) ou cria caso não exista
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects' AND column_name = 'content'
    ) THEN
        ALTER TABLE projects RENAME COLUMN content TO short_description;
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'projects' AND column_name = 'short_description'
    ) THEN
        ALTER TABLE projects ADD COLUMN short_description TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Garante o valor padrão
ALTER TABLE projects
    ALTER COLUMN short_description SET DEFAULT '';

-- Atualiza os dados existentes para short_description conter apenas texto simples
-- (trunca o HTML existente a 300 caracteres e remove tags)
UPDATE projects
SET short_description = LEFT(
    REGEXP_REPLACE(short_description, '<[^>]+>', '', 'g'),
    300
)
WHERE short_description IS NOT NULL;
