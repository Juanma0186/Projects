# Establece la imagen base
FROM python:3.11-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de requerimientos al contenedor
COPY requirements.txt .

# Instala las dependencias
RUN pip install -r requirements.txt

# Copia el resto del código al contenedor
COPY . .

# Comando para iniciar la aplicación
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
