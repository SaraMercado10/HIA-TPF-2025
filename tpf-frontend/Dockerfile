# --- ETAPA 1: Build ---
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ETAPA 2: Servir con Nginx ---
FROM nginx:alpine
# Eliminar la página por defecto
RUN rm -rf /usr/share/nginx/html/*
# Copiar SOLO el contenido de la carpeta browser/
COPY --from=build dist/tpf-frontend/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
