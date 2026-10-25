FROM node:24-bookworm-slim
WORKDIR /app
COPY --chown=node:node site/ ./
RUN mkdir -p storage && chown node:node storage
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4173
USER node
EXPOSE 4173
CMD ["node", "server.mjs"]
