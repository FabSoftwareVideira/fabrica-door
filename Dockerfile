# Stage 1: Base
FROM node:25-alpine AS base
WORKDIR /app
# Criamos o grupo e usuário (usando IDs explícitos ajuda a evitar conflitos)
RUN addgroup -g 10001 -S appgroup && adduser -u 10001 -S appuser -G appgroup

# Stage 2: Development
FROM base AS development
COPY package.json ./
RUN npm install
COPY . .
RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh
USER appuser
EXPOSE 8000
ENTRYPOINT ["sh", "./entrypoint.sh"]

# Stage 3: Production
FROM base AS production
COPY package.json ./
RUN npm install --omit=dev

# Copia os arquivos já definindo o dono como appuser
COPY --chown=appuser:appgroup . .

# Garante que a pasta de uploads exista e pertença ao appuser
RUN mkdir -p /app/public/assets/uploads && \
    chown -R appuser:appgroup /app/public/assets/uploads && \
    chmod -R 755 /app/public/assets/uploads && \
    sed -i 's/\r$//' entrypoint.sh && \
    chmod +x entrypoint.sh

USER appuser
EXPOSE 8000
ENTRYPOINT ["sh", "./entrypoint.sh"]