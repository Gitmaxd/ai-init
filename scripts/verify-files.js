#!/usr/bin/env node

/**
 * Pre-publish verification script
 * Checks that all necessary files are present and no package.json files
 * are included in the templates
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const access = promisify(fs.access);

// Required files and directories
const requiredPaths = [
  'bin/cli.js',
  'lib/installer.js',
  'lib/index.js',
  'lib/templates/next/rules.yaml',
  'lib/templates/next/.cursor/rules',
  'lib/templates/next/memory-bank',
  'lib/templates/next/mem-scripts',
  'lib/templates/next/doc-files/adr'
];

// Files that should NOT be included
const forbiddenFiles = [
  'lib/templates/next/package.json',
  'lib/templates/next/package-lock.json',
  'lib/templates/default/package.json',
  'lib/templates/default/package-lock.json'
];

/**
 * Check if a path exists
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>} - Whether the path exists
 */
async function pathExists(filePath) {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main verification function
 */
async function verifyFiles() {
  let hasErrors = false;
  const rootDir = path.resolve(__dirname, '..');
  
  console.log('🔍 Verifying package files before publishing...');
  
  // Check required paths
  for (const requiredPath of requiredPaths) {
    const fullPath = path.join(rootDir, requiredPath);
    const exists = await pathExists(fullPath);
    
    if (!exists) {
      console.error(`❌ Required file/directory missing: ${requiredPath}`);
      hasErrors = true;
    }
  }
  
  // Check forbidden files
  for (const forbiddenFile of forbiddenFiles) {
    const fullPath = path.join(rootDir, forbiddenFile);
    const exists = await pathExists(fullPath);
    
    if (exists) {
      console.error(`❌ Forbidden file found: ${forbiddenFile}`);
      hasErrors = true;
    }
  }
  
  // Final result
  if (hasErrors) {
    console.error('❌ Verification failed! Please fix the issues above before publishing.');
    process.exit(1);
  } else {
    console.log('✅ Verification passed! Package is ready to be published.');
  }
}

// Run verification
verifyFiles().catch(error => {
  console.error(`❌ Verification error: ${error.message}`);
  process.exit(1);
});
