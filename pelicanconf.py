#!/usr/bin/env python
# -*- coding: utf-8 -*- #
import os
from dotenv import load_dotenv

load_dotenv()  # Carrega as variáveis do .env

AUTHOR = 'Fábrica de Software'
SITENAME = os.getenv("SITE_NAME", "Fábrica de Software - IFC Videira")
SITEURL = os.getenv("SITE_URL", "http://localhost:8000")
PATH = os.getenv("CONTENT_PATH", "content")
OUTPUT_PATH = os.getenv("OUTPUT_PATH", "output")
THEME = "themes/fabrica"

STATIC_PATHS = ['images', 'videos']
PAGE_PATHS = ['pages', 'projetos']  # Subdiretórios para páginas e projetos
ARTICLE_PATHS = []

TIMEZONE = 'America/Sao_Paulo'
DEFAULT_LANG = 'pt-br'

# URLs padrão para páginas regulares (em pages/)
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'

# URLs específicas para projetos (em projetos/)
PROJETOS_URL = 'projetos/{slug}/'
PROJETOS_SAVE_AS = 'projetos/{slug}/index.html'

# # Aplica URLs específicas para o subdiretório projetos/
# for page_path in PAGE_PATHS:
#     if page_path == 'projetos':
#         globals()['{}_URL'.format(page_path.upper())] = PROJETOS_URL
#         globals()['{}_SAVE_AS'.format(page_path.upper())] = PROJETOS_SAVE_AS

# Configurações de menu
MENUITEMS = [
    ('Início', '/'),
    ('Sobre', '/sobre/'),
    ('Projetos', '/projetos/'),
    ('Equipe', '/equipe/'),
    ('Contato', '/contato/'),
]

# Plugins
PLUGIN_PATHS = ['plugins']
PLUGINS = ['minify_plugin', 'api_key_injector']

# Configurações adicionais
DEFAULT_PAGINATION = False

from datetime import datetime
JINJA_GLOBALS = {
    'current_year': datetime.now().year
}

EMAIL_FABRICA = 'fabricadesoftware.videira@ifc.edu.br'
GOOGLE_ANALYTICS = os.getenv("GOOGLE_ANALYTICS", "")
SOCIAL_LINKS = [
    ('instagram', 'https://www.instagram.com/fsw.ifcvideira/'),
    ('github', 'https://github.com/FabSoftwareVideira'),
    ('youtube', 'https://www.youtube.com/@FábricadeSoftwareCampusVideira')
]