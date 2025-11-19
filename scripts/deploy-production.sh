#!/bin/bash

# Modern Teletext - Production Deployment Script
# This script automates the deployment process to Firebase

set -e  # Exit on error

echo "🚀 Modern Teletext - Production Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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
    echo -e "ℹ $1"
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

print_success "Firebase CLI is installed"

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "Not logged in to Firebase"
    echo "Run: firebase login"
    exit 1
fi

print_success "Logged in to Firebase"

# Confirm deployment
echo ""
print_warning "You are about to deploy to PRODUCTION"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    print_info "Deployment cancelled"
    exit 0
fi

echo ""
print_info "Starting deployment process..."
echo ""

# Step 1: Run tests
print_info "Step 1/7: Running tests..."
if npm test -- --passWithNoTests; then
    print_success "Frontend tests passed"
else
    print_error "Frontend tests failed"
    exit 1
fi

if cd functions && npm test -- --passWithNoTests && cd ..; then
    print_success "Functions tests passed"
else
    print_error "Functions tests failed"
    exit 1
fi

echo ""

# Step 2: Build Next.js application
print_info "Step 2/7: Building Next.js application..."
if npm run build; then
    print_success "Next.js build completed"
else
    print_error "Next.js build failed"
    exit 1
fi

echo ""

# Step 3: Build Cloud Functions
print_info "Step 3/7: Building Cloud Functions..."
if cd functions && npm run build && cd ..; then
    print_success "Functions build completed"
else
    print_error "Functions build failed"
    exit 1
fi

echo ""

# Step 4: Deploy Firestore rules and indexes
print_info "Step 4/7: Deploying Firestore rules and indexes..."
if firebase deploy --only firestore; then
    print_success "Firestore rules and indexes deployed"
else
    print_error "Firestore deployment failed"
    exit 1
fi

echo ""

# Step 5: Deploy Storage rules
print_info "Step 5/7: Deploying Storage rules..."
if firebase deploy --only storage; then
    print_success "Storage rules deployed"
else
    print_error "Storage deployment failed"
    exit 1
fi

echo ""

# Step 6: Deploy Cloud Functions
print_info "Step 6/7: Deploying Cloud Functions..."
if firebase deploy --only functions; then
    print_success "Cloud Functions deployed"
else
    print_error "Functions deployment failed"
    exit 1
fi

echo ""

# Step 7: Deploy Hosting
print_info "Step 7/7: Deploying Hosting..."
if firebase deploy --only hosting; then
    print_success "Hosting deployed"
else
    print_error "Hosting deployment failed"
    exit 1
fi

echo ""
echo "=========================================="
print_success "Deployment completed successfully! 🎉"
echo ""
print_info "Your application is now live at:"
echo "  https://teletext-eacd0.web.app/"
echo ""
print_info "Cloud Functions are available at:"
echo "  https://us-central1-teletext-eacd0.cloudfunctions.net/"
echo ""
print_info "Next steps:"
echo "  1. Test the production deployment"
echo "  2. Monitor Firebase Console for errors"
echo "  3. Check Performance Monitoring dashboard"
echo ""
