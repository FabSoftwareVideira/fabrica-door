FROM python:3.13-slim AS builder

WORKDIR /app

# Copiar apenas requirements para aproveitar cache
COPY requirements.txt .
# upgrade pip
RUN pip install --no-cache-dir --upgrade pip
# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o projeto para o builder
COPY . .

# Gerar o site estático
ARG CONTENT_PATH=content
ARG OUTPUT_PATH=output
ARG CONFIG_FILE=pelicanconf.py
RUN pelican ${CONTENT_PATH} -o ${OUTPUT_PATH} -s ${CONFIG_FILE}

# Imagem final
FROM python:3.13-slim

WORKDIR /app

# ✅ Instalar curl para o healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Garantir que o PATH inclua os binários do Python instalados
ENV PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/lib/python3.13/site-packages/.bin:$PATH"
ENV PYTHONPATH="/usr/local/lib/python3.13/site-packages:$PYTHONPATH"

# Copiar o output gerado, dependências e binários do Pelican
COPY --from=builder /app/output ./output

# Copiar arquivos de configuração e scripts necessários
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Criar usuário não-root e ajustar permissões de escrita
RUN useradd -m -r pelicanuser && \
    chown -R pelicanuser:pelicanuser /app && \
    chmod -R 755 /app/output

USER pelicanuser

# Definir o entrypoint
ENTRYPOINT ["./entrypoint.sh"]