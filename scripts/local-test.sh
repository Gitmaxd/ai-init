#!/bin/bash
# Script to test the ai-init package locally

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "🔧 Created temporary test directory: $TEMP_DIR"

# Navigate to the ai-init package directory
PACKAGE_DIR=$(pwd)
echo "📦 Package directory: $PACKAGE_DIR"

# Create a symbolic link to the package
echo "🔗 Creating symbolic link for local testing..."
npm link

# Create a test project using the linked package
echo "🚀 Testing project creation..."
cd $TEMP_DIR
npx ai-init test-project --verbose

# Display results
echo "✅ Test project created at: $TEMP_DIR/test-project"
echo "🔍 Examine the project structure to verify correct installation."
echo ""
echo "When finished testing, run: npm unlink -g ai-init"
echo "To clean up the test directory: rm -rf $TEMP_DIR"
