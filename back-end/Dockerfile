FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Ensure storage & cache are writable
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose Laravel port
EXPOSE 8000

# Run Laravel dev server (bind to all interfaces INSIDE container)
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
