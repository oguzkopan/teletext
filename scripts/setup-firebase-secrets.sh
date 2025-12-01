#!/bin/bash

# Script to set up Firebase App Hosting secrets
# This keeps API keys secure and out of version control

echo "🔐 Setting up Firebase App Hosting Secrets"
echo "==========================================="
echo ""
echo "This script will help you securely store API keys as Firebase secrets."
echo "The secrets will be encrypted and stored in Google Cloud Secret Manager."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase."
    echo "Run: firebase login"
    exit 1
fi

echo "📝 Reading API keys from .env.local..."
echo ""

# Source the .env.local file to get the values
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)
else
    echo "❌ .env.local file not found!"
    exit 1
fi

# Function to set a secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if [ -z "$secret_value" ]; then
        echo "⚠️  Skipping $secret_name (not set in .env.local)"
        return
    fi
    
    echo "Setting $secret_name..."
    echo "$secret_value" | firebase apphosting:secrets:set "$secret_name" --data-file=- 2>&1
    
    if [ $? -eq 0 ]; then
        echo "✅ $secret_name set successfully"
    else
        echo "❌ Failed to set $secret_name"
        echo "   You may need to set it manually or check permissions"
    fi
    echo ""
}

echo "🔑 Setting up secrets..."
echo ""

# Set each secret
set_secret "NEWS_API_KEY" "$NEWS_API_KEY"
set_secret "SPORTS_API_KEY" "$SPORTS_API_KEY"
set_secret "ALPHA_VANTAGE_API_KEY" "$ALPHA_VANTAGE_API_KEY"
set_secret "COINGECKO_API_KEY" "$COINGECKO_API_KEY"
set_secret "OPENWEATHER_API_KEY" "$OPENWEATHER_API_KEY"

echo ""
echo "✅ Secret setup complete!"
echo ""

# Grant access to the backend
echo "🔐 Granting backend access to secrets..."
echo ""

# Get the backend name
BACKEND_NAME=$(firebase apphosting:backends:list --json 2>/dev/null | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$BACKEND_NAME" ]; then
    echo "⚠️  Could not detect backend name automatically."
    echo "   Please grant access manually:"
    echo "   firebase apphosting:secrets:grantaccess NEWS_API_KEY,SPORTS_API_KEY,ALPHA_VANTAGE_API_KEY,COINGECKO_API_KEY,OPENWEATHER_API_KEY --backend=YOUR_BACKEND_NAME"
else
    echo "Detected backend: $BACKEND_NAME"
    firebase apphosting:secrets:grantaccess NEWS_API_KEY,SPORTS_API_KEY,ALPHA_VANTAGE_API_KEY,COINGECKO_API_KEY,OPENWEATHER_API_KEY --backend="$BACKEND_NAME"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend access granted successfully"
    else
        echo "❌ Failed to grant backend access"
        echo "   Please grant access manually with:"
        echo "   firebase apphosting:secrets:grantaccess NEWS_API_KEY,SPORTS_API_KEY,ALPHA_VANTAGE_API_KEY,COINGECKO_API_KEY,OPENWEATHER_API_KEY --backend=$BACKEND_NAME"
    fi
fi

echo ""
echo "📋 Next steps:"
echo "1. Commit and push the updated apphosting.yaml"
echo "2. Firebase will automatically use the secrets in your next deployment"
echo "3. Your API keys are now secure and not in version control"
echo ""
echo "To view secrets: firebase apphosting:secrets:access SECRET_NAME"
echo "To update a secret: echo 'new_value' | firebase apphosting:secrets:set SECRET_NAME --data-file=-"
