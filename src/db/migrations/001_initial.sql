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

-- ----------------------------------------------------------------
-- Inserindo um projeto da Fábrica
-- ----------------------------------------------------------------
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

INSERT INTO projects (slug, title, situacao, start_date, end_date, featured_image, gallery_list, github_url, published_url, technologies_list, members_list, key_features_list, content)
VALUES (
    'cogercon',
    'SGCE - Sistema de Gestão de Cooperativas de Energia',
    'Concluído',
    'Março 2024',
    'Dezembro 2024',
    'images/projects/fabrica/logo.svg',
    '["images/projects/fabrica/logo.svg","images/projects/fabrica/logo.svg"]',
    'https://github.com/fabricaSoftwareVideira/Cogercon',
    'https://cogercon.videira.ifc.edu.br',
    '["HTML","CSS","JavaScript","Python","Django","Tailwind CSS","Docker","PostgreSQL","Git","Gunicorn","Nginx"]',
    '["Fabricio Bizotto (Professor)","Tiago Lopes Gonçalves (Professor)","Gabriel Sousa (Estudante)","Paulo Sergio Pierdona (Estudante)","Helder Martins (Estudante)"]',
    '["Cadastro de associados","Cadastro de usinas de geração de energia","Cobrança de mensalidade e custos de manutenção das usinas","Geração de relatórios de faturamento"]',
    '<h2>Sobre o Projeto</h2> <p> A <a href="https://cogercon.coop.br" target="_blank" rel="noopener noreferrer">Cogercon</a> é uma cooperativa de energia solar com a finalidade de fornecer energia elétrica para seus cooperados. Para isso, a cooperativa necessita de um sistema de gestão que possibilite o controle de suas atividades. </p> <p> O sistema de gestão de cooperativas de energia (SGCE) é um sistema web que auxilia no cadastro de associados, cadastro de usinas de geração de energia, cobrança de mensalidade e custos de manutenção, além da geração de relatórios de faturamento. </p> <h2>Objetivo</h2> <p> Desenvolver um sistema de gestão de cooperativas de energia que possibilite à Cogercon a gestão completa de suas atividades. </p> <h2>Público-alvo</h2> <ul> <li>Cooperados da Cogercon</li> <li>Funcionários e gestores da Cogercon</li> </ul> <h2>Processo de Desenvolvimento</h2> <ol> <li><strong>Levantamento de Requisitos:</strong> reuniões com a equipe da Cogercon para entender as necessidades da cooperativa.</li> <li><strong>Prototipação:</strong> desenvolvimento e validação dos protótipos com a equipe parceira.</li> <li><strong>Desenvolvimento:</strong> implementação do sistema com Python e Django.</li> <li><strong>Testes:</strong> validação das funcionalidades para aderência aos requisitos.</li> <li><strong>Implantação:</strong> publicação em VPS para uso da equipe da Cogercon.</li> </ol> <h2>Benefícios</h2> <ul> <li><strong>Automatização de Processos:</strong> redução de processos manuais.</li> <li><strong>Eficiência Operacional:</strong> mais agilidade nas rotinas administrativas.</li> <li><strong>Geração de Boletos:</strong> cobrança estruturada de mensalidades e manutenção.</li> <li><strong>Relatórios Gerenciais:</strong> suporte à tomada de decisão.</li> </ul>'
);

