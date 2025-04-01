const validateNpmPackageName = require('validate-npm-package-name');
const fs = require('fs-extra');
const path = require('path');

/**
 * Validates a project name for use as a directory or npm package
 * @param {string} name - Project name to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateProjectName(name) {
  if (!name) {
    return {
      isValid: false,
      errors: ['Project name is required']
    };
  }
  
  const npmValidation = validateNpmPackageName(name);
  
  if (!npmValidation.validForNewPackages) {
    return {
      isValid: false,
      errors: [
        ...(npmValidation.errors || []),
        ...(npmValidation.warnings || [])
      ]
    };
  }
  
  return {
    isValid: true,
    errors: []
  };
}

/**
 * Checks if a directory already exists and is not empty
 * @param {string} dirPath - Directory path to check
 * @returns {Promise<boolean>} - Whether directory exists and is not empty
 */
async function isDirectoryEmptyOrNonexistent(dirPath) {
  try {
    if (!await fs.pathExists(dirPath)) {
      return true;
    }
    
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch (error) {
    // If there's an error reading the directory, assume it's not usable
    return false;
  }
}

/**
 * Validates project structure for adding AI Project Starter to existing project
 * @param {string} projectPath - Path to the project
 * @returns {Promise<Object>} - Validation result with isValid and warnings
 */
async function validateExistingProject(projectPath) {
  const warnings = [];
  
  // Check for existing AI Project Starter files
  if (await fs.pathExists(path.join(projectPath, 'rules.yaml'))) {
    warnings.push('Project already has rules.yaml file. It will be preserved.');
  }
  
  if (await fs.pathExists(path.join(projectPath, '.cursor/rules'))) {
    warnings.push('Project already has .cursor/rules directory. Existing files will be preserved.');
  }
  
  if (await fs.pathExists(path.join(projectPath, 'memory-bank'))) {
    warnings.push('Project already has memory-bank directory. Existing files will be preserved.');
  }
  
  return {
    isValid: true,
    warnings
  };
}

module.exports = {
  validateProjectName,
  isDirectoryEmptyOrNonexistent,
  validateExistingProject
};
