#!/bin/bash
# AI Project Rules & Memory Scaffolding Installer

echo "📦 Installing AI Project Rules & Memory Scaffolding..."

# Create a temporary directory for the repository
TEMP_DIR=$(mktemp -d)
echo "🔧 Created temporary directory: $TEMP_DIR"

# Repository URL - Update this to the correct public repository
REPO_URL="https://github.com/Gitmaxd/rules-memory-scaffolding.git"

# Clone the repository into the temporary directory
echo "📥 Cloning the repository from $REPO_URL..."
if ! git clone --depth 1 "$REPO_URL" "$TEMP_DIR/repo" 2>/dev/null; then
  echo "❌ Failed to clone repository from $REPO_URL."
  echo "⚠️ Falling back to using local files from the current project..."
  
  # Check if we're running in the context of the original repository
  if [ -d ".cursor/rules" ] && [ -f "rules.yaml" ]; then
    echo "📂 Using local files from the current directory."
    # Just copy the files from the current directory structure
    mkdir -p "$TEMP_DIR/repo/.cursor/rules"
    mkdir -p "$TEMP_DIR/repo/doc-files/adr"
    mkdir -p "$TEMP_DIR/repo/memory-bank"
    mkdir -p "$TEMP_DIR/repo/mem-scripts"
    
    # Copy current directory files to temp directory
    cp -f .cursor/rules/*.mdc "$TEMP_DIR/repo/.cursor/rules/" 2>/dev/null || true
    cp -f doc-files/adr/*.md "$TEMP_DIR/repo/doc-files/adr/" 2>/dev/null || true
    cp -f memory-bank/*.md "$TEMP_DIR/repo/memory-bank/" 2>/dev/null || true
    cp -f mem-scripts/*.sh "$TEMP_DIR/repo/mem-scripts/" 2>/dev/null || true
    cp -f rules.yaml "$TEMP_DIR/repo/" 2>/dev/null || true
    cp -f README.md "$TEMP_DIR/repo/" 2>/dev/null || true
  else
    echo "❌ Failed to find local files. Installation aborted."
    rm -rf "$TEMP_DIR"
    exit 1
  fi
fi

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p .cursor/rules
mkdir -p doc-files/adr
mkdir -p memory-bank
mkdir -p mem-scripts

# Copy rule templates
echo "📝 Copying rule templates..."
cp -f "$TEMP_DIR/repo/.cursor/rules/"*.mdc .cursor/rules/ 2>/dev/null || echo "⚠️ No rule template files found."

# Copy validation script
echo "✅ Setting up validation script..."
if [ -f "$TEMP_DIR/repo/mem-scripts/validate.sh" ]; then
  cp -f "$TEMP_DIR/repo/mem-scripts/validate.sh" mem-scripts/validate.sh
  chmod +x mem-scripts/validate.sh
else
  echo "⚠️ Validation script not found."
  touch mem-scripts/validate.sh
  chmod +x mem-scripts/validate.sh
fi

# Copy README as AI-PROJECT-STARTER-README.md
echo "📚 Adding documentation..."
if [ -f "$TEMP_DIR/repo/README.md" ]; then
  cp -f "$TEMP_DIR/repo/README.md" AI-PROJECT-STARTER-README.md
else
  echo "⚠️ README.md not found."
  echo "# AI Project Rules & Memory Scaffolding" > AI-PROJECT-STARTER-README.md
  echo "Setup complete. See https://github.com/Gitmaxd/rules-memory-scaffolding for documentation." >> AI-PROJECT-STARTER-README.md
fi

# Copy rules.yaml
echo "⚙️ Setting up rules configuration..."
if [ -f "$TEMP_DIR/repo/rules.yaml" ]; then
  cp -f "$TEMP_DIR/repo/rules.yaml" rules.yaml
else
  echo "⚠️ rules.yaml not found."
  echo "# AI Project Rules Configuration" > rules.yaml
  echo "# This is a placeholder. Please visit https://github.com/Gitmaxd/rules-memory-scaffolding for documentation." >> rules.yaml
fi

# Create memory bank files
echo "🧠 Setting up memory bank..."
for file in projectbrief.md techContext.md systemPatterns.md activeContext.md progress.md roadmap.md; do
  if [ -f "$TEMP_DIR/repo/memory-bank/$file" ]; then
    cp -f "$TEMP_DIR/repo/memory-bank/$file" memory-bank/
  else
    echo "# $file" > "memory-bank/$file"
    echo "This is a placeholder file. Add your content here." >> "memory-bank/$file"
  fi
done

# Create example ADR files
echo "📋 Adding example architecture decision record..."
if [ -d "$TEMP_DIR/repo/doc-files/adr" ] && [ "$(ls -A "$TEMP_DIR/repo/doc-files/adr")" ]; then
  cp -f "$TEMP_DIR/repo/doc-files/adr/"*.md doc-files/adr/ 2>/dev/null
else
  echo "⚠️ No ADR files found."
  echo "# ADR Template" > doc-files/adr/template.md
  echo "This is a placeholder template for Architecture Decision Records." >> doc-files/adr/template.md
fi

# Clean up temporary directory
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "✨ Installation complete!"
echo "📖 Please read AI-PROJECT-STARTER-README.md for next steps"
