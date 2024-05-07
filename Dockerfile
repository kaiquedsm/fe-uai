FROM node:18-slim AS build
WORKDIR /app

COPY . .
RUN npm install --force
RUN npm run build
# Serve Application using Nginx Server
FROM nginx:alpine
COPY --from=build /app/dist/fe-uai /usr/share/nginx/html
EXPOSE 80