#!/bin/bash

# Kiroween Feature Testing Script
# This script tests all Halloween-themed features and enhancements

# Don't exit on error - we want to count failures
set +e

echo "🎃 KIROWEEN FEATURE TESTING 🎃"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
test_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $2"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}: $2"
    ((TESTS_FAILED++))
  fi
}

echo "1. Testing Halloween Theme Effects"
echo "-----------------------------------"

# Test theme context
npm test -- lib/__tests__/theme-context.test.tsx --silent 2>&1 > /dev/null
test_result $? "Theme context and Haunting Mode"

echo ""
echo "2. Testing Multi-Page Navigation"
echo "--------------------------------"

# Test multi-page navigation
npm test -- lib/__tests__/multi-page-navigation.test.ts --silent 2>&1 > /dev/null
test_result $? "Arrow key navigation for multi-page content"

echo ""
echo "3. Testing Environment Variable Validation"
echo "------------------------------------------"

# Test environment validation
npm test -- lib/__tests__/env-validation.test.ts --silent 2>&1 > /dev/null
test_result $? "Environment variable validation and error messages"

echo ""
echo "4. Testing Full-Screen Layout"
echo "-----------------------------"

# Test teletext utilities (wrapping, formatting)
npm test -- lib/__tests__/teletext-utils.test.ts --silent 2>&1 > /dev/null
test_result $? "Text wrapping and full-width content display"

echo ""
echo "5. Testing Content Adapters"
echo "---------------------------"

# Test all adapters
npm test -- functions/src/adapters/__tests__/StaticAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "Static adapter (pages 100-199)"

npm test -- functions/src/adapters/__tests__/NewsAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "News adapter (pages 200-299)"

npm test -- functions/src/adapters/__tests__/SportsAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "Sports adapter (pages 300-399)"

npm test -- functions/src/adapters/__tests__/MarketsAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "Markets adapter (pages 400-499)"

npm test -- functions/src/adapters/__tests__/AIAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "AI adapter with spooky stories (pages 500-599)"

npm test -- functions/src/adapters/__tests__/GamesAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "Games adapter (pages 600-699)"

npm test -- functions/src/adapters/__tests__/SettingsAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "Settings adapter with theme selection (pages 700-799)"

npm test -- functions/src/adapters/__tests__/DevAdapter.test.ts --silent 2>&1 > /dev/null
test_result $? "Dev adapter (pages 800-899)"

echo ""
echo "6. Testing Magazine Coverage"
echo "----------------------------"

# Test magazine coverage
npm test -- functions/src/__tests__/magazine-coverage.test.ts --silent 2>&1 > /dev/null
test_result $? "All magazine sections have working pages"

echo ""
echo "7. Testing UI Components"
echo "-----------------------"

# Test components
npm test -- components/__tests__/TeletextScreen.test.tsx --silent 2>&1 > /dev/null
test_result $? "TeletextScreen component"

npm test -- components/__tests__/CRTFrame.test.tsx --silent 2>&1 > /dev/null
test_result $? "CRTFrame with Halloween effects"

npm test -- components/__tests__/RemoteInterface.test.tsx --silent 2>&1 > /dev/null
test_result $? "RemoteInterface navigation"

npm test -- components/__tests__/PageRouter.test.tsx --silent 2>&1 > /dev/null
test_result $? "PageRouter with back navigation"

echo ""
echo "8. Testing HTML Sanitization"
echo "----------------------------"

# Test HTML sanitization
npm test -- functions/src/utils/__tests__/html-sanitizer.test.ts --silent 2>&1 > /dev/null
test_result $? "HTML sanitization for external content"

echo ""
echo "9. Testing Offline Support"
echo "-------------------------"

# Test offline support
npm test -- hooks/__tests__/useOfflineSupport.test.ts --silent 2>&1 > /dev/null
test_result $? "Offline cache fallback"

echo ""
echo "================================"
echo "🎃 KIROWEEN TEST SUMMARY 🎃"
echo "================================"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All Kiroween features are working! 🎉${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some tests failed. Review the output above. ⚠️${NC}"
  exit 1
fi
