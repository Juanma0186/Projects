# Establece la imagen base
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json al contenedor
COPY package.json .

# Instala las dependencias
RUN npm install

# Copia el resto del código al contenedor
COPY . .

# Inicia la aplicación
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
