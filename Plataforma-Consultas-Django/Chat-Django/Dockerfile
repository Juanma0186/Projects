# Usar una imagen base de Python
FROM python:3.11-alpine


# Instalar dependencias del sistema
RUN apk add --no-cache gcc musl-dev linux-headers libffi-dev

# Establecer un directorio de trabajo
WORKDIR /app

# Copiar el archivo de requerimientos al contenedor
COPY requirements.txt .

# Instalar las dependencias
RUN pip install -r requirements.txt

# Copiar el resto del código de la aplicación al contenedor
COPY . .

# Ejecutar la aplicación
CMD ["daphne", "-u", "/tmp/daphne.sock", "mysite.asgi:application"]
