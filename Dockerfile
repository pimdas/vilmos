FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV SITE_MODE=website
COPY --chown=node:node package.json server.mjs ./
COPY --chown=node:node public/website ./public/website
COPY --chown=node:node public/orthozorg ./public/orthozorg
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
