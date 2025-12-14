#!/bin/bash

# AWS Deployment Script for RollMate
# Usage: ./deploy.sh

set -e  # Exit on error

echo "=========================================="
echo "RollMate - Deployment"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy env.production.example to .env and configure it."
    exit 1
fi

# Check if backend .env exists
if [ ! -f "back-end/.env" ]; then
    echo "❌ Error: back-end/.env file not found!"
    echo "Please copy back-end/.env.example to back-end/.env and configure it."
    exit 1
fi

echo "✅ Environment files found"
echo ""

# Load environment variables
source .env

# Check critical variables
if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "root" ] || [ "$DB_PASSWORD" = "CHANGE_THIS_TO_SECURE_PASSWORD" ]; then
    echo "❌ Error: DB_PASSWORD is not set or using default value!"
    echo "Please set a secure password in .env file"
    exit 1
fi

echo "✅ Environment variables validated"
echo ""

# Build and start services
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "❌ Error: Some services failed to start!"
    echo "Check logs with: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "✅ Services are running"
echo ""

# Generate APP_KEY if not set (after containers are running)
if [ -z "$APP_KEY" ]; then
    echo "⚠️  Warning: APP_KEY is not set!"
    echo "Generating APP_KEY..."
    docker-compose -f docker-compose.prod.yml exec backend php artisan key:generate || {
        echo "❌ Failed to generate APP_KEY. Please set it manually in back-end/.env"
        exit 1
    }
    echo "✅ APP_KEY generated"
fi
echo ""

# Run database migrations
echo "📊 Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force || {
    echo "⚠️  Warning: Migrations may have failed. Check logs."
}

echo ""
echo "⚡ Optimizing Laravel for production..."
docker-compose -f docker-compose.prod.yml exec -T backend php artisan config:cache || true
docker-compose -f docker-compose.prod.yml exec -T backend php artisan route:cache || true
docker-compose -f docker-compose.prod.yml exec -T backend php artisan view:cache || true

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Services Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "To restart services:"
echo "  docker-compose -f docker-compose.prod.yml restart"
echo ""

