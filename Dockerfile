# Stage 1: Base
FROM node:25-alpine AS base
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

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
COPY . .
RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh
USER appuser
EXPOSE 8000
ENTRYPOINT ["sh", "./entrypoint.sh"]

FROM production