#!/bin/bash

# Script to check if Firebase emulators are running
# This helps developers quickly diagnose connection issues

echo "🔍 Checking Firebase emulators..."
echo ""

# Check if emulators are running on port 5001 (Functions)
if curl -s http://127.0.0.1:5001 > /dev/null 2>&1; then
  echo "✅ Firebase Functions emulator is running on port 5001"
else
  echo "❌ Firebase Functions emulator is NOT running on port 5001"
  echo ""
  echo "To start emulators:"
  echo "  npm run emulators:start"
  echo ""
  exit 1
fi

# Check if emulators are running on port 8080 (Firestore)
if curl -s http://127.0.0.1:8080 > /dev/null 2>&1; then
  echo "✅ Firestore emulator is running on port 8080"
else
  echo "⚠️  Firestore emulator is NOT running on port 8080"
fi

# Check if emulators are running on port 9199 (Storage)
if curl -s http://127.0.0.1:9199 > /dev/null 2>&1; then
  echo "✅ Storage emulator is running on port 9199"
else
  echo "⚠️  Storage emulator is NOT running on port 9199"
fi

# Check if emulators are running on port 4000 (Emulator UI)
if curl -s http://127.0.0.1:4000 > /dev/null 2>&1; then
  echo "✅ Emulator UI is running on port 4000"
  echo "   View at: http://127.0.0.1:4000"
else
  echo "⚠️  Emulator UI is NOT running on port 4000"
fi

echo ""
echo "✅ Firebase emulators are ready!"
echo ""
echo "Next steps:"
echo "  1. Start the dev server: npm run dev"
echo "  2. Open http://localhost:3000"
echo ""
