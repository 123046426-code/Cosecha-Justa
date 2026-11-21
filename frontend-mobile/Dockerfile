FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del proyecto móvil
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Puertos para Metro Bundler y Expo Web
EXPOSE 8081 19000 19006

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
