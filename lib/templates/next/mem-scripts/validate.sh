#!/bin/bash

# AI Project Scaffolding Validator
# Script to validate project structure and rule compliance

echo "🔍 Validating AI Project Scaffolding..."
echo ""

# Initialize counters
warnings=0
errors=0

# Function to check if directory exists
check_directory() {
  if [ -d "$1" ]; then
    echo "✅ $2 exists"
  else
    echo "❌ ERROR: $2 missing"
    ((errors++))
  fi
}

# Function to check if file exists
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $2 exists"
  else
    echo "⚠️  WARNING: $2 missing"
    ((warnings++))
  fi
}

# Function to check file contents
check_content() {
  if [ -f "$1" ] && [ "$(grep -c "$3" "$1")" -gt 0 ]; then
    echo "✅ $2 contains valid content"
  else
    echo "⚠️  WARNING: $2 should contain $3"
    ((warnings++))
  fi
}

# Function to check for placeholder values
check_placeholders() {
  if [ -f "$1" ] && [ "$(grep -c "{{.*}}" "$1")" -gt 0 ]; then
    echo "⚠️  WARNING: $2 still contains placeholder values"
    ((warnings++))
  else
    echo "✅ $2 has no placeholder values"
  fi
}

# Function to count files with extension
count_files_with_extension() {
  local count=$(find "$1" -name "*.$2" | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "✅ Found $count files with .$2 extension in $1"
    return 0
  else
    echo "⚠️  WARNING: No .$2 files found in $1"
    ((warnings++))
    return 1
  fi
}

echo "1. Directory Structure Validation:"
echo "--------------------------------"
check_directory ".cursor/rules" ".cursor/rules directory"
check_directory "doc-files/adr" "doc-files/adr directory"
check_directory "memory-bank" "memory-bank directory"
echo ""

echo "2. Required Files Validation:"
echo "--------------------------------"
check_file "rules.yaml" "rules.yaml configuration file"
check_file "doc-files/adr/template.md" "ADR template"

# Check memory-bank files
for file in projectbrief.md techContext.md systemPatterns.md activeContext.md progress.md; do
  check_file "memory-bank/$file" "memory-bank/$file"
done
echo ""

echo "3. File Format Validation:"
echo "--------------------------------"
# Check rule files have .mdc extension and proper format
count_files_with_extension ".cursor/rules" "mdc"
if [ $? -eq 0 ]; then
  # Check at least one rule file has <rule> tags
  if grep -q "<rule>" .cursor/rules/*.mdc 2>/dev/null; then
    echo "✅ Rule files contain proper <rule> tags"
  else
    echo "⚠️  WARNING: Rule files should contain <rule> tags"
    ((warnings++))
  fi
fi

# Check ADR files
count_files_with_extension "doc-files/adr" "md"
echo ""

echo "4. Content Validation:"
echo "--------------------------------"
# Check rules.yaml for placeholder values
check_placeholders "rules.yaml" "rules.yaml"

# Check if memory-bank files have content
for file in projectbrief.md techContext.md systemPatterns.md activeContext.md progress.md; do
  if [ -f "memory-bank/$file" ] && [ "$(wc -l < "memory-bank/$file")" -lt 5 ]; then
    echo "⚠️  WARNING: memory-bank/$file has minimal content"
    ((warnings++))
  else
    echo "✅ memory-bank/$file has content"
  fi
done
echo ""

# Summary
echo "Validation Complete!"
echo "--------------------------------"
echo "Results: $errors errors, $warnings warnings"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
  echo "🎉 Project structure is fully compliant with all rules!"
  exit 0
elif [ $errors -eq 0 ]; then
  echo "⚠️  Project has warnings but no critical errors. Review warnings for improvements."
  exit 1
else
  echo "❌ Project has validation errors that should be fixed."
  exit 2
fi