INSERT INTO projects (slug, title, situacao, start_date, end_date, featured_image, gallery_list, github_url, published_url, technologies_list, members_list, key_features_list, content)
VALUES (
    'estagio',
    'E-Stagio - Sistema de Gestão de Estágios',
    'Em Andamento',
    'Março 2024',
    '',
    'images/projects/estagio/logo.png',
    '["images/projects/estagio/logo.png","images/projects/estagio/gui.png"]',
    'https://github.com/FabSoftwareVideira/fabrica-estagios',
    'https://estagios.fsw-ifc.brdrive.net',
    '["HTML","CSS","JavaScript","Python","Flask","Bootstrap","SQLite"]',
    '["Wanderson Rigo (Professor)","Bruno Pergher (Estudante)"]',
    '["Cadastro de empresas","Cadastro de orientadores","Cadastro de estágios","Gerenciamento de estágios","Relatórios"]',
    '<h2>E-Stagio</h2> <p> O E-Stágio é uma plataforma digital desenvolvida para simplificar o gerenciamento de estágios, oferecendo um meio prático e centralizado de registro e acompanhamento das atividades. O sistema é responsivo, adaptando-se a computadores e dispositivos móveis. </p> <p> Disponível online em <a href="https://estagios.fsw-ifc.brdrive.net" target="_blank" rel="noopener noreferrer">estagios.fsw-ifc.brdrive.net</a>. </p> <h2>Objetivo</h2> <p> Plataforma web para gerir, otimizar e automatizar os processos de estágios supervisionados no IFC Videira. </p> <h2>Público-alvo</h2> <ul> <li>Alunos do curso técnico em Informática.</li> <li>Professores do IFC Videira, como orientadores ou supervisores de estágio.</li> <li>TAEs do IFC Videira, como orientadores ou supervisores de estágio.</li> <li>Servidores do setor de estágio do IFC Videira.</li> <li>Supervisores de estágio das empresas concedentes.</li> </ul> <h2>Processo de Desenvolvimento</h2> <p> Projeto de extensão desenvolvido ao longo de 2024 no IFC Videira, coordenado pelo professor Wanderson Rigo e com desenvolvimento pelo aluno Bruno Vinicius Pergher no contexto de TCC. </p> <p>Descrição técnica:</p> <ul> <li>Desenvolvido em Python</li> <li>Banco de dados PostgreSQL</li> <li>Executado em contêiner Docker</li> <li>Hospedado em servidor Linux</li> </ul> <h2>Benefícios</h2> <ul> <li>Economia de tempo e papel</li> <li>Simplificação de tarefas burocráticas</li> <li>Comunicação eficiente entre estagiários, supervisores e orientadores</li> <li>Acompanhamento contínuo das atividades</li> </ul>'
);

INSERT INTO projects (slug, title, situacao, start_date, end_date, featured_image, gallery_list, github_url, published_url, technologies_list, members_list, key_features_list, content)
VALUES (
    'games',
    'Fábrica de Software - Games',
    'Em Andamento',
    'Março 2025',
    '',
    'assets/uploads/1775580943813-logo.svg',
    '[]',
    'https://github.com/FabSoftwareVideira/fabrica-games',
    'https://fabrica.videira.ifc.edu.br/games',
    '["HTML","CSS","JavaScript"]',
    '["Wanderson Rigo (Professor)"]',
    '["Jogos educacionais","Aprendizado lúdico"]',
    '<p> Este projeto é dedicado ao desenvolvimento de jogos educacionais, com o objetivo de promover o aprendizado de forma lúdica e interativa. </p> <h2>Objetivo</h2> <p> Criar uma coleção de jogos educacionais para complementar o processo de ensino-aprendizagem, tornando-o mais divertido e eficaz. </p> <h2>Público-alvo</h2> <ul> <li>Professores e alunos do IFC Campus Videira</li> <li>Estudantes interessados em desenvolvimento de jogos</li> </ul> <h2>Benefícios</h2> <ul> <li>Estímulo ao aprendizado interativo</li> <li>Desenvolvimento de habilidades de programação e design de jogos</li> <li>Promoção de trabalho em equipe</li> <li>Criação de recursos educacionais acessíveis e gratuitos</li> </ul> <h2>Deployment</h2> <p> O projeto conta com CI/CD configurado com GitHub Actions, e está disponível em <a href="https://fabrica.videira.ifc.edu.br/games" target="_blank" rel="noopener noreferrer">fabrica.videira.ifc.edu.br/games</a>. </p>'
);