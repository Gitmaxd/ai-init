#!/bin/bash
# Release script for ai-init npm package

set -e # Exit on any error

# Check if we're on the right branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
  echo "⚠️  Warning: You are on branch '$BRANCH' not 'main'"
  read -p "Are you sure you want to release from this branch? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting release."
    exit 1
  fi
fi

# Make sure we're up-to-date
echo "🔄 Updating dependencies..."
npm install

# Run tests and linting
echo "🧪 Running tests..."
npm test || { echo "❌ Tests failed. Aborting release."; exit 1; }

echo "🧹 Running linting..."
npm run lint || { echo "❌ Linting failed. Aborting release."; exit 1; }

# Prompt for version bump
echo "📦 Current version: $(npm pkg get version | tr -d '"')"
echo "Select version bump:"
echo "1) Patch (1.0.0 -> 1.0.1) - Bug fixes"
echo "2) Minor (1.0.0 -> 1.1.0) - New features, backward compatible"
echo "3) Major (1.0.0 -> 2.0.0) - Breaking changes"
echo "4) Custom version"

read -p "Enter your choice (1-4): " choice
case "$choice" in
  1) VERSION_TYPE="patch" ;;
  2) VERSION_TYPE="minor" ;;
  3) VERSION_TYPE="major" ;;
  4)
    read -p "Enter custom version: " CUSTOM_VERSION
    ;;
  *)
    echo "Invalid choice. Aborting."
    exit 1
    ;;
esac

# Bump version
if [ -n "$VERSION_TYPE" ]; then
  echo "🔖 Bumping $VERSION_TYPE version..."
  npm version $VERSION_TYPE
else
  echo "🔖 Setting custom version: $CUSTOM_VERSION..."
  npm version $CUSTOM_VERSION
fi

# Build the package for release
echo "🏗️  Building package..."
npm pack

# Display next steps
NEW_VERSION=$(npm pkg get version | tr -d '"')
echo "✅ Version $NEW_VERSION is ready for release!"
echo
echo "Next steps:"
echo "1. Verify the package contents:"
echo "   tar -xzf ai-init-$NEW_VERSION.tgz && ls -la package/"
echo
echo "2. Publish to npm registry:"
echo "   npm publish"
echo
echo "3. Push the release tag:"
echo "   git push && git push --tags"
