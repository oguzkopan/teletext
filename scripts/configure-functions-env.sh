#!/bin/bash

# Modern Teletext - Configure Firebase Functions Environment Variables
# This script helps set up environment variables for Cloud Functions

set -e

echo "🔧 Firebase Functions Environment Configuration"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

print_success "Firebase CLI is installed"
echo ""

# Display current configuration
print_info "Current Firebase Functions configuration:"
echo ""
firebase functions:config:get || print_warning "No configuration found"
echo ""

# Prompt for configuration
print_info "Let's configure your API keys..."
echo ""

# News API
read -p "Enter your NewsAPI key (or press Enter to skip): " NEWS_API_KEY
if [ ! -z "$NEWS_API_KEY" ]; then
    firebase functions:config:set news.api_key="$NEWS_API_KEY"
    print_success "News API key configured"
fi

# Sports API
read -p "Enter your Sports API key (or press Enter to skip): " SPORTS_API_KEY
if [ ! -z "$SPORTS_API_KEY" ]; then
    firebase functions:config:set sports.api_key="$SPORTS_API_KEY"
    print_success "Sports API key configured"
fi

# Alpha Vantage (Markets)
read -p "Enter your Alpha Vantage API key (or press Enter to skip): " ALPHA_VANTAGE_KEY
if [ ! -z "$ALPHA_VANTAGE_KEY" ]; then
    firebase functions:config:set markets.alpha_vantage_key="$ALPHA_VANTAGE_KEY"
    print_success "Alpha Vantage API key configured"
fi

# OpenWeather
read -p "Enter your OpenWeather API key (or press Enter to skip): " OPENWEATHER_KEY
if [ ! -z "$OPENWEATHER_KEY" ]; then
    firebase functions:config:set weather.api_key="$OPENWEATHER_KEY"
    print_success "OpenWeather API key configured"
fi

echo ""

# Set Google Cloud configuration
print_info "Configuring Google Cloud settings..."
firebase functions:config:set google.project_id="teletext-eacd0"
firebase functions:config:set google.location="us-central1"
print_success "Google Cloud configuration set"

echo ""
print_info "Final configuration:"
firebase functions:config:get

echo ""
print_success "Configuration complete!"
echo ""
print_warning "Important: You need to redeploy your functions for changes to take effect"
echo "Run: firebase deploy --only functions"
echo ""
