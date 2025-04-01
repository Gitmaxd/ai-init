const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs functions
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const symlink = promisify(fs.symlink);
const access = promisify(fs.access);

/**
 * Error class for installation errors
 */
class InstallerError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'InstallerError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Validates a project name with basic npm package name rules
 * @param {string} name - Project name to validate
 * @returns {object} - Object with validation results
 */
function validateProjectName(name) {
  // Basic validation rules for npm package names
  const nameRegex = /^[a-zA-Z0-9-_\.]+$/;
  const validForNewPackages = nameRegex.test(name) && name.length > 0 && name.length <= 214;
  
  return {
    validForNewPackages,
    errors: validForNewPackages ? [] : ['Project name contains invalid characters or is too long.']
  };
}

/**
 * Check if a path exists
 * @param {string} path - Path to check
 * @returns {Promise<boolean>} - Whether the path exists
 */
async function pathExists(path) {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Creates a new directory with AI Project Starter scaffolding
 * @param {string} projectName - Name of the directory to create
 * @param {Object} options - Configuration options
 * @returns {string} - Path to the created directory
 * @throws {InstallerError} - If creation fails
 */
async function createProject(projectName, options = {}) {
  // Validate project name
  const nameValidation = validateProjectName(projectName);
  if (!nameValidation.validForNewPackages) {
    throw new InstallerError(
      `Invalid directory name: ${projectName}`,
      'INVALID_NAME',
      { errors: nameValidation.errors }
    );
  }
  
  const projectPath = path.resolve(process.cwd(), projectName);
  
  // Check if directory already exists and is not empty
  try {
    const exists = await pathExists(projectPath);
    if (exists) {
      const files = await readdir(projectPath);
      if (files.length > 0) {
        throw new InstallerError(
          `Directory ${projectName} already exists and is not empty. Please choose another name or empty the directory.`,
          'DIR_NOT_EMPTY'
        );
      }
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    // Directory doesn't exist, which is good
  }

  // Create directory if it doesn't exist
  try {
    await mkdir(projectPath, { recursive: true });
  } catch (error) {
    throw new InstallerError(
      `Failed to create directory: ${error.message}`,
      'DIR_CREATE_FAILED'
    );
  }

  // Copy template files
  await copyTemplateFiles(projectPath, false, options);

  return projectPath;
}

/**
 * Adds AI Project Starter scaffolding to an existing project
 * @param {Object} options - Configuration options
 * @returns {string} - Path to the project
 * @throws {InstallerError} - If adding to project fails
 */
async function addToProject(options = {}) {
  const projectPath = process.cwd();

  try {
    // Verify it's a directory
    const stats = await stat(projectPath);
    if (!stats.isDirectory()) {
      throw new InstallerError(
        'Current path is not a directory',
        'NOT_DIRECTORY'
      );
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    throw new InstallerError(
      `Failed to access directory: ${error.message}`,
      'DIR_ACCESS_FAILED'
    );
  }

  // Copy template files, preserving existing files
  await copyTemplateFiles(projectPath, true, options);

  return projectPath;
}

/**
 * Copies template files to the target directory
 * @param {string} targetPath - Path to copy files to
 * @param {boolean} preserveExisting - Whether to preserve existing files
 * @param {Object} options - Configuration options
 * @throws {InstallerError} - If template copying fails
 */
async function copyTemplateFiles(targetPath, preserveExisting = false, options = {}) {
  const templateDir = path.join(__dirname, 'templates', 'next');
  
  try {
    // Create necessary directories
    await createDirectoryStructure(templateDir, targetPath);
    
    // Copy all files in the template directory to the target
    await copyFiles(templateDir, targetPath, preserveExisting);
    
    // Create symlinks
    if (!options.skipSymlink) {
      await createSymlinks(targetPath);
    }
  } catch (error) {
    if (error instanceof InstallerError) {
      throw error;
    }
    throw new InstallerError(
      `Failed to copy template files: ${error.message}`,
      'COPY_FAILED'
    );
  }
}

/**
 * Creates the directory structure for the project
 * @param {string} sourceDir - Source template directory
 * @param {string} targetDir - Target project directory
 */
async function createDirectoryStructure(sourceDir, targetDir) {
  try {
    const files = await getAllFiles(sourceDir);
    const dirs = new Set();
    
    // Extract directories from file paths
    for (const file of files) {
      const relativePath = path.relative(sourceDir, file);
      const dirName = path.dirname(relativePath);
      if (dirName !== '.') {
        dirs.add(dirName);
      }
    }
    
    // Create directories in order of depth
    const sortedDirs = Array.from(dirs).sort((a, b) => {
      return a.split(path.sep).length - b.split(path.sep).length;
    });
    
    for (const dir of sortedDirs) {
      const targetDirPath = path.join(targetDir, dir);
      await mkdir(targetDirPath, { recursive: true });
    }
  } catch (error) {
    throw new InstallerError(
      `Failed to create directory structure: ${error.message}`,
      'DIR_STRUCTURE_FAILED'
    );
  }
}

/**
 * Copies files from source to target
 * @param {string} sourceDir - Source template directory
 * @param {string} targetDir - Target project directory
 * @param {boolean} preserveExisting - Whether to preserve existing files
 */
async function copyFiles(sourceDir, targetDir, preserveExisting) {
  try {
    const files = await getAllFiles(sourceDir);
    
    for (const file of files) {
      const relativePath = path.relative(sourceDir, file);
      const targetFile = path.join(targetDir, relativePath);
      
      // Skip if file exists and we want to preserve existing files
      if (preserveExisting) {
        const exists = await pathExists(targetFile);
        if (exists) continue;
      }
      
      // Ensure directory exists
      const targetFileDir = path.dirname(targetFile);
      await mkdir(targetFileDir, { recursive: true });
      
      // Copy the file
      await copyFile(file, targetFile);
    }
  } catch (error) {
    throw new InstallerError(
      `Failed to copy files: ${error.message}`,
      'COPY_FILES_FAILED'
    );
  }
}

/**
 * Creates symlinks for AI tooling configuration
 * @param {string} targetDir - Target project directory
 */
async function createSymlinks(targetDir) {
  const links = [
    { src: 'rules.yaml', dest: '.windsurfrules' },
    { src: 'rules.yaml', dest: '.cursorrules' },
    { src: 'rules.yaml', dest: '.clinerules' }
  ];
  
  for (const link of links) {
    try {
      const srcPath = path.join(targetDir, link.src);
      const destPath = path.join(targetDir, link.dest);
      
      // Skip if destination already exists
      const exists = await pathExists(destPath);
      if (exists) continue;
      
      // Create relative symlink
      await symlink(link.src, destPath, 'file');
    } catch (error) {
      console.error(`Warning: Failed to create symlink ${link.dest}: ${error.message}`);
      // Continue despite symlink errors
    }
  }
}

/**
 * Recursively gets all files in a directory
 * @param {string} dir - Directory to get files from
 * @returns {Promise<string[]>} - Array of file paths
 */
async function getAllFiles(dir) {
  const result = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subDirFiles = await getAllFiles(fullPath);
        result.push(...subDirFiles);
      } else {
        result.push(fullPath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to read directory: ${error.message}`);
  }
  
  return result;
}

module.exports = {
  createProject,
  addToProject,
  InstallerError
};
