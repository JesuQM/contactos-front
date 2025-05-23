# Etapa de construcción: utiliza Node para instalar dependencias y compilar la aplicación
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción: usa Nginx para servir los archivos estáticos
FROM nginx:stable-alpine as production-stage
# Copia el contenido compilado al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
