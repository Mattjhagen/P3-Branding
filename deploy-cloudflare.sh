#!/bin/bash

# P³ Lending - Cloudflare Pages Deployment Script
# This script helps prepare and deploy the P³ Lending platform to Cloudflare Pages

set -e

echo "🚀 P³ Lending - Cloudflare Pages Deployment"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Checking project structure..."

# Verify required files exist
required_files=("package.json" "vite.config.js" "public/CNAME" "src/main.tsx")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done

print_success "Project structure verified"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env.local
        print_warning "Please edit .env.local with your actual configuration before deploying"
    else
        print_error "env.example not found. Please create .env.local manually."
        exit 1
    fi
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Build the project
print_status "Building project for production..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not created"
    exit 1
fi

print_success "Build completed successfully"

# Check if CNAME file exists in dist
if [ ! -f "dist/CNAME" ]; then
    print_warning "CNAME file not found in dist. Copying from public..."
    cp public/CNAME dist/CNAME
fi

# Display deployment information
echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps for Cloudflare Pages deployment:"
echo ""
echo "1. Go to https://dash.cloudflare.com"
echo "2. Navigate to Pages → Create a project"
echo "3. Connect to Git → Select 'Mattjhagen/p3-netlify'"
echo "4. Configure build settings:"
echo "   - Framework preset: Vite"
echo "   - Build command: npm run build"
echo "   - Build output directory: dist"
echo "   - Root directory: / (leave empty)"
echo ""
echo "5. Add environment variables in Pages settings"
echo "6. Add custom domain: p3lending.space"
echo ""
echo "📖 For detailed instructions, see: CLOUDFLARE_DEPLOYMENT.md"
echo ""

# Optional: Deploy using Wrangler (if installed)
if command -v wrangler &> /dev/null; then
    echo "🔧 Wrangler detected. Would you like to deploy now? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Deploying to Cloudflare Pages..."
        wrangler pages deploy dist --project-name p3-lending
        print_success "Deployment completed!"
    fi
else
    print_warning "Wrangler not installed. Install with: npm install -g wrangler"
    print_warning "Or deploy manually through the Cloudflare dashboard"
fi

echo ""
print_success "P³ Lending platform ready for Cloudflare Pages deployment! 🚀"
