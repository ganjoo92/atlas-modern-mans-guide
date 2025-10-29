#!/bin/bash

# Atlas Modern Man's Guide Deployment Script
# Usage: ./deploy.sh [dev|prod|staging]

set -e

ENV=${1:-dev}
PROJECT_NAME="atlas-modern-guide"

echo "🚀 Deploying Atlas Modern Man's Guide - Environment: $ENV"

# Function to check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."

    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    echo "✅ Requirements check passed"
}

# Function to setup environment
setup_environment() {
    echo "🔧 Setting up environment..."

    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "📝 Creating .env file from template..."
        cat > .env << EOF
# Atlas Modern Man's Guide Environment Variables

# Gemini AI API Key (Required for AI features)
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# App Configuration
VITE_APP_NAME=Atlas Modern Man's Guide
VITE_APP_VERSION=1.0.0

# Environment
NODE_ENV=$ENV

# Analytics (Optional)
VITE_POSTHOG_KEY=your-posthog-key-here
VITE_PLAUSIBLE_DOMAIN=your-domain.com

# Database (For future use)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
EOF
        echo "⚠️  Please edit .env file with your actual API keys before proceeding"
        echo "⚠️  Minimum required: VITE_GEMINI_API_KEY"
        return 1
    fi

    echo "✅ Environment setup complete"
}

# Function to deploy development
deploy_dev() {
    echo "🔨 Building development environment..."
    docker-compose --profile dev build
    echo "🚀 Starting development server..."
    docker-compose --profile dev up -d
    echo "✅ Development server started at http://localhost:5173"
}

# Function to deploy production
deploy_prod() {
    echo "🔨 Building production environment..."
    docker-compose --profile production build
    echo "🚀 Starting production server..."
    docker-compose --profile production up -d
    echo "✅ Production server started at http://localhost:80"
}

# Function to deploy to cloud platforms
deploy_cloud() {
    echo "☁️  Cloud deployment options:"
    echo ""
    echo "1. Render.com (Recommended for quick start):"
    echo "   - Connect your GitHub repo to Render"
    echo "   - Use the Dockerfile for deployment"
    echo "   - Set environment variables in Render dashboard"
    echo ""
    echo "2. Railway.app:"
    echo "   - Connect GitHub repo"
    echo "   - Railway will auto-detect Dockerfile"
    echo "   - Configure environment variables"
    echo ""
    echo "3. Fly.io:"
    echo "   - Run: fly launch"
    echo "   - Configure fly.toml"
    echo "   - Deploy: fly deploy"
    echo ""
    echo "4. AWS/DigitalOcean:"
    echo "   - Use Docker image with container services"
    echo "   - Configure load balancer and SSL"
}

# Function to show status
show_status() {
    echo "📊 Container Status:"
    docker-compose ps
    echo ""
    echo "📝 Logs (last 20 lines):"
    docker-compose logs --tail=20
}

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose down
    docker system prune -f
    echo "✅ Cleanup complete"
}

# Main deployment logic
case $ENV in
    "dev")
        check_requirements
        if setup_environment; then
            deploy_dev
            show_status
        fi
        ;;
    "prod")
        check_requirements
        if setup_environment; then
            deploy_prod
            show_status
        fi
        ;;
    "cloud")
        deploy_cloud
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 [dev|prod|cloud|status|cleanup]"
        echo ""
        echo "Commands:"
        echo "  dev     - Start development server (localhost:5173)"
        echo "  prod    - Start production server (localhost:80)"
        echo "  cloud   - Show cloud deployment instructions"
        echo "  status  - Show container status and logs"
        echo "  cleanup - Stop containers and cleanup"
        exit 1
        ;;
esac