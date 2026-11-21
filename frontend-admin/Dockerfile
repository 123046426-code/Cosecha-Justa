FROM php:8.2-cli-alpine

WORKDIR /var/www/html

# Instalar extensiones necesarias para Laravel y curl
RUN apk add --no-cache \
    curl \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install bcmath

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar archivos del proyecto
COPY . .

# Permisos para storage y cache
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 8000

# Ejecutar el servidor web embebido de PHP sirviendo la carpeta public/
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
