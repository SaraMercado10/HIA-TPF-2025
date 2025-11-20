# --- ETAPA 1: Build/Install ---
# Usar una imagen ligera de Node 18
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- ETAPA 2: Run ---
FROM node:18-alpine
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

# El backend corre en el puerto 3000
EXPOSE 3000

# El comando para iniciar el servidor
CMD ["node", "index.js"]