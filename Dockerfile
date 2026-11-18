
# Stage 1: Base
FROM node:24-alpine AS base

WORKDIR /app

RUN addgroup -g 10001 -S appgroup \
    && adduser -u 10001 -S appuser -G appgroup

# Stage 2: Development
FROM base AS development

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p public/assets/uploads \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

CMD ["npm", "run", "dev"]

# Stage 3: Build info
# O Dokploy não expõe o SHA do commit como variável de ambiente, então lemos o
# .git do contexto de build e gravamos o hash em build-info.json. O .git fica
# só neste estágio: a imagem final recebe apenas o JSON.
FROM node:24-alpine AS buildinfo

WORKDIR /app

# Permitem sobrescrever o commit/data quando o build não tem acesso ao .git.
ARG GIT_COMMIT=""
ARG BUILD_DATE=""

COPY . .

RUN GIT_COMMIT="$GIT_COMMIT" BUILD_DATE="$BUILD_DATE" \
    node scripts/generateBuildInfo.js

# Stage 4: Production
FROM base AS production

ENV NODE_ENV=production
ENV PORT=8000

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --chown=appuser:appgroup src ./src
COPY --chown=appuser:appgroup public ./public
COPY --chown=appuser:appgroup entrypoint.sh README.md LICENSE ./
COPY --from=buildinfo --chown=appuser:appgroup /app/build-info.json ./build-info.json

RUN mkdir -p public/assets/uploads \
    && chown -R appuser:appgroup public/assets/uploads \
    && chmod -R 755 public/assets/uploads \
    && sed -i 's/\r$//' entrypoint.sh \
    && chmod +x entrypoint.sh

USER appuser

EXPOSE 8000

ENTRYPOINT ["sh", "./entrypoint.sh"]

# # Stage 1: Base
# FROM node:25-alpine AS base
# WORKDIR /app
# # Criamos o grupo e usuário (usando IDs explícitos ajuda a evitar conflitos)
# RUN addgroup -g 10001 -S appgroup && adduser -u 10001 -S appuser -G appgroup

# # Stage 2: Development
# FROM base AS development
# COPY package.json ./
# RUN npm install
# COPY . .
# RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh
# USER appuser
# EXPOSE 8000
# ENTRYPOINT ["sh", "./entrypoint.sh"]

# # Stage 3: Production
# FROM base AS production
# COPY package.json ./
# RUN npm install --omit=dev

# # Copia os arquivos já definindo o dono como appuser
# COPY --chown=appuser:appgroup . .

# # Garante que a pasta de uploads exista e pertença ao appuser
# RUN mkdir -p /app/public/assets/uploads && \
#     chown -R appuser:appgroup /app/public/assets/uploads && \
#     chmod -R 755 /app/public/assets/uploads && \
#     sed -i 's/\r$//' entrypoint.sh && \
#     chmod +x entrypoint.sh

# USER appuser
# EXPOSE 8000
# ENTRYPOINT ["sh", "./entrypoint.sh"]