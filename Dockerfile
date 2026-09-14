FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build
FROM node:24-bookworm-slim
WORKDIR /app
ENV HOST=0.0.0.0 PORT=4173 DATA_DIR=/app/data
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/scripts/start-local.mjs ./scripts/start-local.mjs
COPY --from=build /app/scripts/backup.mjs ./scripts/backup.mjs
EXPOSE 4173
CMD ["node","scripts/start-local.mjs"]


