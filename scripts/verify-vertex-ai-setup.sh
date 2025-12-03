#!/bin/bash

# Script to verify Vertex AI setup for Firebase App Hosting
# This script checks if all required APIs and permissions are configured

set -e

PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-teletext-eacd0}"
LOCATION="${GOOGLE_CLOUD_LOCATION:-us-central1}"

echo "🔍 Verifying Vertex AI Setup"
echo "================================"
echo "Project ID: $PROJECT_ID"
echo "Location: $LOCATION"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed"
    echo "   Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ gcloud CLI is installed"

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "❌ Not logged in to gcloud"
    echo "   Run: gcloud auth login"
    exit 1
fi

echo "✅ Logged in to gcloud"

# Set project
echo ""
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

# Check if Vertex AI API is enabled
echo ""
echo "🔍 Checking if Vertex AI API is enabled..."
if gcloud services list --enabled --filter="name:aiplatform.googleapis.com" --format="value(name)" | grep -q "aiplatform.googleapis.com"; then
    echo "✅ Vertex AI API is enabled"
else
    echo "❌ Vertex AI API is NOT enabled"
    echo ""
    echo "To enable it, run:"
    echo "  gcloud services enable aiplatform.googleapis.com"
    echo ""
    read -p "Would you like to enable it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Enabling Vertex AI API..."
        gcloud services enable aiplatform.googleapis.com
        echo "✅ Vertex AI API enabled"
    else
        echo "⚠️  Vertex AI API must be enabled for the AI features to work"
        exit 1
    fi
fi

# Check if Firebase App Hosting API is enabled
echo ""
echo "🔍 Checking if Firebase App Hosting API is enabled..."
if gcloud services list --enabled --filter="name:firebaseapphosting.googleapis.com" --format="value(name)" | grep -q "firebaseapphosting.googleapis.com"; then
    echo "✅ Firebase App Hosting API is enabled"
else
    echo "⚠️  Firebase App Hosting API is NOT enabled"
    echo "   This should be enabled automatically when using App Hosting"
fi

# Check service account permissions
echo ""
echo "🔍 Checking App Hosting service account..."
SERVICE_ACCOUNT="firebase-app-hosting-compute@${PROJECT_ID}.iam.gserviceaccount.com"
echo "Service Account: $SERVICE_ACCOUNT"

# Check if service account has Vertex AI User role
echo ""
echo "🔍 Checking IAM permissions..."
if gcloud projects get-iam-policy "$PROJECT_ID" --flatten="bindings[].members" --format="table(bindings.role)" --filter="bindings.members:$SERVICE_ACCOUNT AND bindings.role:roles/aiplatform.user" | grep -q "roles/aiplatform.user"; then
    echo "✅ Service account has Vertex AI User role"
else
    echo "❌ Service account does NOT have Vertex AI User role"
    echo ""
    echo "To grant the role, run:"
    echo "  gcloud projects add-iam-policy-binding $PROJECT_ID \\"
    echo "    --member=\"serviceAccount:$SERVICE_ACCOUNT\" \\"
    echo "    --role=\"roles/aiplatform.user\""
    echo ""
    read -p "Would you like to grant this role now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Granting Vertex AI User role..."
        gcloud projects add-iam-policy-binding "$PROJECT_ID" \
          --member="serviceAccount:$SERVICE_ACCOUNT" \
          --role="roles/aiplatform.user"
        echo "✅ Role granted"
    else
        echo "⚠️  Service account needs Vertex AI User role for AI features to work"
        exit 1
    fi
fi

echo ""
echo "================================"
echo "✅ Vertex AI setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Deploy your app: git push"
echo "2. Test page 500 in production"
echo ""
